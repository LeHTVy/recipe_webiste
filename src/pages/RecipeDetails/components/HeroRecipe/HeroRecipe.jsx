import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaShare,
  FaComment,
  FaStar,
  FaClock,
  FaSignal,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useFavorites } from "../../../../context/FavoritesContext";
import { useAuth } from "../../../../context/AuthContext";
import { useNotification } from "../../../../context/NotificationContext";
import RecipeBadge from "../../../../components/RecipeBadge/RecipeBadge";
import styles from "./HeroRecipe.module.css";

const HeroRecipe = ({ recipe, onLike, onShare, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [commentsFromStorage, setCommentsFromStorage] = useState([]);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const recipeImages =
    recipe.images && recipe.images.length > 0 ? recipe.images : [recipe.image];
  const hasMultipleImages = recipeImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % recipeImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + recipeImages.length) % recipeImages.length
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike && onLike(!liked);
  };

  const handleShare = () => {
    const recipeUrl = `${window.location.origin}/recipes/${recipe.id}`;
    navigator.clipboard
      .writeText(recipeUrl)
      .then(() => {
        showNotification("Recipe link copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy recipe link:", err);
        showNotification("Could not copy link. Please try again.", "error");
      });
    onShare && onShare();
  };

  useEffect(() => {
    const loadComments = () => {
      try {
        const userRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
        const userRecipe = userRecipes.find((r) => r.id === recipe.id);

        if (userRecipe && userRecipe.comments) {
          setCommentsFromStorage(userRecipe.comments);
        } else {
          const recipeComments = JSON.parse(
            localStorage.getItem("recipeComments") || "{}"
          );
          const comments = recipeComments[recipe.id] || recipe.comments || [];
          setCommentsFromStorage(comments);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
        setCommentsFromStorage(recipe.comments || []);
      }
    };

    loadComments();

    const handleStorageUpdate = () => {
      loadComments();
    };

    window.addEventListener("localStorageUpdate", handleStorageUpdate);
    return () => {
      window.removeEventListener("localStorageUpdate", handleStorageUpdate);
    };
  }, [recipe.id, recipe.comments]);

  const calculateRatingStats = () => {
    const comments =
      commentsFromStorage.length > 0
        ? commentsFromStorage
        : recipe.comments || [];
    const ratingsFromComments = comments.filter(
      (comment) => comment.rating && comment.rating > 0
    );

    if (ratingsFromComments.length === 0) {
      return {
        averageRating: recipe.rating || 0,
        totalRatings: recipe.totalRatings || 0,
        ratingDistribution: [0, 0, 0, 0, 0],
      };
    }

    const totalRating = ratingsFromComments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    const averageRating = totalRating / ratingsFromComments.length;

    // Calculate rating (1-5 stars)
    const distribution = [0, 0, 0, 0, 0];
    ratingsFromComments.forEach((comment) => {
      if (comment.rating >= 1 && comment.rating <= 5) {
        distribution[comment.rating - 1]++;
      }
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratingsFromComments.length,
      ratingDistribution: distribution,
    };
  };

  const ratingStats = calculateRatingStats();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${styles.star} ${
          index < Math.floor(rating) ? styles.filled : styles.empty
        }`}
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
                    className={`${styles.indicator} ${
                      index === currentImageIndex ? styles.active : ""
                    }`}
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
                <span className={styles.categoryTag}>{recipe.category}</span>
              )}
              {recipe.foodType && (
                <span className={styles.foodTypeTag}>{recipe.foodType}</span>
              )}
            </div>
          </div>

          {/* Dynamic Badge */}
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
                  {renderStars(ratingStats.averageRating)}
                </div>
                <span className={styles.ratingText}>
                  {ratingStats.averageRating} ({ratingStats.totalRatings}{" "}
                  reviews)
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
            className={`${styles.actionBtn} ${styles.likeBtn} ${
              isFavorite(recipe.id) ? styles.liked : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe);
              handleLike();
            }}
          >
            <FaHeart className={styles.actionIcon} />
            {isFavorite(recipe.id) ? "Favorited" : "Add to Favorites"}
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
