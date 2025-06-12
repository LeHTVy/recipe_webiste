// src/pages/MealPlanner/MealPlanner.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './MealPlanner.module.css';

const MealPlanner = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${styles.mealPlannerPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className="container">
        <h1>Meal Planner</h1>
        <p>Plan your weekly meals and organize your cooking schedule.</p>
        {/* Meal planner content will be implemented here */}
      </div>
    </div>
  );
};

export default MealPlanner;
