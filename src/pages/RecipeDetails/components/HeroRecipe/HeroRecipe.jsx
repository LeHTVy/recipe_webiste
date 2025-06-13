import React, { useState } from 'react';
import { FaHeart, FaShare, FaComment, FaStar, FaClock, FaSignal } from 'react-icons/fa';
import styles from './HeroRecipe.module.css';

const HeroRecipe = ({ recipe, onLike, onShare, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = () => {
    setLiked(!liked);
    onLike && onLike(!liked);
  };

  const handleShare = () => {
    onShare && onShare();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${styles.star} ${index < Math.floor(rating) ? styles.filled : styles.empty}`}
      />
    ));
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.imageSection}>
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className={styles.recipeImage}
        />
        
        {/* Overlay with recipe info */}
        <div className={styles.overlay}>
          <div className={styles.badges}>
            {recipe.isPopular && (
              <span className={styles.badge}>
                <FaStar className={styles.badgeIcon} />
                Popular
              </span>
            )}
            {recipe.isTopRated && (
              <span className={styles.badge}>
                <FaStar className={styles.badgeIcon} />
                Top Rated
              </span>
            )}
          </div>

          <div className={styles.recipeInfo}>
            <h1 className={styles.title}>{recipe.title}</h1>
            
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <FaClock className={styles.metaIcon} />
                <span>{recipe.cookingTime} min</span>
              </div>
              
              <div className={styles.metaItem}>
                <FaSignal className={styles.metaIcon} />
                <span>{recipe.difficulty}</span>
              </div>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.ratingSection}>
                <div className={styles.stars}>
                  {renderStars(recipe.rating)}
                </div>
                <span className={styles.ratingText}>
                  {recipe.rating} ({recipe.totalRatings} reviews)
                </span>
              </div>
              
              <div className={styles.stat}>
                <FaHeart className={styles.statIcon} />
                <span>{recipe.likes || 0} likes</span>
              </div>
              
              <div className={styles.stat}>
                <FaComment className={styles.statIcon} />
                <span>{recipe.commentCount || 0} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          className={`${styles.actionBtn} ${styles.likeBtn} ${liked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          <FaHeart className={styles.actionIcon} />
          {liked ? 'Liked' : 'Like'}
        </button>
        
        <button 
          className={`${styles.actionBtn} ${styles.shareBtn}`}
          onClick={handleShare}
        >
          <FaShare className={styles.actionIcon} />
          Share
        </button>
      </div>
    </div>
  );
};

export default HeroRecipe;