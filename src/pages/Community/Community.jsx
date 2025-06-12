// src/pages/Community/Community.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Community.module.css';

const Community = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.communityPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className="container">
        <h1>Community</h1>
        <p>Connect with fellow food lovers and share your culinary experiences.</p>
        {/* Community content will be implemented here */}
      </div>
    </div>
  );
};

export default Community;
