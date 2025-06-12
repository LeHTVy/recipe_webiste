// src/components/RecipeCard/RecipeCard.jsx
import React from 'react';
import styles from './RecipeCard.module.css';

const RecipeCard = ({ recipe }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={`${styles.star} ${styles.filled}`}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`${styles.star} ${styles.half}`}>★</span>);
      } else {
        stars.push(<span key={i} className={styles.star}>☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className={styles.recipeCard}>
      <div className={styles.imageContainer}>
        <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
        <button className={styles.favoriteBtn}>♡</button>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
        <p className={styles.recipeDescription}>{recipe.description}</p>
        
        <div className={styles.recipeInfo}>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {renderStars(recipe.rating)}
            </div>
            <span className={styles.ratingValue}>{recipe.rating}</span>
          </div>
          
          <div className={styles.details}>
            <span className={styles.difficulty}>{recipe.difficulty}</span>
            <span className={styles.time}>{recipe.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
