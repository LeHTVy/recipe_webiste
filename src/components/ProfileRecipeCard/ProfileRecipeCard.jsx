import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaClock, FaUsers, FaChartBar, FaEdit, FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import styles from './ProfileRecipeCard.module.css';

const ProfileRecipeCard = ({ recipe, onEdit, onDelete, onPublish, onView }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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
    return recipe.images?.[0] || recipe.image || '/api/placeholder/300/200';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

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

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(recipe);
    } else {
      navigate(`/create-recipe?edit=${recipe.id}`);
    }
  };

  const handleView = (e) => {
    e.stopPropagation();
    if (onView) {
      onView(recipe);
    } else {
      navigate(`/recipes/${recipe.id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(recipe);
    }
  };

  const handlePublish = (e) => {
    e.stopPropagation();
    if (onPublish) {
      onPublish(recipe);
    }
  };

  const isDraft = recipe.status === 'draft';

  return (
    <div 
      className={`${styles.recipeCard} ${isDarkMode ? styles.darkMode : ''} ${isDraft ? styles.draftCard : ''}`}
      onClick={handleView}
      style={{ cursor: 'pointer' }}
    >
      {isDraft && (
        <div className={styles.draftBadge}>
          Draft
        </div>
      )}
      
      <div className={styles.imageContainer}>
        <img 
          src={getDisplayImage()} 
          alt={recipe.title}
          className={styles.recipeImage}
        />
        <div className={styles.imageOverlay}>
          <button 
            className={styles.viewBtn}
            onClick={handleView}
          >
            View Recipe
          </button>
        </div>
        <div className={styles.categoryBadge}>
          {recipe.category || 'Uncategorized'}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        
        <div className={styles.recipeInfo}>
          <div className={styles.infoItem}>
            <FaClock className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.cookingTime || 'N/A'} min</span>
          </div>
          <div className={styles.infoItem}>
            <FaUsers className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.servings || 'N/A'} servings</span>
          </div>
          <div className={styles.infoItem}>
            <FaChartBar className={styles.infoIcon} />
            <span className={styles.infoText}>{recipe.difficulty || 'Easy'}</span>
          </div>
        </div>
        
        {!isDraft && (
          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {renderStars(calculatedRating.averageRating).map((star, index) => (
                <span key={index} className={styles.star}>{star}</span>
              ))}
            </div>
            <span className={styles.ratingValue}>{calculatedRating.averageRating}</span>
            <span className={styles.ratingCount}>({calculatedRating.totalRatings})</span>
          </div>
        )}
        
        <div className={styles.cardActions}>
          {isDraft ? (
            // Draft recipe actions
            <>
              <button 
                className={styles.actionBtn}
                onClick={handleEdit}
                title="Edit Recipe"
              >
                <FaEdit />
              </button>
              <button 
                className={styles.actionBtn}
                onClick={handlePublish}
                title="Publish Recipe"
              >
                <FaUpload />
              </button>
              <button 
                className={styles.actionBtn}
                onClick={handleView}
                title="Preview Recipe"
              >
                <FaEye />
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={handleDelete}
                title="Delete Recipe"
              >
                <FaTrash />
              </button>
            </>
          ) : (
            // Published recipe actions
            <>
              <button 
                className={styles.actionBtn}
                onClick={handleEdit}
                title="Edit Recipe"
              >
                <FaEdit />
              </button>
              <button 
                className={styles.actionBtn}
                onClick={handleView}
                title="View Recipe"
              >
                <FaEye />
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={handleDelete}
                title="Delete Recipe"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileRecipeCard;