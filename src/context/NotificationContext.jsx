import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationModal from '../components/NotificationModal/NotificationModal';

// Helper function to create notification objects
const createNotification = (type, message, title, options = {}) => {
  return {
    id: Date.now() + Math.random(),
    type,
    message,
    title,
    isVisible: true,
    ...options
  };
};

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      isVisible: true,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for common notification types
  const showSuccess = useCallback((message, title, options = {}) => {
    return addNotification(createNotification('success', message, title, options));
  }, [addNotification]);

  const showError = useCallback((message, title, options = {}) => {
    return addNotification(createNotification('error', message, title, options));
  }, [addNotification]);

  const showWarning = useCallback((message, title, options = {}) => {
    return addNotification(createNotification('warning', message, title, options));
  }, [addNotification]);

  const showInfo = useCallback((message, title, options = {}) => {
    return addNotification(createNotification('info', message, title, options));
  }, [addNotification]);

  const showFavoriteAdded = useCallback((recipeName, options = {}) => {
    return addNotification(createNotification('success', `${recipeName} added to favorites!`, 'Added to Favorites', options));
  }, [addNotification]);

  const showSignupSuccess = useCallback((username, options = {}) => {
    return addNotification(createNotification('success', `Welcome ${username}! Your account has been created successfully.`, 'Welcome!', options));
  }, [addNotification]);

  const showDeleteSuccess = useCallback((itemName, options = {}) => {
    return addNotification(createNotification('success', `${itemName} has been deleted successfully.`, 'Deleted', options));
  }, [addNotification]);

  const showUpdateSuccess = useCallback((itemName, options = {}) => {
    return addNotification(createNotification('success', `${itemName} has been updated successfully.`, 'Updated', options));
  }, [addNotification]);

  const showShareSuccess = useCallback((options = {}) => {
    return addNotification(createNotification('share', 'Recipe link copied to clipboard!', 'Shared!', options));
  }, [addNotification]);

  const showBookmarkSuccess = useCallback((recipeName, options = {}) => {
    return addNotification(createNotification('success', `${recipeName} bookmarked successfully!`, 'Bookmarked', options));
  }, [addNotification]);

  // Custom notification with full control
  const showCustom = useCallback((config) => {
    return addNotification(config);
  }, [addNotification]);

  // General showNotification function that accepts message and type
  const showNotification = useCallback((message, type = 'info', title = '', options = {}) => {
    switch (type) {
      case 'success':
        return showSuccess(message, title, options);
      case 'error':
        return showError(message, title, options);
      case 'warning':
        return showWarning(message, title, options);
      case 'info':
      default:
        return showInfo(message, title, options);
    }
  }, [showSuccess, showError, showWarning, showInfo]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showFavoriteAdded,
    showSignupSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
    showShareSuccess,
    showBookmarkSuccess,
    showCustom,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications as modals */}
      {notifications.map((notification) => (
        <NotificationModal
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;