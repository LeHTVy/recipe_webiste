// src/components/RecipeCard/RecipeCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotification } from '../../context/NotificationContext';
import { FaClock, FaUsers, FaChartBar, FaHeart, FaShare, FaComments } from 'react-icons/fa';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showNotification } = useNotification();

  const [calculatedRating, setCalculatedRating] = useState({ averageRating: recipe.rating || 0, totalRatings: recipe.totalRatings || 0 });

  // Load comments from localStorage and calculate ratings
  useEffect(() => {
    const loadCommentsAndCalculateRating = () => {
      try {
        // First check if this is a user-created recipe
        const userRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const userRecipe = userRecipes.find(r => r.id === recipe.id);
        
        let comments = [];
        if (userRecipe && userRecipe.comments) {
          comments = userRecipe.comments;
        } else {
          // Check for comments in recipeComments storage
          const recipeComments = JSON.parse(localStorage.getItem('recipeComments') || '{}');
          comments = recipeComments[recipe.id] || recipe.comments || [];
        }
        
        // Calculate rating from comments
        const ratingsFromComments = comments.filter(comment => comment.rating && comment.rating > 0);
        
        if (ratingsFromComments.length === 0) {
          setCalculatedRating({
            averageRating: recipe.rating || 0,
            totalRatings: recipe.totalRatings || 0
          });
        } else {
          const totalRating = ratingsFromComments.reduce((sum, comment) => sum + comment.rating, 0);
          const averageRating = totalRating / ratingsFromComments.length;
          
          setCalculatedRating({
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratingsFromComments.length
          });
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        setCalculatedRating({
          averageRating: recipe.rating || 0,
          totalRatings: recipe.totalRatings || 0
        });
      }
    };

    loadCommentsAndCalculateRating();

    // Listen for localStorage updates
    const handleStorageUpdate = () => {
      loadCommentsAndCalculateRating();
    };

    window.addEventListener('localStorageUpdate', handleStorageUpdate);
    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageUpdate);
    };
  }, [recipe.id, recipe.comments, recipe.rating, recipe.totalRatings]);

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
        stars.push(<span key={i} className={styles.star}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.star}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.star}>☆</span>);
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
          <div className={styles.infoItem}>
            <FaComments className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.commentCount || 0} comments</span>
          </div>
        </div>
        
        <div className={styles.ratingSection}>
          <div className={styles.stars}>
            {renderStars(calculatedRating.averageRating)}
          </div>
          <span className={styles.ratingValue}>{calculatedRating.averageRating}</span>
          <span className={styles.ratingCount}>({calculatedRating.totalRatings})</span>
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
              const recipeUrl = `${window.location.origin}/recipes/${recipe.id}`;
              navigator.clipboard.writeText(recipeUrl)
                .then(() => {
                  showNotification('Recipe link copied to clipboard!', 'success');
                })
                .catch(err => {
                  console.error('Failed to copy recipe link:', err);
                  showNotification('Could not copy link. Please try again.', 'error');
                });
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
