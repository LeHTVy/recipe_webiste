import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { 
  FaHeart, 
  FaShare, 
  FaBookmark, 
  FaUtensils, 
  FaNewspaper, 
  FaUsers, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaComment,
  FaArrowLeft
} from 'react-icons/fa';
import styles from './AuthorProfile.module.css';
import { mockRecipes } from '../../data/mockData';
import {
  followUser,
  unfollowUser,
  isFollowing as checkIsFollowing,
  toggleAuthorBookmark,
  isAuthorBookmarked,
  getFollowers
} from '../../lib/localStorageUtils';

const AuthorProfile = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { showNotification } = useNotification();
  const { isDarkMode } = useTheme();
  
  const [activeTab, setActiveTab] = useState('recipes');
  const [authorData, setAuthorData] = useState(null);
  const [authorRecipes, setAuthorRecipes] = useState([]);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [authorRating, setAuthorRating] = useState({ averageRating: 0, totalRatings: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthorData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find author from recipes using proper ID matching
        const allRecipes = [...mockRecipes, ...JSON.parse(localStorage.getItem('recipes') || '[]')];
        const communityPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const tasteMateUsers = JSON.parse(localStorage.getItem('tastemate_users') || '[]');
        
        console.log('Loading author data for ID:', authorId);
        console.log('Total recipes available:', allRecipes.length);
        console.log('Total community posts:', communityPosts.length);
        console.log('Total TasteMate users:', tasteMateUsers.length);
        
        // Check if this is a TasteMate user ID
        let tasteMateUser = null;
        if (authorId.startsWith('tastemate-user-')) {
          const userId = parseInt(authorId.replace('tastemate-user-', ''));
          tasteMateUser = tasteMateUsers.find(user => user.id === userId);
          console.log('Found TasteMate user:', tasteMateUser);
        }
        
        // Debug: Show first few recipes and their author structures
        console.log('Sample recipes:', allRecipes.slice(0, 3).map(r => ({
          id: r.id,
          title: r.title,
          author: r.author,
          createdBy: r.createdBy
        })));
        
        // Find recipes by this author using comprehensive matching
        const recipes = allRecipes.filter(recipe => {
          if (recipe.author) {
            // Primary: Match by author ID (including TasteMate user IDs)
            if (recipe.author.id === authorId) {
              return true;
            }
            
            // Match by TasteMate user ID in author.userId field
            if (tasteMateUser && recipe.author.userId === tasteMateUser.id) {
              return true;
            }
            
            // Secondary: Match by author name converted to ID format
            if (recipe.author.name) {
              const nameAsId = recipe.author.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              if (nameAsId === authorId) {
                return true;
              }
              
              // Tertiary: Partial name matching for backward compatibility
              if (recipe.author.name.toLowerCase().includes(authorId.toLowerCase().replace(/-/g, ' '))) {
                return true;
              }
            }
          }
          
          // Quaternary: Match by createdBy field (for TasteMate users)
          if (tasteMateUser && recipe.createdBy === tasteMateUser.id) {
            return true;
          }
          
          // Fallback: Match by createdBy field as string
          return recipe.createdBy === authorId;
         });
         
         console.log('Found recipes for author:', recipes.length);
         if (recipes.length > 0) {
           console.log('First recipe author data:', recipes[0].author);
         }
         
        // Set author data based on TasteMate user or recipe data
        if (tasteMateUser) {
          // Use TasteMate user data as primary source
          setAuthorData({
            id: authorId,
            name: `${tasteMateUser.firstName} ${tasteMateUser.lastName}`,
            avatar: tasteMateUser.profilePicture || `https://ui-avatars.com/api/?name=${tasteMateUser.firstName}+${tasteMateUser.lastName}&background=00bf63&color=fff`,
            bio: tasteMateUser.bio || 'TasteMate user and recipe creator',
            location: tasteMateUser.location || 'Unknown',
            joinDate: tasteMateUser.createdAt || new Date().toISOString(),
            totalRecipes: recipes.length,
            followers: tasteMateUser.followers || 0,
            following: tasteMateUser.following || 0,
            username: tasteMateUser.username,
            email: tasteMateUser.email,
            recipesCreated: tasteMateUser.recipesCreated || recipes.length,
            totalRatings: tasteMateUser.totalRatings || 0,
            favoriteRecipes: tasteMateUser.favoriteRecipes || [],
            dietaryPreferences: tasteMateUser.dietaryPreferences || []
          });
        } else if (recipes.length > 0) {
          // Find the most complete author data from all recipes
          let bestAuthor = null;
          let maxCompleteness = 0;
          
          recipes.forEach(recipe => {
            if (recipe.author) {
              // Calculate completeness score
              let completeness = 0;
              if (recipe.author.id) completeness += 3;
              if (recipe.author.name) completeness += 2;
              if (recipe.author.bio) completeness += 1;
              if (recipe.author.location) completeness += 1;
              if (recipe.author.joinDate) completeness += 1;
              if (recipe.author.followers !== undefined) completeness += 1;
              if (recipe.author.following !== undefined) completeness += 1;
              
              if (completeness > maxCompleteness) {
                maxCompleteness = completeness;
                bestAuthor = recipe.author;
              }
            }
          });
          
          const author = bestAuthor || {
            name: recipes[0].createdBy || 'Unknown Author',
            avatar: 'https://ui-avatars.com/api/?name=Unknown+Author&background=00bf63&color=fff',
            bio: 'Food enthusiast and recipe creator'
          };
          
          setAuthorData({
            ...author,
            id: author.id || authorId,
            joinDate: author.joinDate || '2023-01-01T00:00:00Z',
            location: author.location || 'Unknown',
            totalRecipes: recipes.length,
            followers: author.followers || 0,
            following: author.following || 0
          });
        } else {
          // If no recipes found, create a basic author profile
          setAuthorData({
            id: authorId,
            name: authorId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authorId)}&background=00bf63&color=fff`,
            bio: 'Food enthusiast and recipe creator',
            joinDate: '2023-01-01T00:00:00Z',
            location: 'Unknown',
            totalRecipes: 0,
            followers: 0,
            following: 0
          });
        }
        
        setAuthorRecipes(recipes);
        calculateAuthorRating(recipes);
        
        // Load author posts with comprehensive matching
        const posts = communityPosts.filter(post => {
          // Match by TasteMate user ID
          if (tasteMateUser && post.userId === tasteMateUser.id) {
            return true;
          }
          
          // Match by userId as string (primary)
          if (post.userId === authorId) {
            return true;
          }
          
          // Match by username converted to ID format
          if (post.username) {
            const usernameAsId = post.username.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return usernameAsId === authorId;
          }
          
          // Match by TasteMate username
          if (tasteMateUser && post.username === tasteMateUser.username) {
            return true;
          }
          
          return false;
        });
         
         console.log('Found posts for author:', posts.length);
         setAuthorPosts(posts);
        
        // Load bookmark status using new utility
        setIsBookmarked(isAuthorBookmarked(authorId));
        
        // Load following status using new utility
         setIsFollowing(checkIsFollowing(authorId));
        
        // Update follower count with actual data
        const followers = getFollowers(authorId);
        setAuthorData(prev => ({
          ...prev,
          followers: followers.length
        }));
        
      } catch (error) {
        console.error('Error loading author data:', error);
        showNotification('Error loading author profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthorData();
  }, [authorId, showNotification]);

  const calculateAuthorRating = (recipes) => {
    let totalRating = 0;
    let totalRatings = 0;

    recipes.forEach(recipe => {
      // Get comments for this recipe
      const recipeComments = JSON.parse(localStorage.getItem('recipeComments') || '{}');
      const comments = recipeComments[recipe.id] || recipe.comments || [];
      
      const ratingsFromComments = comments.filter(comment => comment.rating && comment.rating > 0);
      if (ratingsFromComments.length > 0) {
        const recipeTotal = ratingsFromComments.reduce((sum, comment) => sum + comment.rating, 0);
        totalRating += recipeTotal;
        totalRatings += ratingsFromComments.length;
      } else if (recipe.rating && recipe.totalRatings) {
        totalRating += recipe.rating * recipe.totalRatings;
        totalRatings += recipe.totalRatings;
      }
    });

    const averageRating = totalRatings > 0 ? totalRating / totalRatings : 0;
    setAuthorRating({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings
    });
  };

  const handleShare = async () => {
    const authorUrl = `${window.location.origin}/author/${authorId}`;
    try {
      await navigator.clipboard.writeText(authorUrl);
      showNotification('Author profile link copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Could not copy link. Please try again.', 'error');
    }
  };

  const handleBookmark = () => {
    const newBookmarkStatus = toggleAuthorBookmark(authorId);
    
    if (newBookmarkStatus) {
      showNotification('Author bookmarked!', 'success');
    } else {
      showNotification('Author removed from bookmarks', 'info');
    }
    
    setIsBookmarked(newBookmarkStatus);
  };

  const handleFollow = () => {
    let success = false;
    
    if (isFollowing) {
      success = unfollowUser(authorId);
      if (success) {
        showNotification('Unfollowed author', 'info');
        setIsFollowing(false);
        // Update follower count
        setAuthorData(prev => ({
          ...prev,
          followers: Math.max(0, prev.followers - 1)
        }));
      }
    } else {
      success = followUser(authorId);
      if (success) {
        showNotification('Now following author!', 'success');
        setIsFollowing(true);
        // Update follower count
        setAuthorData(prev => ({
          ...prev,
          followers: prev.followers + 1
        }));
      }
    }
    
    if (!success) {
      showNotification('Unable to update follow status. Please try again.', 'error');
    }
  };

  const handleRateAuthor = (rating) => {
    const authorRatings = JSON.parse(localStorage.getItem('authorRatings') || '{}');
    if (!authorRatings[authorId]) {
      authorRatings[authorId] = [];
    }
    
    // Check if user already rated
    const existingRatingIndex = authorRatings[authorId].findIndex(r => r.userId === user?.id);
    
    if (existingRatingIndex >= 0) {
      authorRatings[authorId][existingRatingIndex].rating = rating;
      showNotification('Rating updated!', 'success');
    } else {
      authorRatings[authorId].push({
        userId: user?.id,
        rating,
        createdAt: new Date().toISOString()
      });
      showNotification('Rating submitted!', 'success');
    }
    
    localStorage.setItem('authorRatings', JSON.stringify(authorRatings));
    setUserRating(rating);
    setShowRatingModal(false);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${
            i <= rating ? styles.starFilled : styles.starEmpty
          } ${interactive ? styles.starInteractive : ''}`}
          onClick={() => interactive && onStarClick && onStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recipes':
        return (
          <div className={styles.recipesGrid}>
            {authorRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            {authorRecipes.length === 0 && (
              <div className={styles.emptyState}>
                <FaUtensils className={styles.emptyIcon} />
                <p>No recipes found</p>
              </div>
            )}
          </div>
        );
      
      case 'posts':
        return (
          <div className={styles.postsContainer}>
            {authorPosts.map(post => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <img src={authorData?.avatar} alt={authorData?.name} className={styles.postAvatar} />
                  <div className={styles.postInfo}>
                    <h4>{authorData?.name}</h4>
                    <span className={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={styles.postContent}>
                  <p>{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Post" className={styles.postImage} />
                  )}
                </div>
                <div className={styles.postStats}>
                  <span><FaHeart /> {post.likes || 0}</span>
                  <span><FaComment /> {post.comments?.length || 0}</span>
                </div>
              </div>
            ))}
            {authorPosts.length === 0 && (
              <div className={styles.emptyState}>
                <FaNewspaper className={styles.emptyIcon} />
                <p>No posts found</p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading || !authorData) {
    return (
      <div className={`${styles.authorProfile} ${isDarkMode ? styles.darkMode : ''}`}>
        <LoadingSpinner 
          size="large" 
          message="Loading author profile..." 
          variant="primary"
        />
      </div>
    );
  }

  return (
    <div className={`${styles.authorProfile} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} onClick={handleShare}>
            <FaShare /> Share
          </button>
          <button 
            className={`${styles.actionBtn} ${isBookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
          >
            <FaBookmark /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </div>

      {/* Author Info */}
      <div className={styles.authorInfo}>
        <div className={styles.authorAvatar}>
          <img src={authorData.avatar} alt={authorData.name} />
        </div>
        <div className={styles.authorDetails}>
          <h1 className={styles.authorName}>{authorData.name}</h1>
          <p className={styles.authorBio}>{authorData.bio}</p>
          
          <div className={styles.authorMeta}>
            {authorData.location && (
              <span className={styles.metaItem}>
                <FaMapMarkerAlt /> {authorData.location}
              </span>
            )}
            <span className={styles.metaItem}>
              <FaCalendarAlt /> Joined {new Date(authorData.joinDate).toLocaleDateString()}
            </span>
          </div>

          <div className={styles.authorStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{authorData.totalRecipes}</span>
              <span className={styles.statLabel}>Recipes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{authorPosts.length}</span>
              <span className={styles.statLabel}>Posts</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{authorData.followers}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{authorData.following}</span>
              <span className={styles.statLabel}>Following</span>
            </div>
          </div>

          <div className={styles.authorRating}>
            <div className={styles.ratingDisplay}>
              <div className={styles.stars}>
                {renderStars(authorRating.averageRating)}
              </div>
              <span className={styles.ratingValue}>{authorRating.averageRating}</span>
              <span className={styles.ratingCount}>({authorRating.totalRatings} ratings)</span>
            </div>
            {user && (
              <button 
                className={styles.rateBtn}
                onClick={() => setShowRatingModal(true)}
              >
                <FaStar /> Rate Author
              </button>
            )}
          </div>

          <div className={styles.authorActions}>
            <button 
              className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
              onClick={handleFollow}
            >
              <FaUsers /> {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'recipes' ? styles.active : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <FaUtensils /> Recipes ({authorRecipes.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <FaNewspaper /> Posts ({authorPosts.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Rate {authorData.name}</h3>
            <div className={styles.ratingInput}>
              {renderStars(userRating, true, handleRateAuthor)}
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;