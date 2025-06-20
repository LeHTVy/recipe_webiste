import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaShare
} from 'react-icons/fa';
import styles from './NotificationModal.module.css';

const NotificationModal = ({ 
  type = 'info', 
  message, 
  title,
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 3000
}) => {
  const [show, setShow] = useState(isVisible);

  const handleClose = useCallback(() => {
    setShow(false);
    if (onClose) onClose();
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
      share: {
        icon: <FaShare />,
        className: styles.share,
        defaultTitle: 'Shared!'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getNotificationConfig();
  const notificationTitle = title || config.defaultTitle;

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleClose} />
      
      {/* Modal */}
      <div className={`${styles.modal} ${config.className}`}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            {config.icon}
          </div>
          <h3 className={styles.title}>{notificationTitle}</h3>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            aria-label="Close notification"
          >
            <FaTimes />
          </button>
        </div>
        
        {message && (
          <div className={styles.content}>
            <p className={styles.message}>{message}</p>
          </div>
        )}
        
        <div className={styles.footer}>
          <button 
            className={styles.okButton}
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;