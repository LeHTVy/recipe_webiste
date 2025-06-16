import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaHeart,
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaShare,
  FaBookmark
} from 'react-icons/fa';
import styles from './Notification.module.css';

const Notification = ({ 
  type = 'info', 
  message, 
  title,
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 4000,
  position = 'top-right',
  showIcon = true,
  actionButton = null
}) => {
  const [show, setShow] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setShow(false);
      setIsExiting(false);
      if (onClose) onClose();
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, handleClose]);

  const getNotificationConfig = () => {
    const configs = {
      success: {
        icon: <FaCheck />,
        className: styles.success,
        defaultTitle: 'Success!'
      },
      error: {
        icon: <FaTimes />,
        className: styles.error,
        defaultTitle: 'Error!'
      },
      warning: {
        icon: <FaExclamationTriangle />,
        className: styles.warning,
        defaultTitle: 'Warning!'
      },
      info: {
        icon: <FaInfoCircle />,
        className: styles.info,
        defaultTitle: 'Info'
      },
      favorite: {
        icon: <FaHeart />,
        className: styles.favorite,
        defaultTitle: 'Added to Favorites!'
      },
      signup: {
        icon: <FaUserPlus />,
        className: styles.signup,
        defaultTitle: 'Welcome!'
      },
      delete: {
        icon: <FaTrash />,
        className: styles.delete,
        defaultTitle: 'Deleted!'
      },
      edit: {
        icon: <FaEdit />,
        className: styles.edit,
        defaultTitle: 'Updated!'
      },
      share: {
        icon: <FaShare />,
        className: styles.share,
        defaultTitle: 'Shared!'
      },
      bookmark: {
        icon: <FaBookmark />,
        className: styles.bookmark,
        defaultTitle: 'Bookmarked!'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getNotificationConfig();
  const notificationTitle = title || config.defaultTitle;

  if (!show) return null;

  return (
    <div 
      className={`
        ${styles.notification} 
        ${config.className} 
        ${styles[position]} 
        ${isExiting ? styles.exit : styles.enter}
      `}
    >
      <div className={styles.content}>
        {showIcon && (
          <div className={styles.icon}>
            {config.icon}
          </div>
        )}
        <div className={styles.text}>
          <div className={styles.title}>{notificationTitle}</div>
          {message && <div className={styles.message}>{message}</div>}
        </div>
        {actionButton && (
          <div className={styles.action}>
            {actionButton}
          </div>
        )}
      </div>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label="Close notification"
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Predefined notification types for common use cases
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  FAVORITE: 'favorite',
  SIGNUP: 'signup',
  DELETE: 'delete',
  EDIT: 'edit',
  SHARE: 'share',
  BOOKMARK: 'bookmark'
};

// Helper function to create common notifications
export const createNotification = {
  success: (message, options = {}) => ({
    type: NotificationTypes.SUCCESS,
    message,
    ...options
  }),
  error: (message, options = {}) => ({
    type: NotificationTypes.ERROR,
    message,
    autoClose: false, // Errors should be manually dismissed
    ...options
  }),
  warning: (message, options = {}) => ({
    type: NotificationTypes.WARNING,
    message,
    ...options
  }),
  info: (message, options = {}) => ({
    type: NotificationTypes.INFO,
    message,
    ...options
  }),
  addedToFavorites: (recipeName, options = {}) => ({
    type: NotificationTypes.FAVORITE,
    message: recipeName ? `"${recipeName}" has been added to your favorites!` : 'Recipe added to favorites!',
    ...options
  }),
  signupSuccess: (username, options = {}) => ({
    type: NotificationTypes.SIGNUP,
    message: username ? `Welcome to TasteMate, ${username}!` : 'Account created successfully!',
    ...options
  }),
  deleteSuccess: (itemName, options = {}) => ({
    type: NotificationTypes.DELETE,
    message: itemName ? `"${itemName}" has been deleted.` : 'Item deleted successfully.',
    ...options
  }),
  updateSuccess: (itemName, options = {}) => ({
    type: NotificationTypes.EDIT,
    message: itemName ? `"${itemName}" has been updated.` : 'Changes saved successfully.',
    ...options
  }),
  shareSuccess: (options = {}) => ({
    type: NotificationTypes.SHARE,
    message: 'Recipe shared successfully!',
    ...options
  }),
  bookmarkSuccess: (recipeName, options = {}) => ({
    type: NotificationTypes.BOOKMARK,
    message: recipeName ? `"${recipeName}" has been bookmarked!` : 'Recipe bookmarked!',
    ...options
  })
};

export default Notification;