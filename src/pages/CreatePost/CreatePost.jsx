import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaImage,
  FaVideo,
  FaSmile,
  FaTimes,
  FaArrowLeft,
  FaGlobeAmericas,
  FaUsers,
  FaLock,
  FaMapMarkerAlt,
  FaTag
} from 'react-icons/fa';
import styles from './CreatePost.module.css';

const CreatePost = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [postData, setPostData] = useState({
    content: '',
    images: [],
    video: null,
    feeling: [],
    location: '',
    tags: [],
    privacy: 'public' // public, friends, private
  });
  
  const [activeTab, setActiveTab] = useState('text');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial tab based on URL params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'photo') setActiveTab('photo');
    else if (type === 'video') setActiveTab('video');
    else if (type === 'feeling') setActiveTab('feeling');
  }, [searchParams]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => {
      return URL.createObjectURL(file);
    });
    
    setPostData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };
  
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setPostData(prev => ({
        ...prev,
        video: videoUrl
      }));
    }
  };
  
  const removeImage = (index) => {
    setPostData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const addTag = () => {
    if (tagInput.trim() && !postData.tags.includes(tagInput.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async () => {
    if (!postData.content.trim() && postData.images.length === 0 && !postData.video) {
      showNotification('Please add some content to your post', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new post object
      const newPost = {
        id: Date.now(),
        userId: user.id,
        user: {
          id: user.id,
          displayName: `${user.firstName} ${user.lastName}`,
          username: user.username,
          avatar: user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=00bf63&color=fff`,
          isVerified: user.isVerified || false,
          userType: 'Home Chef',
          location: user.location || 'Unknown Location'
        },
        title: postData.content.split('\n')[0] || 'Untitled Post',
        description: postData.content,
        cookingTime: 30,
        servings: 4,
        difficulty: 'Medium',
        content: postData.content,
        images: postData.images,
        video: postData.video,
        feeling: postData.feeling,
        location: postData.location,
        tags: postData.tags,
        privacy: postData.privacy,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false
      };
      
      // Save to localStorage
      const existingPosts = localStorage.getItem('tastemate_community_posts');
      let posts = [];
      
      if (existingPosts) {
        try {
          posts = JSON.parse(existingPosts);
        } catch (error) {
          console.error('Error parsing existing posts:', error);
        }
      }
      
      posts.unshift(newPost); // Add new post at the beginning
      localStorage.setItem('tastemate_community_posts', JSON.stringify(posts));
      
      showNotification('Post created successfully!', 'success');
      navigate('/community');
      
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification('Failed to create post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const feelingOptions = [
    '😊 Happy', '😍 Excited', '🤤 Hungry', '👨‍🍳 Cooking', '🎉 Celebrating',
    '😋 Satisfied', '🤗 Grateful', '💪 Motivated', '🌟 Inspired', '❤️ Loving',
    '🔥 Passionate', '😌 Relaxed', '🤩 Amazed', '😇 Blessed', '🥳 Party',
    '🤔 Thoughtful', '😴 Sleepy', '🤗 Warm', '🌈 Colorful', '✨ Magical'
  ];
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className={`${styles.createPostPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.createPostContainer}>
        {/* Header */}
        <div className={styles.header}>
          <button 
            className={styles.backBtn}
            onClick={() => navigate('/community')}
          >
            <FaArrowLeft />
          </button>
          <h1>Create Post</h1>
          <button 
            className={`${styles.postBtn} ${(!postData.content.trim() && postData.images.length === 0 && !postData.video) ? styles.disabled : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting || (!postData.content.trim() && postData.images.length === 0 && !postData.video)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        
        {/* User Info */}
        <div className={styles.userInfo}>
          <img 
            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=00bf63&color=fff`}
            alt="Your avatar"
            className={styles.userAvatar}
          />
          <div className={styles.userDetails}>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <div className={styles.privacySelector}>
              <select 
                value={postData.privacy}
                onChange={(e) => setPostData(prev => ({ ...prev, privacy: e.target.value }))}
                className={styles.privacySelect}
              >
                <option value="public"><FaGlobeAmericas /> Public</option>
                <option value="friends"><FaUsers /> Friends</option>
                <option value="private"><FaLock /> Only me</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className={styles.contentTabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'text' ? styles.active : ''}`}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'photo' ? styles.active : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            <FaImage /> Photo
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'video' ? styles.active : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <FaVideo /> Video
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'feeling' ? styles.active : ''}`}
            onClick={() => setActiveTab('feeling')}
          >
            <FaSmile /> Feeling
          </button>
        </div>
        
        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Text Content */}
          <textarea
            className={styles.contentTextarea}
            placeholder="What's on your mind?"
            value={postData.content}
            onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
          />
          
          {/* Photo Tab */}
          {activeTab === 'photo' && (
            <div className={styles.photoSection}>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <label htmlFor="imageUpload" className={styles.uploadBtn}>
                <FaImage /> Add Photos
              </label>
              
              {postData.images.length > 0 && (
                <div className={styles.imagePreview}>
                  {postData.images.map((image, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Video Tab */}
          {activeTab === 'video' && (
            <div className={styles.videoSection}>
              <input
                type="file"
                id="videoUpload"
                accept="video/*"
                onChange={handleVideoUpload}
                className={styles.fileInput}
              />
              <label htmlFor="videoUpload" className={styles.uploadBtn}>
                <FaVideo /> Add Video
              </label>
              
              {postData.video && (
                <div className={styles.videoPreview}>
                  <video src={postData.video} controls className={styles.videoPlayer} />
                  <button 
                    className={styles.removeBtn}
                    onClick={() => setPostData(prev => ({ ...prev, video: null }))}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Feeling Tab */}
          {activeTab === 'feeling' && (
            <div className={styles.feelingSection}>
              <h4>How are you feeling?</h4>
              <div className={styles.feelingOptions}>
                {feelingOptions.map((feeling, index) => (
                  <button
                    key={index}
                    className={`${styles.feelingBtn} ${postData.feeling.includes(feeling) ? styles.selected : ''}`}
                    onClick={() => {
                      setPostData(prev => ({
                        ...prev,
                        feeling: prev.feeling.includes(feeling)
                          ? prev.feeling.filter(f => f !== feeling)
                          : [...prev.feeling, feeling]
                      }));
                    }}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
              {postData.feeling.length > 0 && (
                <div className={styles.selectedFeelings}>
                  <h5>Selected feelings:</h5>
                  <div className={styles.selectedFeelingsList}>
                    {postData.feeling.map((feeling, index) => (
                      <div key={index} className={styles.selectedFeeling}>
                        <span>{feeling}</span>
                        <button 
                          className={styles.removeFeelingBtn}
                          onClick={() => setPostData(prev => ({
                            ...prev,
                            feeling: prev.feeling.filter(f => f !== feeling)
                          }))}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    className={styles.clearAllFeelingsBtn}
                    onClick={() => setPostData(prev => ({ ...prev, feeling: [] }))}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Additional Options */}
        <div className={styles.additionalOptions}>
          {/* Location */}
          <div className={styles.optionGroup}>
            <label>
              <FaMapMarkerAlt /> Location
            </label>
            <input
              type="text"
              placeholder="Add location"
              value={postData.location}
              onChange={(e) => setPostData(prev => ({ ...prev, location: e.target.value }))}
              className={styles.locationInput}
            />
          </div>
          
          {/* Tags */}
          <div className={styles.optionGroup}>
            <label>
              <FaTag /> Tags
            </label>
            <div className={styles.tagInput}>
              <input
                type="text"
                placeholder="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className={styles.tagInputField}
              />
              <button onClick={addTag} className={styles.addTagBtn}>
                Add
              </button>
            </div>
            
            {postData.tags.length > 0 && (
              <div className={styles.tagList}>
                {postData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                    <button 
                      className={styles.removeTagBtn}
                      onClick={() => removeTag(tag)}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;