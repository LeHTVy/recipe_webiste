// src/components/RecipeCard/RecipeCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { FaClock, FaUsers, FaChartBar, FaHeart, FaShare } from 'react-icons/fa';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Function to get display image - randomly select from images array if multiple exist
  const getDisplayImage = () => {
    if (recipe.images && recipe.images.length > 1) {
      const randomIndex = Math.floor(Math.random() * recipe.images.length);
      return recipe.images[randomIndex];
    }
    return recipe.image; // Fallback to single image
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('★');
      } else {
        stars.push('☆');
      }
    }
    return stars;
  };

  // Handle navigation to recipe details
  const handleViewRecipe = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  // Handle card click (navigate to details)
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest(`.${styles.favoriteBtn}`) || 
        e.target.closest(`.${styles.shareBtn}`) ||
        e.target.closest(`.${styles.viewBtn}`)) {
      return;
    }
    handleViewRecipe();
  };

  return (
    <div 
      className={`${styles.recipeCard} ${isDarkMode ? styles.darkMode : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.imageContainer}>
        <img 
          src={getDisplayImage()} 
          alt={recipe.title}
          className={styles.recipeImage}
        />
        <div className={styles.imageOverlay}>
          <button 
            className={styles.viewBtn}
            onClick={handleViewRecipe}
          >
            View Recipe
          </button>
        </div>
        <div className={styles.categoryBadge}>
          {recipe.category}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        
        <div className={styles.recipeInfo}>
          <div className={styles.infoItem}>
            <FaClock className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.cookingTime} min</span>
          </div>
          <div className={styles.infoItem}>
            <FaUsers className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.servings} servings</span>
          </div>
          <div className={styles.infoItem}>
            <FaChartBar className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.difficulty}</span>
          </div>
        </div>
        
        <div className={styles.ratingSection}>
          <div className={styles.stars}>
            {renderStars(recipe.rating).map((star, index) => (
              <span key={index} className={styles.star}>{star}</span>
            ))}
          </div>
          <span className={styles.ratingValue}>{recipe.rating}</span>
          <span className={styles.ratingCount}>({recipe.totalRatings || 0})</span>
        </div>
        
        <div className={styles.cardActions}>
          <button 
            className={`${styles.favoriteBtn} ${isFavorite(recipe.id) ? styles.favorited : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe);
            }}
          >
            <FaHeart className={isFavorite(recipe.id) ? styles.heartFilled : styles.heartEmpty} />
          </button>
          <button 
            className={styles.shareBtn}
            onClick={(e) => {
              e.stopPropagation();
              // Add share functionality here
              console.log('Share recipe:', recipe.id);
            }}
          >
            <FaShare />
          </button>
          <button 
            className={styles.primaryBtn}
            onClick={handleViewRecipe}
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
