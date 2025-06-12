// src/components/SearchBox/SearchBox.jsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SearchBox.module.css';

const SearchBox = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search recipes by name, ingredient...",
  className = '' 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.searchBox} ${isDarkMode ? styles.darkMode : ''} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearchChange}
          className={styles.searchInput}
        />
        <div className={styles.searchIcon}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className={styles.iconSvg}
          >
            <circle 
              cx="11" 
              cy="11" 
              r="8" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              d="m21 21-4.35-4.35" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
