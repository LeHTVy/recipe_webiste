// src/pages/Profile/Profile.jsx - Thêm avatar upload functionality
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { mockRecipes } from '../../data/mockData';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRecipes, setUserRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    dietaryPreferences: user?.dietaryPreferences || []
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const savedRecipes = JSON.parse(localStorage.getItem(`user_recipes_${user.id}`) || '[]');
    setUserRecipes(savedRecipes);

    const savedFavorites = JSON.parse(localStorage.getItem(`user_favorites_${user.id}`) || '[]');
    const favoriteRecipeData = mockRecipes.filter(recipe => 
      savedFavorites.includes(recipe.id)
    );
    setFavoriteRecipes(favoriteRecipeData);
  }, [user, navigate]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
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
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
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
        alert('Error reading file');
        setIsUploadingAvatar(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image');
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
    <div className={styles.profileContainer}>
      <div className="container">
        <div className={styles.profileContent}>
          {/* Left Sidebar - User Info */}
          <div className={styles.sidebar}>
            <div className={styles.userCard}>
              <div className={styles.avatarSection}>
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
                      '📷'
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
                <div className={styles.userBasicInfo}>
                  <h2 className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className={styles.username}>@{user.username}</p>
                  <p className={styles.joinDate}>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {user.bio && (
                <div className={styles.bioSection}>
                  <p className={styles.bio}>{user.bio}</p>
                </div>
              )}

              <div className={styles.statsSection}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{userRecipes.length}</span>
                  <span className={styles.statLabel}>Recipes</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{favoriteRecipes.length}</span>
                  <span className={styles.statLabel}>Favorites</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>{user.totalRatings || 0}</span>
                  <span className={styles.statLabel}>Reviews</span>
                </div>
              </div>

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

          {/* Right Content - Tabs and Content */}
          <div className={styles.mainContent}>
            <div className={styles.tabNavigation}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'recipes' ? styles.active : ''}`}
                onClick={() => setActiveTab('recipes')}
              >
                My Recipes ({userRecipes.length})
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites ({favoriteRecipes.length})
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewContent}>
                  <div className={styles.welcomeSection}>
                    <h3 className={styles.welcomeTitle}>
                      Welcome back, {user.firstName}! 👋
                    </h3>
                    <p className={styles.welcomeText}>
                      Ready to share some delicious recipes with the TasteMate community?
                    </p>
                  </div>

                  <div className={styles.quickStats}>
                    <div className={styles.quickStatCard}>
                      <h4>Recent Activity</h4>
                      <p>You've created {userRecipes.length} recipes and saved {favoriteRecipes.length} favorites</p>
                    </div>
                    <div className={styles.quickStatCard}>
                      <h4>Community Impact</h4>
                      <p>Your recipes have been viewed and loved by the community</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recipes' && (
                <div className={styles.recipesContent}>
                  {userRecipes.length > 0 ? (
                    <div className={styles.recipesGrid}>
                      {userRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>📝</div>
                      <h3>No recipes yet</h3>
                      <p>Start sharing your favorite recipes with the community!</p>
                      <button className={styles.createBtn}>
                        Create Your First Recipe
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className={styles.favoritesContent}>
                  {favoriteRecipes.length > 0 ? (
                    <div className={styles.recipesGrid}>
                      {favoriteRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>❤️</div>
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
            </div>
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
    </div>
  );
};

export default Profile;
