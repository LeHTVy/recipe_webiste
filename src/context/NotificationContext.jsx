import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification, { createNotification } from '../components/Notification/Notification';

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
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification(createNotification.success(message, options));
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification(createNotification.error(message, options));
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification(createNotification.warning(message, options));
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification(createNotification.info(message, options));
  }, [addNotification]);

  const showFavoriteAdded = useCallback((recipeName, options = {}) => {
    return addNotification(createNotification.addedToFavorites(recipeName, options));
  }, [addNotification]);

  const showSignupSuccess = useCallback((username, options = {}) => {
    return addNotification(createNotification.signupSuccess(username, options));
  }, [addNotification]);

  const showDeleteSuccess = useCallback((itemName, options = {}) => {
    return addNotification(createNotification.deleteSuccess(itemName, options));
  }, [addNotification]);

  const showUpdateSuccess = useCallback((itemName, options = {}) => {
    return addNotification(createNotification.updateSuccess(itemName, options));
  }, [addNotification]);

  const showShareSuccess = useCallback((options = {}) => {
    return addNotification(createNotification.shareSuccess(options));
  }, [addNotification]);

  const showBookmarkSuccess = useCallback((recipeName, options = {}) => {
    return addNotification(createNotification.bookmarkSuccess(recipeName, options));
  }, [addNotification]);

  // Custom notification with full control
  const showCustom = useCallback((config) => {
    return addNotification(config);
  }, [addNotification]);

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
    showCustom
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render all notifications */}
      <div id="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;