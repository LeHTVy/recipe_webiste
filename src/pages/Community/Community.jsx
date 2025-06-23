import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import {
  toggleCommunityBookmark,
  isCommunityPostBookmarked
} from '../../lib/localStorageUtils';
import { 
  communityPosts, 
  trendingRecipes, 
  suggestedChefs, 
  recipeCategories, 
  communityStats 
} from '../../data/mockCommunityData';
import { 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaBookmark, 
  FaClock, 
  FaUsers, 
  FaChartBar, 
  FaStar, 
  FaCheckCircle, 
  FaFire, 
  FaArrowUp,
  FaUserPlus,
  FaEllipsisH,
  FaImage,
  FaVideo,
  FaSmile
} from 'react-icons/fa';
import styles from './Community.module.css';

const Community = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Initialize community users and recipes in localStorage if not present
  useEffect(() => {
    const existingCommunityUsers = localStorage.getItem('tastemate_community_users');
    if (!existingCommunityUsers) {
      // Import and store community users
      import('../../data/mockCommunityData').then(({ communityUsers }) => {
        localStorage.setItem('tastemate_community_users', JSON.stringify(communityUsers));
        console.log('Initialized community users in localStorage:', communityUsers.length);
      });
    }
    
    const existingRecipes = localStorage.getItem('tastemate_recipes');
    if (!existingRecipes) {
      // Import and store recipes from mockData
      import('../../data/mockData').then((mockDataModule) => {
        const recipes = mockDataModule.default || mockDataModule.recipes || [];
        localStorage.setItem('tastemate_recipes', JSON.stringify(recipes));
        console.log('Initialized recipes in localStorage:', recipes.length);
      });
    }
  }, []);

  // Load posts from localStorage and merge with mock data
  useEffect(() => {
    const savedPosts = localStorage.getItem('tastemate_community_posts');
    let userPosts = [];
    
    if (savedPosts) {
      try {
        userPosts = JSON.parse(savedPosts);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
      }
    }
    
    // Merge user posts with mock posts, user posts first
    const allPosts = [...userPosts, ...communityPosts];
    
    // Update bookmark status for each post based on localStorage
    const postsWithBookmarkStatus = allPosts.map(post => ({
      ...post,
      isBookmarked: isCommunityPostBookmarked(post.id)
    }));
    
    setPosts(postsWithBookmarkStatus);
  }, []);

  // Handle post interactions
  const handleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleBookmark = (postId) => {
    // Find the post object
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Toggle bookmark in localStorage
    const isBookmarked = toggleCommunityBookmark(post);
    
    // Update local state
    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId 
          ? { ...p, isBookmarked }
          : p
      )
    );
    
    // Show appropriate notification
    if (isBookmarked) {
      showSuccess('Post bookmarked!');
    } else {
      showSuccess('Post removed from bookmarks!');
    }
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  const handleFollow = (userId) => {
    showSuccess('Following user!');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className={styles.starFilled} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className={styles.starHalf} />);
      } else {
        stars.push(<FaStar key={i} className={styles.starEmpty} />);
      }
    }
    return stars;
  };

  const PostCard = ({ post }) => (
    <div className={`${styles.postCard} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <div className={styles.userInfo}>
          <img 
            src={post.user.avatar} 
            alt={post.user.displayName}
            className={styles.userAvatar}
          />
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              <span className={styles.displayName}>{post.user.displayName}</span>
              {post.user.isVerified && <FaCheckCircle className={styles.verifiedIcon} />}
              <span className={styles.userType}>• {post.user.userType}</span>
            </div>
            <div className={styles.postMeta}>
              <span className={styles.location}>{post.user.location}</span>
              <span className={styles.timeAgo}>• {formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button className={styles.moreBtn}>
          <FaEllipsisH />
        </button>
      </div>

      {/* Post Content */}
      <div className={styles.postContent}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.postDescription}>{post.description}</p>
        
        {/* Recipe Metadata */}
        <div className={styles.recipeMetadata}>
          <div className={styles.metaItem}>
            <FaClock className={styles.metaIcon} />
            <span>{post.cookingTime} min</span>
          </div>
          <div className={styles.metaItem}>
            <FaUsers className={styles.metaIcon} />
            <span>{post.servings} servings</span>
          </div>
          <div className={styles.metaItem}>
            <FaChartBar className={styles.metaIcon} />
            <span>{post.difficulty}</span>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.rating}>
              {renderStars(post.rating)}
              <span className={styles.ratingValue}>{post.rating}</span>
            </div>
          </div>
        </div>

        {/* Post Images */}
        {post.images && (
          <div className={`${styles.postImages} ${post.images.length > 1 ? styles.multipleImages : ''}`}>
            {post.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${post.title} ${index + 1}`}
                className={styles.postImage}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionBtn} ${post.isLiked ? styles.liked : ''}`}
            onClick={() => handleLike(post.id)}
          >
            <FaHeart />
            <span>{formatNumber(post.likes)}</span>
          </button>
          <button className={styles.actionBtn}>
            <FaComment />
            <span>{post.comments}</span>
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => handleShare(post)}
          >
            <FaShare />
            <span>{post.shares}</span>
          </button>
        </div>
        <button 
          className={`${styles.bookmarkBtn} ${post.isBookmarked ? styles.bookmarked : ''}`}
          onClick={() => handleBookmark(post.id)}
        >
          <FaBookmark />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${styles.communityPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.communityContainer}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Create Post Section */}
          {isAuthenticated && (
            <div className={styles.createPostCard}>
              <div className={styles.createPostHeader}>
                <img 
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=00bf63&color=fff`}
                  alt="Your avatar"
                  className={styles.userAvatar}
                />
                <input 
                  type="text"
                  placeholder="Share your latest culinary creation..."
                  className={styles.createPostInput}
                  onClick={() => navigate('/create-post')}
                  readOnly
                />
              </div>
              <div className={styles.createPostActions}>
                <button 
                  className={styles.createActionBtn}
                  onClick={() => navigate('/create-post?type=photo')}
                >
                  <FaImage /> Photo
                </button>
                <button 
                  className={styles.createActionBtn}
                  onClick={() => navigate('/create-post?type=video')}
                >
                  <FaVideo /> Video
                </button>
                <button 
                  className={styles.createActionBtn}
                  onClick={() => navigate('/create-post?type=feeling')}
                >
                  <FaSmile /> Feeling
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className={styles.authPrompt}>
              <p>Please log in to create posts and interact with the community.</p>
              <button 
                className={styles.loginBtn}
                onClick={() => navigate('/auth')}
              >
                Log In
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Posts
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'following' ? styles.active : ''}`}
              onClick={() => setActiveFilter('following')}
            >
              Following
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'trending' ? styles.active : ''}`}
              onClick={() => setActiveFilter('trending')}
            >
              <FaFire /> Trending
            </button>
          </div>

          {/* Posts Feed */}
          <div className={styles.postsContainer}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Community Stats */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Community Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{formatNumber(communityStats.totalUsers)}</span>
                <span className={styles.statLabel}>Food Lovers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{formatNumber(communityStats.totalRecipes)}</span>
                <span className={styles.statLabel}>Recipes</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{formatNumber(communityStats.totalLikes)}</span>
                <span className={styles.statLabel}>Likes</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{formatNumber(communityStats.activeToday)}</span>
                <span className={styles.statLabel}>Active Today</span>
              </div>
            </div>
          </div>

          {/* Trending Recipes */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              <FaArrowUp className={styles.titleIcon} />
              Trending Recipes
            </h3>
            <div className={styles.trendingList}>
              {trendingRecipes.map(recipe => (
                <div key={recipe.id} className={styles.trendingItem}>
                  <img src={recipe.image} alt={recipe.title} className={styles.trendingImage} />
                  <div className={styles.trendingInfo}>
                    <h4 className={styles.trendingTitle}>{recipe.title}</h4>
                    <div className={styles.trendingStats}>
                      <span className={styles.views}>{formatNumber(recipe.views)} views</span>
                      <span className={styles.trend}>{recipe.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Chefs */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>
              <FaUserPlus className={styles.titleIcon} />
              Suggested Chefs
            </h3>
            <div className={styles.suggestedList}>
              {suggestedChefs.map(chef => (
                <div key={chef.id} className={styles.suggestedItem}>
                  <img src={chef.avatar} alt={chef.displayName} className={styles.suggestedAvatar} />
                  <div className={styles.suggestedInfo}>
                    <div className={styles.suggestedName}>
                      <span>{chef.displayName}</span>
                      {chef.isVerified && <FaCheckCircle className={styles.verifiedIcon} />}
                    </div>
                    <span className={styles.suggestedSpeciality}>{chef.speciality}</span>
                    <span className={styles.suggestedFollowers}>{formatNumber(chef.followers)} followers</span>
                  </div>
                  <button 
                    className={styles.followBtn}
                    onClick={() => handleFollow(chef.id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Categories */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Popular Categories</h3>
            <div className={styles.categoriesList}>
              {recipeCategories.map((category, index) => (
                <div key={index} className={styles.categoryItem}>
                  <div 
                    className={styles.categoryColor}
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCount}>{formatNumber(category.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
