import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaUsers, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useTheme } from '../../../../context/ThemeContext';
import ProfileRecipeCard from '../../../../components/ProfileRecipeCard/ProfileRecipeCard';
import ProfilePostCard from '../../../../components/ProfilePostCard/ProfilePostCard';
import styles from './UserCreatedList.module.css';

const UserCreatedList = ({ 
  activeTab, 
  setActiveTab, 
  userRecipes, 
  userCommunityPosts, 
  onEditRecipe, 
  onDeleteRecipe, 
  onPublishRecipe, 
  onViewRecipe 
}) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  const handleCreateRecipe = () => {
    navigate('/create-recipe');
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    if (!userRecipes) return [];
    
    let filtered = userRecipes.filter(recipe => 
      recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.dateCreated || 0);
      const dateB = new Date(b.createdAt || b.dateCreated || 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [userRecipes, searchTerm, sortOrder]);

  // Filter and sort community posts
  const filteredAndSortedPosts = useMemo(() => {
    if (!userCommunityPosts) return [];
    
    let filtered = userCommunityPosts.filter(post => 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [userCommunityPosts, searchTerm, sortOrder]);



  return (
    <div className={`${styles.userCreatedList} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Content Header */}
      <div className={styles.contentHeader}>
        <h2 className={styles.contentTitle}>My Content</h2>
        
        {/* Tab Toggle Buttons */}
        <div className={styles.toggleButtons}>
          <button 
            className={`${styles.toggleButton} ${activeTab === 'recipes' ? styles.active : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <FaUtensils /> My Recipes
          </button>
          <button 
            className={`${styles.toggleButton} ${activeTab === 'community' ? styles.active : ''}`}
            onClick={() => setActiveTab('community')}
          >
            <FaUsers /> Community Posts
          </button>
        </div>

        {/* Filter Controls */}
        <div className={styles.filterControls}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'recipes' ? 'recipes' : 'posts'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <button 
            className={styles.sortButton}
            onClick={toggleSortOrder}
            title={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
          >
            {sortOrder === 'newest' ? <FaSortAmountDown /> : <FaSortAmountUp />}
            <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === 'recipes' && (
          <div className={styles.recipesContent}>
            {filteredAndSortedRecipes && filteredAndSortedRecipes.length > 0 ? (
              <div className={styles.recipesGrid}>
                {filteredAndSortedRecipes.map((recipe) => (
                  <div key={recipe.id} className={styles.recipeCardWrapper}>
                    <ProfileRecipeCard 
                      recipe={recipe}
                      onEdit={() => onEditRecipe(recipe.id)}
                      onDelete={() => onDeleteRecipe(recipe.id)}
                      onPublish={() => onPublishRecipe(recipe.id)}
                      onView={() => onViewRecipe(recipe.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><FaUtensils /></div>
                <h3>{searchTerm ? 'No recipes found' : 'No recipes yet'}</h3>
                <p>{searchTerm ? `No recipes match "${searchTerm}"` : 'Start sharing your culinary creations with the world!'}</p>
                <button 
                  className={styles.createBtn}
                  onClick={handleCreateRecipe}
                >
                  Create Your First Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'community' && (
          <div className={styles.communityContent}>
            {filteredAndSortedPosts && filteredAndSortedPosts.length > 0 ? (
              <div className={styles.communityPostsGrid}>
                {filteredAndSortedPosts.map((post) => (
                  <ProfilePostCard
                    key={post.id}
                    post={post}
                    onEdit={(postId) => console.log('Edit post:', postId)}
                    onDelete={(postId) => console.log('Delete post:', postId)}
                    onView={(postId) => console.log('View post:', postId)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}><FaUsers /></div>
                <h3>{searchTerm ? 'No posts found' : 'No community posts yet'}</h3>
                <p>{searchTerm ? `No posts match "${searchTerm}"` : 'Share your culinary journey with the community!'}</p>
                <button 
                  className={styles.createBtn}
                  onClick={handleCreatePost}
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCreatedList;