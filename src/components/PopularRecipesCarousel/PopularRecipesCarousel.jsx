import React, { useState, useRef, useEffect, useCallback  } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import { mockRecipes } from '../../data/mockData';
import styles from './PopularRecipesCarousel.module.css';

const PopularRecipesCarousel = ({ selectedTag }) => {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef(null);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Get popular recipes based on rating
  useEffect(() => {
    let filteredRecipes = [...mockRecipes];
    
    if (selectedTag) {
      filteredRecipes = mockRecipes.filter(recipe => 
        recipe.tags.includes(selectedTag)
      );
    }
    
    // Sort by rating and get top recipes
    const popular = filteredRecipes
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12); // Get top 12 recipes
    
    setPopularRecipes(popular);
    setCurrentIndex(0);
  }, [selectedTag]);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else if (width < 1440) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Update scroll buttons state
  useEffect(() => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < popularRecipes.length - itemsPerView);
  }, [currentIndex, popularRecipes.length, itemsPerView]);

  const scrollRight = useCallback(() => {
    if (canScrollRight) {
      setCurrentIndex(prev => 
        Math.min(popularRecipes.length - itemsPerView, prev + 1)
      );
    }
  }, [canScrollRight, popularRecipes.length, itemsPerView]);

  const scrollLeft = useCallback(() => {
    if (canScrollLeft) {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  }, [canScrollLeft]);

  // Auto-scroll functionality với dependency array đúng
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (canScrollRight) {
        scrollRight();
      } else {
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [canScrollRight, scrollRight]);

  // Touch/Mouse drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (popularRecipes.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading popular recipes...</p>
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.carouselTitle}>
            {selectedTag ? `Popular ${selectedTag.replace('-', ' ')} recipes` : 'Popular recipes'}
          </h3>
          <p className={styles.carouselSubtitle}>
            {selectedTag 
              ? `Top-rated ${selectedTag.replace('-', ' ')} recipes loved by our community`
              : 'Top-rated recipes loved by our community'
            }
          </p>
        </div>
        
        <div className={styles.carouselControls}>
          <button 
            className={`${styles.controlBtn} ${!canScrollLeft ? styles.disabled : ''}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button 
            className={`${styles.controlBtn} ${!canScrollRight ? styles.disabled : ''}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <div 
          className={styles.carouselTrack}
          ref={carouselRef}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {popularRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className={styles.carouselItem}
              style={{ minWidth: `${100 / itemsPerView}%` }}
            >
              <RecipeCard recipe={recipe} />
              {index === 0 && (
                <div className={styles.popularBadge}>
                  🏆 Most Popular
                </div>
              )}
              {recipe.rating >= 4.8 && index !== 0 && (
                <div className={styles.topRatedBadge}>
                  ⭐ Top Rated
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className={styles.dotsContainer}>
        {Array.from({ length: Math.ceil(popularRecipes.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${Math.floor(currentIndex / itemsPerView) === index ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index * itemsPerView)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularRecipesCarousel;
