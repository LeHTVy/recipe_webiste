// src/pages/Recipes/Recipes.jsx - Cập nhật với OurPicks component
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { mockRecipes, searchRecipes, getRandomRecipes } from '../../data/mockData';
import RecipeTagsCarousel from '../../components/RecipeTagsCarousel/RecipeTagsCarousel';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import CategoryFilter from './components/CategoryFilter/CategoryFilter';
import SearchBox from './components/SearchBox/SearchBox';
import OurPicks from './components/OurPicks/OurPicks';
import styles from './Recipes.module.css';

const Recipes = () => {
  const { isDarkMode } = useTheme();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user-created recipes from localStorage
      const userRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      // Only include published recipes in the main recipes page
      const publishedUserRecipes = userRecipes.filter(recipe => recipe.status === 'published');
      
      // Combine mock recipes with published user recipes
      const allRecipes = [...mockRecipes, ...publishedUserRecipes];
      const sortedRecipes = allRecipes.sort((a, b) => b.rating - a.rating);
      
      setRecipes(sortedRecipes);
      setFilteredRecipes(sortedRecipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();

    // Listen for localStorage changes to update recipe data
    const handleStorageChange = (e) => {
      if (e.key === 'recipes') {
        fetchRecipes();
      }
    };

    // Listen for custom storage events (for same-tab updates)
    const handleCustomStorageChange = () => {
      fetchRecipes();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleCustomStorageChange);
    };
  }, []);

  const handleTagSelect = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      applyFilters(searchTerm, selectedCategory, null);
    } else {
      setSelectedTag(tag);
      applyFilters(searchTerm, selectedCategory, tag);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category, selectedTag);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, selectedCategory, selectedTag);
  };

  const applyFilters = (searchQuery, category, tag) => {
    let filtered = searchRecipes(searchQuery, category);
    
    if (tag) {
      filtered = filtered.filter(recipe => recipe.tags.includes(tag));
    }
    
    setFilteredRecipes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredRecipes = getRandomRecipes(4);

  return (
    <div className={`${styles.recipesPage} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.brandInfo}>
                <h1 className={styles.brandLogo}>TasteMate</h1>
              </div>

              <div className={styles.titleSection}>
                <h2 className={styles.pageTitle}>
                  <span className={styles.titleRecipe}>Recipe</span>
                  <span className={styles.titleCollection}>Collection</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.curvedPath}>
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path 
              d="M0,100 C300,0 900,0 1200,100 L1200,100 L0,100 Z" 
              fill={isDarkMode ? "#1A1A1A" : "#F8F9FA"}
            />
          </svg>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className="container">
          {/* Our Picks Section - Sử dụng OurPicks Component */}
          <OurPicks 
            featuredRecipes={featuredRecipes}
            title="Our Picks"
            subtitle="Delicious recipes we chose for you"
          />

          {/* Search and Filter Section */}
          <div className={styles.searchContainer}>
            <SearchBox 
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              placeholder="Search recipes by name, ingredient..."
            />

            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <div className={styles.filterInfo}>
              <span className={styles.resultsCount}>
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </span>
              {(selectedTag || selectedCategory !== 'all' || searchTerm) && (
                <button 
                  className={styles.clearFilter}
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setFilteredRecipes(recipes);
                    setCurrentPage(1);
                  }}
                >
                  Clear filters ✕
                </button>
              )}
            </div>
          </div>

          <RecipeTagsCarousel 
            onTagSelect={handleTagSelect}
            selectedTag={selectedTag}
          />

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading delicious recipes...</p>
            </div>
          ) : (
            <>
              <div className={styles.recipeGrid}>
                {currentRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && filteredRecipes.length === 0 && (
            <div className={styles.noResults}>
              <h3>No recipes found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                className={styles.clearFilter}
                onClick={() => {
                  setSelectedTag(null);
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setFilteredRecipes(recipes);
                  setCurrentPage(1);
                }}
              >
                Show all recipes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;
