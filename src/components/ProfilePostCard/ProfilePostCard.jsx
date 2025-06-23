import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaHeart, FaComment, FaEye, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import styles from './ProfilePostCard.module.css';

const ProfilePostCard = ({ post, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [postStats, setPostStats] = useState({
    likes: post.likes || 0,
    comments: post.comments || 0,
    views: post.views || 0
  });

  // Load post stats from localStorage
  useEffect(() => {
    const loadPostStats = () => {
      try {
        const communityPosts = JSON.parse(localStorage.getItem('tastemate_community_posts') || '[]');
        const currentPost = communityPosts.find(p => p.id === post.id);
        
        if (currentPost) {
          setPostStats({
            likes: currentPost.likes || 0,
            comments: currentPost.comments || 0,
            views: currentPost.views || 0
          });
        }
      } catch (error) {
        console.error('Error loading post stats:', error);
        setPostStats({
          likes: post.likes || 0,
          comments: post.comments || 0,
          views: post.views || 0
        });
      }
    };

    loadPostStats();

    // Listen for localStorage updates
    const handleStorageUpdate = () => {
      loadPostStats();
    };

    window.addEventListener('localStorageUpdate', handleStorageUpdate);
    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageUpdate);
    };
  }, [post.id, post.likes, post.comments, post.views]);

  // Function to get display image - randomly select from images array if multiple exist
  const getDisplayImage = () => {
    if (post.images && post.images.length > 1) {
      const randomIndex = Math.floor(Math.random() * post.images.length);
      return post.images[randomIndex];
    }
    return post.images?.[0] || '/api/placeholder/400/250';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(post.id);
    } else {
      // Navigate to edit post page (you can customize this route)
      navigate(`/create-post?edit=${post.id}`);
    }
  };

  const handleView = (e) => {
    e.stopPropagation();
    if (onView) {
      onView(post.id);
    } else {
      // Navigate to post view page (you can customize this route)
      navigate(`/community/posts/${post.id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className={`${styles.postCard} ${isDarkMode ? styles.darkMode : ''}`}
      onClick={handleView}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.postHeader}>
        <h4 className={styles.postTitle}>{post.title || 'Untitled Post'}</h4>
        <div className={styles.postDate}>
          <FaCalendarAlt className={styles.dateIcon} />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>
      
      <p className={styles.postContent}>
        {truncateContent(post.content)}
      </p>
      
      {post.images && post.images.length > 0 && (
        <div className={styles.imageContainer}>
          <img 
            src={getDisplayImage()} 
            alt="Post preview" 
            className={styles.postImage}
          />
          <div className={styles.imageOverlay}>
            <button 
              className={styles.viewBtn}
              onClick={handleView}
            >
              View Post
            </button>
          </div>
          {post.images.length > 1 && (
            <div className={styles.moreImages}>
              +{post.images.length - 1} more
            </div>
          )}
        </div>
      )}
      
      <div className={styles.postStats}>
        <div className={styles.statItem}>
          <FaHeart className={styles.statIcon} />
          <span className={styles.statText}>{postStats.likes}</span>
        </div>
        <div className={styles.statItem}>
          <FaComment className={styles.statIcon} />
          <span className={styles.statText}>{postStats.comments}</span>
        </div>
        <div className={styles.statItem}>
          <FaEye className={styles.statIcon} />
          <span className={styles.statText}>{postStats.views}</span>
        </div>
      </div>
      
      <div className={styles.cardActions}>
        <button 
          className={styles.actionBtn}
          onClick={handleEdit}
          title="Edit Post"
        >
          <FaEdit />
        </button>
        <button 
          className={styles.actionBtn}
          onClick={handleView}
          title="View Post"
        >
          <FaEye />
        </button>
        <button 
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={handleDelete}
          title="Delete Post"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ProfilePostCard;