import React, { useState } from 'react';
import { FaHeart, FaShare, FaComment, FaStar, FaClock, FaSignal, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useFavorites } from '../../../../context/FavoritesContext';
import { useAuth } from '../../../../context/AuthContext';
import RecipeBadge from '../../../../components/RecipeBadge/RecipeBadge';
import styles from './HeroRecipe.module.css';

const HeroRecipe = ({ recipe, onLike, onShare, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Get all images (fallback to single image if images array doesn't exist)
  const recipeImages = recipe.images && recipe.images.length > 0 ? recipe.images : [recipe.image];
  const hasMultipleImages = recipeImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % recipeImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + recipeImages.length) % recipeImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
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
        <div className={styles.imageCarousel}>
          <img 
            src={recipeImages[currentImageIndex]} 
            alt={`${recipe.title} - ${currentImageIndex + 1}`}
            className={styles.recipeImage}
          />
          
          {/* Navigation arrows for multiple images */}
          {hasMultipleImages && (
            <>
              <button 
                className={`${styles.carouselBtn} ${styles.prevBtn}`}
                onClick={prevImage}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button 
                className={`${styles.carouselBtn} ${styles.nextBtn}`}
                onClick={nextImage}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
              
              {/* Image indicators */}
              <div className={styles.imageIndicators}>
                {recipeImages.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                    onClick={() => goToImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
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
          </div>
          
          {/* Dynamic Badge - Moved to separate container */}
          <div className={styles.badgeContainer}>
            <RecipeBadge recipe={recipe} />
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
        {isAuthenticated && (
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
        )}
        
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