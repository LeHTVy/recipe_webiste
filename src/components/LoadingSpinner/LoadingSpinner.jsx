import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  variant = 'primary'
}) => {
  return (
    <div className={`${styles.loadingContainer} ${styles[size]}`}>
      <div className={`${styles.spinner} ${styles[variant]}`}>
        <div className={styles.spinnerInner}>
          <div className={styles.dot1}></div>
          <div className={styles.dot2}></div>
          <div className={styles.dot3}></div>
        </div>
      </div>
      {showMessage && (
        <p className={styles.loadingMessage}>{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;