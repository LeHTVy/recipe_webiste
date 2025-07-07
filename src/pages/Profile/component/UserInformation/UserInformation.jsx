import React, { useRef } from 'react';
import { FaCamera, FaEdit, FaMapMarkerAlt, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../../../../context/ThemeContext';
import styles from './UserInformation.module.css';
const UserInformation = ({ 
  user, 
  userRecipes, 
  userCommunityPosts, 
  followingCount, 
  followersCount, 
  onEditProfile, 
  onLogout, 
  updateProfile,
  showError,
  isUploadingAvatar,
  setIsUploadingAvatar
}) => {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
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

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently joined';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className={`${styles.userInformation} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Avatar Section */}
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
      </div>

      {/* Basic Information */}
      <div className={styles.basicInfo}>
        <h1 className={styles.userName}>
          {user?.firstName} {user?.lastName}
        </h1>
        <p className={styles.userUsername}>@{user?.username}</p>
        
        {user?.location && (
          <div className={styles.locationInfo}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span>{user.location}</span>
          </div>
        )}
        
        <div className={styles.joinDate}>
          <FaCalendarAlt className={styles.calendarIcon} />
          <span>Joined {formatJoinDate(user?.createdAt)}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.statsSection}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{userRecipes?.length || 0}</span>
          <span className={styles.statLabel}>RECIPES</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{userCommunityPosts?.length || 0}</span>
          <span className={styles.statLabel}>POSTS</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{followingCount || 0}</span>
          <span className={styles.statLabel}>FOLLOWING</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{followersCount || 0}</span>
          <span className={styles.statLabel}>FOLLOWERS</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          className={styles.editButton}
          onClick={onEditProfile}
        >
          <FaEdit /> Edit Profile
        </button>
        <button 
          className={styles.logoutButton}
          onClick={onLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Bio */}
      {user?.bio && (
        <div className={styles.bioSection}>
          <h3 className={styles.bioTitle}>About</h3>
          <p className={styles.bioText}>{user.bio}</p>
        </div>
      )}

      {/* Dietary Preferences */}
      {user?.dietaryPreferences && user.dietaryPreferences.length > 0 && (
        <div className={styles.preferencesSection}>
          <h3 className={styles.preferencesTitle}>Dietary Preferences</h3>
          <div className={styles.preferencesTags}>
            {user.dietaryPreferences.map((preference, index) => (
              <span key={index} className={styles.preferenceTag}>
                {preference}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;