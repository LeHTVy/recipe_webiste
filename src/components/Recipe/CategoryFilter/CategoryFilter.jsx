import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { FOOD_CATEGORIES } from '../../../data/mockData';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  className = '' 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.categoryFilter} ${isDarkMode ? styles.darkMode : ''} ${className}`}>
      <label className={styles.categoryLabel}>
        Filter by Type
      </label>
      <div className={styles.selectWrapper}>
        <select 
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.categorySelect}
        >
          {FOOD_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <div className={styles.selectArrow}>
          <svg 
            width="12" 
            height="8" 
            viewBox="0 0 12 8" 
            fill="none"
            className={styles.arrowIcon}
          >
            <path 
              d="M1 1L6 6L11 1" 
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

export default CategoryFilter;
