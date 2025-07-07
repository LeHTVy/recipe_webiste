import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useModal } from '../../App';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import { FaHeart, FaArrowLeft, FaFilter, FaTh, FaList, FaSearch, FaTrash } from 'react-icons/fa';
import styles from './Favorites.module.css';

const Favorites = () => {
  const { isDarkMode } = useTheme();
  const { favorites, getFavoritesCount, clearFavorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated, user } = useAuth();
  const { showDeleteSuccess } = useNotification();
  const { openModal } = useModal();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 
  const [showFilters, setShowFilters] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(favorites.map(recipe => recipe.category))];
    return ['All', ...uniqueCategories.sort()];
  }, [favorites]);
  
  const filteredFavorites = useMemo(() => {
    return favorites.filter(recipe => {
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [favorites, selectedCategory, searchTerm]);

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id || user.username}` : 'favorites_guest';
  };

  // Drag and drop for favorites reordering
  const { getDragProps: getFavoriteDragProps } = useDragAndDrop(
    filteredFavorites,
    (reorderedFavorites) => {
      // Update the favorites order in localStorage using the correct key
      const favoritesKey = getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(reorderedFavorites));
      // Trigger a custom event to notify FavoritesContext
      window.dispatchEvent(new CustomEvent('favoritesReordered', {
        detail: { favorites: reorderedFavorites }
      }));
    }
  );

  if (!isAuthenticated) {
    return (
      <div className={`${styles.favoritesPage} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className="container">
          <div className={styles.notAuthenticated}>
            <FaHeart className={styles.heartIcon} />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your favorite recipes.</p>
            <button 
              className={styles.loginBtn}
              onClick={() => navigate('/auth')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.favoritesPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <button 
            className={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </button>
          
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              <FaHeart className={styles.titleIcon} />
              My Favorite Recipes
            </h1>
            <p className={styles.pageSubtitle}>
              {user?.firstName}'s collection of {getFavoritesCount()} favorite recipes
            </p>
          </div>

          {favorites.length > 0 && (
            <button 
              className={styles.clearAllBtn}
              onClick={() => {
                openModal({
                  type: 'danger',
                  title: 'Clear All Favorites',
                  message: 'Are you sure you want to remove all favorites? This action cannot be undone.',
                  confirmText: 'Clear All',
                  cancelText: 'Cancel',
                  onConfirm: () => {
                    clearFavorites();
                    showDeleteSuccess('All favorites cleared successfully!');
                  }
                });
              }}
            >
              Clear All
            </button>
          )}

        </div>

        {/* Filters and Controls */}
        {favorites.length > 0 && (
          <div className={styles.controlsSection}>
            <div className={styles.searchAndFilter}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <button 
                className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                Filters
              </button>
              
              <div className={styles.viewToggle}>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FaTh />
                </button>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FaList />
                </button>
                <button
                  className={`${styles.dragBtn} ${isDragMode ? styles.active : ''}`}
                  onClick={() => setIsDragMode(!isDragMode)}
                  title="Drag to reorder"
                >
                  ⋮⋮
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className={styles.filtersPanel}>
                <div className={styles.categoryFilters}>
                  <span className={styles.filterLabel}>Category:</span>
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.resultsInfo}>
              <span className={styles.resultsCount}>
                {filteredFavorites.length} of {favorites.length} recipes
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
          </div>
        )}

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHeart className={styles.emptyIcon} />
            <h3>No Favorite Recipes Yet</h3>
            <p>Start exploring recipes and click the heart icon to add them to your favorites!</p>
            <button 
              className={styles.exploreBtn}
              onClick={() => navigate('/recipes')}
            >
              Explore Recipes
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className={styles.emptyState}>
            <FaSearch className={styles.emptyIcon} />
            <h3>No Recipes Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
            <button 
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`${styles.favoritesContainer} ${styles[viewMode]} ${isDragMode ? styles.dragMode : ''}`}>
            {filteredFavorites.map((recipe, index) => (
              <div 
                key={recipe.id} 
                className={`${styles.recipeWrapper} ${isDragMode ? styles.draggable : ''}`}
                {...(isDragMode ? getFavoriteDragProps(index) : {})}
              >
                {isDragMode && <div className={styles.dragHandle}>⋮⋮</div>}
                <RecipeCard recipe={recipe} />
                <button 
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal({
                      type: 'danger',
                      title: 'Remove Recipe',
                      message: `Remove "${recipe.title}" from your favorites?`,
                      confirmText: 'Remove',
                      cancelText: 'Cancel',
                      onConfirm: () => {
                        removeFromFavorites(recipe.id);
                        showDeleteSuccess(`"${recipe.title}" removed from favorites!`);
                      }
                    });
                  }}
                  title="Remove from favorites"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
