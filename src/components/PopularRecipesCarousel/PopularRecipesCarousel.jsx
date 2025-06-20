// src/components/PopularRecipesCarousel/PopularRecipesCarousel.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotification } from '../../context/NotificationContext';
import { getPopularRecipes, getTopRatedRecipes } from '../../data/mockData';
import { FaFire, FaComments, FaStar, FaShare, FaHeart } from 'react-icons/fa';
import RecipeBadge from '../RecipeBadge/RecipeBadge';
import styles from './PopularRecipesCarousel.module.css';

// Component to handle dynamic rating calculation for each recipe
const RecipeWithDynamicRating = ({ recipe, children }) => {
  const [calculatedRating, setCalculatedRating] = useState({ averageRating: recipe.rating || 0, totalRatings: recipe.totalRatings || 0 });

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

  return children(calculatedRating);
};

const PopularRecipesCarousel = ({ selectedTag }) => {
  const { isDarkMode } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showNotification } = useNotification(); // Added for share notification
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('popular'); 

  // Function to get display image - randomly select from images array if multiple exist
  const getDisplayImage = (recipe) => {
    if (recipe.images && recipe.images.length > 1) {
      const randomIndex = Math.floor(Math.random() * recipe.images.length);
      return recipe.images[randomIndex];
    }
    return recipe.image; // Fallback to single image
  };

  // Get recipes based on view mode with memoization
  const recipes = useMemo(() => {
    if (viewMode === 'popular') {
      // Show recipes with POPULAR award or TRENDING (commentCount > 10)
      return getPopularRecipes(20).filter(recipe => 
        recipe.recipeaward === 'POPULAR' || recipe.commentCount > 10
      ).slice(0, 6);
    } else {
      // Show recipes with TOP_RATED award or EXCELLENT (rating >= 4.8)
      return getTopRatedRecipes(20).filter(recipe => 
        recipe.recipeaward === 'TOP_RATED' || recipe.rating >= 4.8
      ).slice(0, 6);
    }
  }, [viewMode]);

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < recipes.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else {
        stars.push('☆');
      }
    }
    return stars.join('');
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };



  return (
    <div className={`${styles.popularSection} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header với Title Style Cũ và View Toggle */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.carouselTitle}>
            {viewMode === 'popular' 
              ? (selectedTag ? `Popular ${selectedTag.replace('-', ' ')} recipes` : 'Popular recipes')
              : (selectedTag ? `Top Rated ${selectedTag.replace('-', ' ')} recipes` : 'Top Rated recipes')
            }
          </h3>
          <p className={styles.subtitle}>
            {viewMode === 'popular' 
              ? 'Most loved recipes by our community' 
              : 'Highest rated recipes from our collection'
            }
          </p>
        </div>
        
        <div className={styles.headerRight}>
          {/* View Mode Toggle */}
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'popular' ? styles.active : ''}`}
              onClick={() => {
                setViewMode('popular');
                setCurrentIndex(0);
              }}
            >
              <FaFire /> Popular
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'toprated' ? styles.active : ''}`}
              onClick={() => {
                setViewMode('toprated');
                setCurrentIndex(0);
              }}
            >
              <FaStar /> Top Rated
            </button>
          </div>
          
          {/* Navigation Controls */}
          <div className={styles.controls}>
            <button 
              className={styles.controlBtn}
              onClick={scrollLeft}
              disabled={currentIndex === 0}
            >
              ←
            </button>
            <button 
              className={styles.controlBtn}
              onClick={scrollRight}
              disabled={currentIndex >= recipes.length - 3}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className={styles.carousel}>
        <div 
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
        >
          {recipes.map((recipe, index) => {
            return (
              <RecipeWithDynamicRating key={recipe.id} recipe={recipe}>
                {(calculatedRating) => (
                  <div className={styles.recipeCard}>
                    {/* Image */}
                    <div className={styles.imageContainer}>
                      {/* Dynamic Badge */}
                      <RecipeBadge recipe={recipe} index={index} viewMode={viewMode} />
                      <img 
                        src={getDisplayImage(recipe)} 
                        alt={recipe.title}
                        className={styles.recipeImage}
                      />
                      
                      {/* Popularity/Rating Indicator */}
                      <div className={styles.scoreIndicator}>
                        {viewMode === 'popular' ? (
                          <div className={styles.popularityScore}>
                            <FaComments className={styles.scoreIcon} />
                            <span className={styles.scoreValue}>{recipe.commentCount}</span>
                          </div>
                        ) : (
                          <div className={styles.ratingScore}>
                            <FaStar className={styles.scoreIcon} />
                            <span className={styles.scoreValue}>{calculatedRating.averageRating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={styles.cardContent}>
                      <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                      <p className={styles.recipeDescription}>{recipe.description}</p>

                      {/* Rating và Comments */}
                      <div className={styles.engagement}>
                        <div className={styles.rating}>
                          <span className={styles.stars}>{renderStars(calculatedRating.averageRating)}</span>
                          <span className={styles.ratingValue}>{calculatedRating.averageRating}</span>
                          <span className={styles.ratingCount}>({calculatedRating.totalRatings})</span>
                        </div>
                        <div className={styles.comments}>
                          <FaComments className={styles.commentIcon} />
                          <span className={styles.commentCount}>{recipe.commentCount}</span>
                        </div>
                      </div>

                  {/* Actions */}
                      <div className={styles.actions}>
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
                          className={styles.viewBtn}
                          onClick={() => handleViewRecipe(recipe.id)}
                        >
                          View Recipe
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </RecipeWithDynamicRating>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {Array.from({ length: Math.max(0, recipes.length - 2) }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* View Mode Info */}
      <div className={styles.viewInfo}>
        <span className={styles.viewLabel}>
          Showing {viewMode === 'popular' ? 'Popular' : 'Top Rated'} • 
        </span>
        <span className={styles.viewCount}>
          {recipes.length} recipes
        </span>
      </div>
    </div>
  );
};

export default PopularRecipesCarousel;
