// src/components/RecipeTagsCarousel/RecipeTagsCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getAllTags, getRecipesByTag } from '../../data/mockData';
import styles from './RecipeTagsCarousel.module.css';

const RecipeTagsCarousel = ({ onTagSelect, selectedTag }) => {
  const [allTags] = useState(getAllTags());
  const [filteredTags, setFilteredTags] = useState(getAllTags());
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTags, setVisibleTags] = useState(7); 
  const carouselRef = useRef(null);

  // Update visible tags based on screen size
  useEffect(() => {
    const updateVisibleTags = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setVisibleTags(2);
      } else if (width < 768) {
        setVisibleTags(3);
      } else if (width < 1024) {
        setVisibleTags(4);
      } else {
        setVisibleTags(7);
      }
    };

    updateVisibleTags();
    window.addEventListener('resize', updateVisibleTags);
    return () => window.removeEventListener('resize', updateVisibleTags);
  }, []);

  // Filter tags based on search keyword
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredTags(allTags);
    } else {
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredTags(filtered);
    }
    setCurrentIndex(0); // Reset index when filtering
  }, [searchKeyword, allTags]);

  const slideLeft = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, filteredTags.length - visibleTags) : prev - 1
    );
  };

  const slideRight = () => {
    setCurrentIndex(prev => 
      prev >= filteredTags.length - visibleTags ? 0 : prev + 1
    );
  };

  const handleTagClick = (tag) => {
    onTagSelect(tag);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const clearSearch = () => {
    setSearchKeyword('');
  };

  const getDisplayedTags = () => {
    if (filteredTags.length <= visibleTags) return filteredTags;
    
    const displayed = [];
    for (let i = 0; i < visibleTags; i++) {
      const index = (currentIndex + i) % filteredTags.length;
      displayed.push(filteredTags[index]);
    }
    return displayed;
  };

  return (
    <div className={styles.carouselContainer}>
      {/* Search Bar Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            placeholder="Search tags..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {/* Search Icon : <div className={styles.searchIcon}>🔍</div> */}
          {searchKeyword && (
            <button 
              className={styles.clearSearchBtn}
              onClick={clearSearch}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        {searchKeyword && (
          <div className={styles.searchResults}>
            {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Navigation Button Left */}
      <button 
        className={`${styles.navButton} ${styles.leftButton}`}
        onClick={slideLeft}
        disabled={filteredTags.length <= visibleTags}
      >
        ←
      </button>
      
      {/* Tags Container */}
      <div className={styles.tagsContainer} ref={carouselRef}>
        <div className={styles.tagsWrapper}>
          {getDisplayedTags().map((tag, index) => {
            const recipeCount = getRecipesByTag(tag).length;
            return (
              <button
                key={`${tag}-${currentIndex}-${index}`}
                className={`${styles.tagButton} ${
                  selectedTag === tag ? styles.active : ''
                }`}
                onClick={() => handleTagClick(tag)}
              >
                <span className={styles.tagName}>
                  {tag.replace('-', ' ')}
                </span>
                <span className={styles.tagCount}>
                  {recipeCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Button Right */}
      <button 
        className={`${styles.navButton} ${styles.rightButton}`}
        onClick={slideRight}
        disabled={filteredTags.length <= visibleTags}
      >
        →
      </button>
    </div>
  );
};

export default RecipeTagsCarousel;
