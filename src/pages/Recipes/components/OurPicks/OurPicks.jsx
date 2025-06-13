// src/components/OurPicks/OurPicks.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../context/ThemeContext';
import styles from './OurPicks.module.css';

const OurPicks = ({ 
  featuredRecipes = [], 
  title = "Our Picks", 
  subtitle = "Delicious recipes we chose for you",
  className = '' 
}) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (!featuredRecipes || featuredRecipes.length === 0) {
    return (
      <div className={`${styles.ourPicksSection} ${isDarkMode ? styles.darkMode : ''} ${className}`}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <p className={styles.sectionDescription}>{subtitle}</p>
        <div className={styles.emptyState}>
          <p>No featured recipes available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.ourPicksSection} ${isDarkMode ? styles.darkMode : ''} ${className}`}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <p className={styles.sectionDescription}>{subtitle}</p>
      
      <div className={styles.picksGrid}>
        {featuredRecipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className={styles.pickCard}
            onClick={() => handleRecipeClick(recipe.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRecipeClick(recipe.id);
              }
            }}
          >
            <div className={styles.pickImageContainer}>
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className={styles.pickImage}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <span className={styles.viewRecipeText}>View Recipe</span>
              </div>
            </div>
            <div className={styles.pickContent}>
              <h4 className={styles.pickTitle}>{recipe.title}</h4>
              <p className={styles.pickDescription}>{recipe.description}</p>
              <div className={styles.pickStats}>
                <div className={styles.pickStat}>
                  <span className={styles.statLabel}>Prep time</span>
                  <span className={styles.statValue}>{recipe.cookingTime}m</span>
                </div>
                <div className={styles.pickStat}>
                  <span className={styles.statLabel}>Serves</span>
                  <span className={styles.statValue}>{recipe.servings}</span>
                </div>
                <div className={styles.pickStat}>
                  <span className={styles.statLabel}>Skill</span>
                  <span className={styles.statValue}>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPicks;
