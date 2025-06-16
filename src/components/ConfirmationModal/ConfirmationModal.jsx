import React from 'react';
import { IoWarningOutline, IoCloseOutline } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  const { isDarkMode } = useTheme();
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${styles[type]} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <IoWarningOutline className={styles.icon} />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmBtn} ${styles[`${type}Confirm`]}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;