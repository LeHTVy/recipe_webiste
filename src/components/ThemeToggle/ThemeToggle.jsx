import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={styles.toggleContainer}>
        <FaSun className={`${styles.icon} ${styles.sun} ${!isDarkMode ? styles.active : ''}`} />
        <FaMoon className={`${styles.icon} ${styles.moon} ${isDarkMode ? styles.active : ''}`} />
        <div className={`${styles.slider} ${isDarkMode ? styles.dark : ''}`}></div>
      </div>
      <span className={styles.label}>
        {isDarkMode ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
