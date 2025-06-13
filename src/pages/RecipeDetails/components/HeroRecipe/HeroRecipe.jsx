import React, { useState } from 'react';
import { FaHeart, FaShare, FaComment, FaStar, FaClock, FaSignal, FaFire, FaComments, FaTrophy } from 'react-icons/fa';
import { useFavorites } from '../../../../context/FavoritesContext';
import styles from './HeroRecipe.module.css';

const HeroRecipe = ({ recipe, onLike, onShare, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);
  const { toggleFavorite, isFavorite } = useFavorites();

  const getBadgeInfo = (recipe) => {
    if (recipe.isPopular) {
      return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
    } else if (recipe.commentCount > 10) {
      return { text: 'TRENDING', class: styles.trendingBadge, icon: <FaComments /> };
    } else if (recipe.isTopRated) {
      return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
    } else if (recipe.rating >= 4.8) {
      return { text: 'EXCELLENT', class: styles.excellentBadge, icon: <FaStar /> };
    }
    return null;
  };

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
          {/* Top Right Tags */}
          <div className={styles.topRightTags}>
            {/* Category and Food Type Tags */}
            <div className={styles.categoryTags}>
              {recipe.category && (
                <span className={styles.categoryTag}>
                  {recipe.category}
                </span>
              )}
              {recipe.foodType && (
                <span className={styles.foodTypeTag}>
                  {recipe.foodType}
                </span>
              )}
            </div>
            
            {/* Dynamic Badge */}
            {getBadgeInfo(recipe) && (
              <div className={getBadgeInfo(recipe).class}>
                {getBadgeInfo(recipe).icon} {getBadgeInfo(recipe).text}
              </div>
            )}
          </div>

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
          className={`${styles.actionBtn} ${styles.likeBtn} ${isFavorite(recipe.id) ? styles.liked : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
            handleLike();
          }}
        >
          <FaHeart className={styles.actionIcon} />
          {isFavorite(recipe.id) ? 'Favorited' : 'Add to Favorites'}
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