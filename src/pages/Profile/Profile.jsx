import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import UserInformation from './component/UserInformation/UserInformation';
import UserCreatedList from './component/UserCreatedList/UserCreatedList';
import { FaEdit, FaHeart, FaUsers, FaBars, FaTimes, FaBookmark, FaUserFriends, FaComment, FaMapMarkerAlt } from 'react-icons/fa';
import { getFollowingDetails, getFollowersDetails, getAuthorBookmarks, getCommunityBookmarks, getUserById, getCurrentUserId, getFollowersCount } from '../../lib/localStorageUtils';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  useFavorites(); 
  const { showDeleteSuccess, showError } = useNotification();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
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
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [authorBookmarks, setAuthorBookmarks] = useState([]);
  const [communityBookmarks, setCommunityBookmarks] = useState([]);
  


  const getFollowingCount = () => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return 0;
    
    try {
      const followingKey = `following_${currentUserId}`;
      const followingData = localStorage.getItem(followingKey);
      const followingArray = JSON.parse(followingData || '[]');
      return followingArray.length;
    } catch (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
  };
  
  const loadFloatingMenuData = useCallback(() => {
    console.log('Loading floating menu data...');

    const followers = getFollowersDetails();
    console.log('Followers data:', followers);
    console.log('Followers data length:', followers.length);
    
    const authorBookmarkIds = getAuthorBookmarks();
    console.log('Author bookmark IDs:', authorBookmarkIds);
    
    const authorBookmarkDetails = authorBookmarkIds.map(id => getUserById(id)).filter(user => user !== null);
    console.log('Author bookmark details:', authorBookmarkDetails);
    console.log('Author bookmark details length:', authorBookmarkDetails.length);
    setAuthorBookmarks(authorBookmarkDetails);
    console.log('Set authorBookmarks to:', authorBookmarkDetails);
    const communityBookmarksList = getCommunityBookmarks();
    console.log('Community bookmarks:', communityBookmarksList);
    console.log('Community bookmarks length:', communityBookmarksList.length);
    setCommunityBookmarks(communityBookmarksList);
    console.log('Set communityBookmarks to:', communityBookmarksList);
    
    const currentUserId = getCurrentUserId();
    console.log('Current user ID from getCurrentUserId():', currentUserId);
    const directUserId = localStorage.getItem('tastemate_current_user_id');
    console.log('Direct current user ID from localStorage:', directUserId);
    
    if (currentUserId) {
      const followingKey = `following_${currentUserId}`;
      const followingData = localStorage.getItem(followingKey);
      console.log('Raw following data from localStorage with key:', followingKey, 'data:', followingData);
    }
  }, []);

  const reloadFollowingData = useCallback(() => {
    console.log('Reloading following data...');
    
    const followingDetails = getFollowingDetails();
    console.log('Fresh following details:', followingDetails);
    if (modalType === 'following') {
      setModalData(followingDetails);
    }

    loadFloatingMenuData();
  }, [modalType, loadFloatingMenuData]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('localStorage changed, reloading data...');
      reloadFollowingData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleStorageChange);
    };
  }, [reloadFollowingData]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const userCreatedRecipes = savedRecipes.filter(recipe => recipe.createdBy === user.id);
    setUserRecipes(userCreatedRecipes);
    const savedCommunityPosts = JSON.parse(localStorage.getItem('tastemate_community_posts') || '[]');
    const userCreatedPosts = savedCommunityPosts.filter(post => post.userId === user.id);
    setUserCommunityPosts(userCreatedPosts);

    loadFloatingMenuData();
  }, [user, navigate, loadFloatingMenuData]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleRecipeEdit = (recipeId) => {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
      navigate(`/create-recipe?edit=${recipeId}`, { state: { recipe } });
    } else {
      navigate(`/create-recipe?edit=${recipeId}`);
    }
  };

  const handleRecipeDelete = (recipeId) => {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setRecipeToDelete(recipe);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteRecipe = () => {
    if (recipeToDelete) {
      const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      const updatedRecipes = savedRecipes.filter(r => r.id !== recipeToDelete.id);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      
      const userCreatedRecipes = updatedRecipes.filter(r => r.createdBy === user.id);
      setUserRecipes(userCreatedRecipes);
      
      showDeleteSuccess(recipeToDelete.title || 'Recipe');
      setRecipeToDelete(null);
    }
  };

  const handleRecipePublish = (recipeId) => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    const updatedRecipes = savedRecipes.map(r => 
      r.id === recipeId ? { ...r, status: 'published' } : r
    );
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  
    const userCreatedRecipes = updatedRecipes.filter(r => r.createdBy === user.id);
    setUserRecipes(userCreatedRecipes);
  };

  const handleRecipeView = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
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

  

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleFloatingMenu = () => {
    setShowFloatingMenu(!showFloatingMenu);
  };

  const openModal = (type) => {
    console.log(`Opening modal for type: ${type}`);
    setModalType(type);
    let data = [];
    
    switch(type) {
      case 'following':
        data = getFollowingDetails();
        console.log('Following data for modal:', data);
        console.log('Following data length:', data.length);
        break;
      case 'followers':
        const currentUserId = getCurrentUserId();
        console.log('openModal followers - currentUserId:', currentUserId);
      
        const followedKey1 = `followed_${currentUserId}`;
        const followedKey2 = `followed_tastemate-user-${currentUserId}`;
        
        console.log('openModal followers - checking keys:', followedKey1, followedKey2);
        
        let followerIds = JSON.parse(localStorage.getItem(followedKey1) || '[]');
        console.log('openModal followers - followerIds from key1:', followerIds);

        if (followerIds.length === 0) {
          followerIds = JSON.parse(localStorage.getItem(followedKey2) || '[]');
          console.log('openModal followers - followerIds from key2:', followerIds);
        }
        
        console.log('openModal followers - final followerIds:', followerIds);
        data = followerIds.map(id => {
          console.log('openModal followers - processing ID:', id);
          const user = getUserById(id);
          console.log('openModal followers - found user for ID:', id, user);
          return user || { id: id, username: id, firstName: 'User', lastName: id };
        });
        console.log('openModal followers - processed data:', data);
        break;
      case 'authorBookmarks':
        data = authorBookmarks;
        break;
      case 'communityBookmarks':
        data = communityBookmarks;
        break;
      case 'posts':
        data = userCommunityPosts;
        break;
      default:
        data = [];
    }
    
    console.log(`Final modal data for ${type}:`, data);
    setModalData(data);
    setShowModal(true);
    setShowFloatingMenu(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setModalData([]);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const navigateToProfile = (userId) => {
    navigate(`/author/${userId}`);
    closeModal();
    closeDetailModal();
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
      {/* Floating Menu Button */}
      <button 
        className={`${styles.floatingMenuBtn} ${showFloatingMenu ? styles.active : ''}`}
        onClick={toggleFloatingMenu}
      >
        {showFloatingMenu ? <FaTimes /> : <FaBars />}
      </button>

      {/* Floating Menu Panel */}
      {showFloatingMenu && (
        <div className={styles.floatingMenuPanel}>
          <div className={styles.floatingMenuHeader}>
            <h3>Quick Access</h3>
            <button className={styles.closeMenuBtn} onClick={toggleFloatingMenu}>
              <FaTimes />
            </button>
          </div>
          
          <div className={styles.floatingMenuTabs}>
            <button 
              className={styles.floatingTab}
              onClick={() => openModal('following')}
            >
              <FaUserFriends /> Following ({getFollowingCount()})
            </button>
            <button 
              className={styles.floatingTab}
              onClick={() => openModal('followers')}
            >
              <FaUsers /> Followers ({getFollowersCount(getCurrentUserId())})
            </button>
            <button 
              className={styles.floatingTab}
              onClick={() => openModal('authorBookmarks')}
            >
              <FaBookmark /> Author Bookmarks ({authorBookmarks.length})
            </button>
            <button 
              className={styles.floatingTab}
              onClick={() => openModal('communityBookmarks')}
            >
              <FaBookmark /> Community Bookmarks ({communityBookmarks.length})
            </button>
            <button 
              className={styles.floatingTab}
              onClick={() => openModal('posts')}
            >
              <FaEdit /> Posts ({userCommunityPosts.length})
            </button>
          </div>
        </div>
      )}

      {/* Main Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modalType === 'following' && `Following (${modalData.length})`}
                {modalType === 'followers' && `Followers (${modalData.length})`}
                {modalType === 'authorBookmarks' && `Author Bookmarks (${modalData.length})`}
                {modalType === 'communityBookmarks' && `Community Bookmarks (${modalData.length})`}
                {modalType === 'posts' && `Your Posts (${modalData.length})`}
              </h3>
              <button className={styles.closeModalBtn} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {modalData.length > 0 ? (
                <div className={styles.modalList}>
                  {modalData.map(item => (
                    <div key={item.id} className={styles.modalItem}>
                      {(modalType === 'following' || modalType === 'followers' || modalType === 'authorBookmarks') && (
                        <>
                          <img src={item.profilePicture} alt={item.firstName} className={styles.modalAvatar} />
                          <div className={styles.modalItemInfo}>
                            <span className={styles.modalItemName}>{item.firstName} {item.lastName}</span>
                            <span className={styles.modalItemUsername}>@{item.username}</span>
                            {item.bio && <span className={styles.modalItemBio}>{item.bio}</span>}
                          </div>
                          <button 
                            className={styles.modalViewBtn}
                            onClick={() => openDetailModal(item)}
                          >
                            View Details
                          </button>
                        </>
                      )}
                      
                      {modalType === 'communityBookmarks' && (
                        <>
                          <div className={styles.modalItemInfo}>
                            <span className={styles.modalItemName}>{item.title}</span>
                            <span className={styles.modalItemUsername}>by {item.author}</span>
                            <span className={styles.modalItemBio}>{item.content?.substring(0, 100)}...</span>
                          </div>
                          <button 
                            className={styles.modalViewBtn}
                            onClick={() => openDetailModal(item)}
                          >
                            View Post
                          </button>
                        </>
                      )}
                      
                      {modalType === 'posts' && (
                        <>
                          <div className={styles.modalItemInfo}>
                            <span className={styles.modalItemName}>{item.title}</span>
                            <span className={styles.modalItemUsername}>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className={styles.modalItemBio}>{item.content?.substring(0, 100)}...</span>
                          </div>
                          <div className={styles.modalItemStats}>
                            <span><FaHeart /> {item.likes || 0}</span>
                            <span><FaComment /> {item.comments?.length || 0}</span>
                          </div>
                          <button 
                            className={styles.modalViewBtn}
                            onClick={() => openDetailModal(item)}
                          >
                            View Details
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.modalEmptyState}>
                  <p>No items found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div className={styles.detailModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Details</h3>
              <button className={styles.closeModalBtn} onClick={closeDetailModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.detailModalBody}>
              {(modalType === 'following' || modalType === 'followers' || modalType === 'authorBookmarks') && (
                <div className={styles.userDetailCard}>
                  <img src={selectedItem.profilePicture} alt={selectedItem.firstName} className={styles.detailAvatar} />
                  <div className={styles.userDetailInfo}>
                    <h4>{selectedItem.firstName} {selectedItem.lastName}</h4>
                    <p className={styles.detailUsername}>@{selectedItem.username}</p>
                    {selectedItem.bio && <p className={styles.detailBio}>{selectedItem.bio}</p>}
                    {selectedItem.location && (
                      <p className={styles.detailLocation}>
                        <FaMapMarkerAlt /> {selectedItem.location}
                      </p>
                    )}
                    <div className={styles.detailStats}>
                      <span>Followers: {selectedItem.followers || 0}</span>
                      <span>Following: {selectedItem.following || 0}</span>
                    </div>
                    <button 
                      className={styles.detailActionBtn}
                      onClick={() => navigateToProfile(selectedItem.id)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )}
              
              {modalType === 'communityBookmarks' && (
                <div className={styles.postDetailCard}>
                  <h4>{selectedItem.title}</h4>
                  <p className={styles.postDetailAuthor}>by {selectedItem.author}</p>
                  <p className={styles.postDetailDate}>{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                  <div className={styles.postDetailContent}>
                    <p>{selectedItem.content}</p>
                  </div>
                  <div className={styles.postDetailStats}>
                    <span><FaHeart /> {selectedItem.likes || 0} likes</span>
                    <span><FaComment /> {selectedItem.comments?.length || 0} comments</span>
                  </div>
                  <button 
                    className={styles.detailActionBtn}
                    onClick={() => navigate('/community')}
                  >
                    View in Community
                  </button>
                </div>
              )}
              
              {modalType === 'posts' && (
                <div className={styles.postDetailCard}>
                  <h4>{selectedItem.title}</h4>
                  <p className={styles.postDetailDate}>{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                  <div className={styles.postDetailContent}>
                    <p>{selectedItem.content}</p>
                  </div>
                  <div className={styles.postDetailStats}>
                    <span><FaHeart /> {selectedItem.likes || 0} likes</span>
                    <span><FaComment /> {selectedItem.comments?.length || 0} comments</span>
                  </div>
                  <button 
                    className={styles.detailActionBtn}
                    onClick={() => navigate('/community')}
                  >
                    View in Community
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.profileContent}>
        <UserInformation 
          user={user}
          userRecipes={userRecipes}
          userCommunityPosts={userCommunityPosts}
          followingCount={getFollowingCount()}
          followersCount={getFollowersCount(getCurrentUserId())}
          onEditProfile={() => setIsEditing(true)}
          onLogout={handleLogout}
          updateProfile={updateProfile}
          showError={showError}
          isUploadingAvatar={isUploadingAvatar}
          setIsUploadingAvatar={setIsUploadingAvatar}
        />
        
        <div className={styles.divider}></div>

        <UserCreatedList 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRecipes={userRecipes}
          userCommunityPosts={userCommunityPosts}
          onEditRecipe={handleRecipeEdit}
          onDeleteRecipe={handleRecipeDelete}
          onPublishRecipe={handleRecipePublish}
          onViewRecipe={handleRecipeView}
          navigate={navigate}
        />
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
