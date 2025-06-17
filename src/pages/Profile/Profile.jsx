// src/pages/Profile/Profile.jsx - Thêm avatar upload functionality
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import ProfileRecipeCard from '../../components/ProfileRecipeCard/ProfileRecipeCard';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { FaCamera, FaEdit, FaHeart, FaClock, FaUsers, FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaEye, FaComment } from 'react-icons/fa';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { favorites } = useFavorites();
  const { showDeleteSuccess, showError } = useNotification();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('recipes');
  const [userRecipes, setUserRecipes] = useState([]);
  const [userCommunityPosts, setUserCommunityPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    dietaryPreferences: user?.dietaryPreferences || []
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load user's created recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const userCreatedRecipes = savedRecipes.filter(recipe => recipe.createdBy === user.id);
    setUserRecipes(userCreatedRecipes);

    // Load user's community posts from localStorage
    const savedCommunityPosts = JSON.parse(localStorage.getItem('tastemate_community_posts') || '[]');
    const userCreatedPosts = savedCommunityPosts.filter(post => post.userId === user.id);
    setUserCommunityPosts(userCreatedPosts);
  }, [user, navigate]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleRecipeEdit = (recipe) => {
    navigate(`/create-recipe?edit=${recipe.id}`);
  };

  const handleRecipeDelete = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const confirmDeleteRecipe = () => {
    if (recipeToDelete) {
      const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      const updatedRecipes = savedRecipes.filter(r => r.id !== recipeToDelete.id);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      
      // Update the state
      const userCreatedRecipes = updatedRecipes.filter(r => r.createdBy === user.id);
      setUserRecipes(userCreatedRecipes);
      
      showDeleteSuccess(recipeToDelete.title || 'Recipe');
      setRecipeToDelete(null);
    }
  };

  const handleRecipePublish = (recipe) => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const updatedRecipes = savedRecipes.map(r => 
      r.id === recipe.id ? { ...r, status: 'published' } : r
    );
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    
    // Update the state
    const userCreatedRecipes = updatedRecipes.filter(r => r.createdBy === user.id);
    setUserRecipes(userCreatedRecipes);
  };

  const handleRecipeView = (recipe) => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryPreferenceChange = (preference) => {
    setEditForm(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        
        // Update user profile with new avatar
        updateProfile({ profilePicture: base64String });
        setIsUploadingAvatar(false);
      };
      
      reader.onerror = () => {
        showError('Error reading file');
        setIsUploadingAvatar(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showError('Error uploading image');
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Keto', 'Paleo', 'Low-Carb', 'High-Protein'
  ];

  return (
    <div className={`${styles.profileContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.profileContent}>
        {/* Instagram-like Header - User Info at Top */}
        <div className={styles.profileHeader}>
          <div className={styles.userInfoSection}>
            <div className={styles.avatarContainer}>
              <img 
                src={user.profilePicture} 
                alt={`${user.firstName} ${user.lastName}`}
                className={styles.avatar}
              />
              <button 
                className={styles.avatarUploadBtn}
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <div className={styles.uploadSpinner}></div>
                ) : (
                  <FaCamera />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.hiddenFileInput}
              />
            </div>
            
            <div className={styles.userDetails}>
              <div className={styles.userBasicInfo}>
                <h1 className={styles.userName}>
                  {user.firstName} {user.lastName}
                </h1>
                <p className={styles.username}>@{user.username}</p>
                {user.location && (
                  <p className={styles.location}>
                    <FaMapMarkerAlt /> {user.location}
                  </p>
                )}
                <p className={styles.joinDate}>
                  <FaCalendarAlt /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className={styles.statsSection}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{userRecipes.length}</span>
                  <span className={styles.statLabel}>Recipes</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{favorites.length}</span>
                  <span className={styles.statLabel}>Favorites</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.followers || 0}</span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.following || 0}</span>
                  <span className={styles.statLabel}>Following</span>
                </div>
              </div>
              
              <div className={styles.actionButtons}>
                <button 
                  onClick={() => setIsEditing(true)}
                  className={styles.editBtn}
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {user.bio && (
            <div className={styles.bioSection}>
              <p className={styles.bio}>{user.bio}</p>
            </div>
          )}
          
          {user.dietaryPreferences?.length > 0 && (
            <div className={styles.dietarySection}>
              <h4 className={styles.sectionTitle}>Dietary Preferences</h4>
              <div className={styles.dietaryTags}>
                {user.dietaryPreferences.map(pref => (
                  <span key={pref} className={styles.dietaryTag}>
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs and Content Below */}
        <div className={styles.mainContent}>
          <div className={styles.tabNavigation}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'recipes' ? styles.active : ''}`}
              onClick={() => setActiveTab('recipes')}
            >
              <FaEdit className={styles.tabIcon} />
              My Recipes
              <span className={styles.tabCount}>({userRecipes.length})</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <FaHeart className={styles.tabIcon} />
              Favourites
              <span className={styles.tabCount}>({favorites.length})</span>
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.active : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <FaClock className={styles.tabIcon} />
              Recent Activity
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'community' ? styles.active : ''}`}
              onClick={() => setActiveTab('community')}
            >
              <FaUsers className={styles.tabIcon} />
              Community
            </button>
          </div>

            <div className={styles.tabContent}>

              {activeTab === 'recipes' && (
                <div className={styles.recipesContent}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>My Recipe Collection</h2>
                    <p className={styles.sectionSubtitle}>Manage and share your culinary creations</p>
                  </div>
                  {userRecipes.length > 0 ? (
                    <div className={styles.recipesGrid}>
                      {userRecipes.map(recipe => (
                        <div key={recipe.id} className={styles.recipeCardWrapper}>
                          <ProfileRecipeCard 
                            recipe={recipe}
                            onEdit={handleRecipeEdit}
                            onDelete={handleRecipeDelete}
                            onPublish={handleRecipePublish}
                            onView={handleRecipeView}
                          />
                          <div className={styles.recipeStats}>
                            <span className={styles.recipeStat}>
                              <FaEye /> {recipe.views || 0}
                            </span>
                            <span className={styles.recipeStat}>
                              <FaHeart /> {recipe.likes || 0}
                            </span>
                            <span className={styles.recipeStat}>
                              <FaComment /> {recipe.comments || 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}><FaEdit /></div>
                      <h3>No recipes yet</h3>
                      <p>Start sharing your favorite recipes with the community!</p>
                      <button 
                        className={styles.createBtn}
                        onClick={() => navigate('/create-recipe')}
                      >
                        Create Your First Recipe
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className={styles.favoritesContent}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Favourite Recipes</h2>
                    <p className={styles.sectionSubtitle}>Your saved recipes from the community</p>
                  </div>
                  {favorites.length > 0 ? (
                    <div className={styles.recipesGrid}>
                      {favorites.map(recipe => (
                        <div key={recipe.id} className={styles.favoriteCardWrapper}>
                          <RecipeCard recipe={recipe} />
                          <div className={styles.favoriteInfo}>
                            <div className={styles.rating}>
                              <FaStar className={styles.starIcon} />
                              <span>{recipe.rating || 4.5}</span>
                            </div>
                            <span className={styles.difficulty}>
                              {recipe.difficulty || 'Medium'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}><FaHeart /></div>
                      <h3>No favorites yet</h3>
                      <p>Start exploring recipes and save your favorites!</p>
                      <button 
                        className={styles.exploreBtn}
                        onClick={() => navigate('/')}
                      >
                        Explore Recipes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className={styles.activityContent}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    <p className={styles.sectionSubtitle}>Your latest interactions and updates</p>
                  </div>
                  <div className={styles.activityTimeline}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <FaEdit />
                      </div>
                      <div className={styles.activityContent}>
                        <h4>Created a new recipe</h4>
                        <p>"Delicious Pasta Carbonara" - 2 days ago</p>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <FaHeart />
                      </div>
                      <div className={styles.activityContent}>
                        <h4>Liked a recipe</h4>
                        <p>"Chocolate Chip Cookies" by Sarah Johnson - 3 days ago</p>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <FaComment />
                      </div>
                      <div className={styles.activityContent}>
                        <h4>Commented on a recipe</h4>
                        <p>"Amazing flavors!" on "Thai Green Curry" - 5 days ago</p>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <FaUsers />
                      </div>
                      <div className={styles.activityContent}>
                        <h4>Joined TasteMate community</h4>
                        <p>Welcome to our cooking community! - 1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className={styles.communityContent}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Community & Achievements</h2>
                    <p className={styles.sectionSubtitle}>Your groups and accomplishments</p>
                  </div>
                  
                  <div className={styles.communitySection}>
                    <h3 className={styles.subsectionTitle}>Groups Joined</h3>
                    <div className={styles.groupsGrid}>
                      <div className={styles.groupCard}>
                        <div className={styles.groupIcon}>🍝</div>
                        <h4>Italian Cuisine Lovers</h4>
                        <p>1.2k members</p>
                      </div>
                      <div className={styles.groupCard}>
                        <div className={styles.groupIcon}>🥗</div>
                        <h4>Healthy Eating</h4>
                        <p>856 members</p>
                      </div>
                      <div className={styles.groupCard}>
                        <div className={styles.groupIcon}>🍰</div>
                        <h4>Baking Masters</h4>
                        <p>2.1k members</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.communitySection}>
                    <h3 className={styles.subsectionTitle}>Achievements</h3>
                    <div className={styles.achievementsGrid}>
                      <div className={styles.achievementCard}>
                        <div className={styles.achievementIcon}>
                          <FaTrophy />
                        </div>
                        <h4>First Recipe</h4>
                        <p>Created your first recipe</p>
                      </div>
                      <div className={styles.achievementCard}>
                        <div className={styles.achievementIcon}>
                          <FaHeart />
                        </div>
                        <h4>Recipe Lover</h4>
                        <p>Saved 10 favorite recipes</p>
                      </div>
                      <div className={styles.achievementCard}>
                        <div className={styles.achievementIcon}>
                          <FaUsers />
                        </div>
                        <h4>Community Member</h4>
                        <p>Active for 30 days</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.communitySection}>
                    <h3 className={styles.subsectionTitle}>My Community Posts</h3>
                    {userCommunityPosts.length > 0 ? (
                      <div className={styles.communityPostsGrid}>
                        {userCommunityPosts.map((post) => (
                          <div key={post.id} className={styles.communityPostCard}>
                            <div className={styles.postHeader}>
                              <h4 className={styles.postTitle}>{post.title || 'Untitled Post'}</h4>
                              <span className={styles.postDate}>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className={styles.postContent}>
                              {post.content.length > 100 
                                ? `${post.content.substring(0, 100)}...` 
                                : post.content
                              }
                            </p>
                            {post.images && post.images.length > 0 && (
                              <div className={styles.postImages}>
                                <img 
                                  src={post.images[0]} 
                                  alt="Post preview" 
                                  className={styles.postPreviewImage}
                                />
                                {post.images.length > 1 && (
                                  <span className={styles.moreImages}>
                                    +{post.images.length - 1} more
                                  </span>
                                )}
                              </div>
                            )}
                            <div className={styles.postStats}>
                              <span><FaHeart /> {post.likes || 0}</span>
                              <span><FaComment /> {post.comments || 0}</span>
                              <span><FaEye /> {post.views || 0}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No community posts yet. Share your culinary journey with the community!</p>
                        <button 
                          className={styles.createPostBtn}
                          onClick={() => navigate('/create-post')}
                        >
                          Create Your First Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="City, Country"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Dietary Preferences</label>
                <div className={styles.checkboxGrid}>
                  {dietaryOptions.map(option => (
                    <label key={option} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={editForm.dietaryPreferences.includes(option)}
                        onChange={() => handleDietaryPreferenceChange(option)}
                        className={styles.checkbox}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className={styles.saveBtn}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteRecipe}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipeToDelete?.title || 'this recipe'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Profile;
