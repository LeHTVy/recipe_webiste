// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaUtensils, FaLeaf, FaComments, FaStar, FaUser, FaThumbsUp, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../../../../context/AuthContext';
import styles from './RecipeNutrition.module.css';

const RecipeNutrition = ({ recipe }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('nutrition');
  const [servings, setServings] = useState(recipe.servings || 1);
  const [comments, setComments] = useState(recipe.comments || []);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Redirect to nutrition tab if user is not authenticated and comments tab is selected
  useEffect(() => {
    if (!isAuthenticated && activeTab === 'comments') {
      setActiveTab('nutrition');
    }
  }, [isAuthenticated, activeTab]);


  const handleServingsChange = (newServings) => {
    setServings(Math.max(1, newServings));
  };

  const calculateNutritionValue = (originalValue, originalServings, newServings) => {
    if (!originalValue || typeof originalValue !== 'string') {
      return originalValue || '0';
    }
    
    const ratio = newServings / originalServings;
    const numericValue = originalValue.match(/(\d+(?:\.\d+)?)/)?.[0];
    
    if (numericValue) {
      const newValue = (parseFloat(numericValue) * ratio).toFixed(1);
      return originalValue.replace(numericValue, newValue);
    }
    return originalValue;
  };

  const calculateIngredientAmount = (originalAmount, originalServings, newServings) => {
    if (!originalAmount || typeof originalAmount !== 'string') {
      return originalAmount || '';
    }
    
    const ratio = newServings / originalServings;
    const amount = originalAmount.match(/(\d+(?:\.\d+)?)/)?.[0];
    
    if (amount) {
      const newAmount = (parseFloat(amount) * ratio).toFixed(1);
      return originalAmount.replace(amount, newAmount);
    }
    return originalAmount;
  };

  const calculateTotalCalories = (nutrition, originalServings, newServings) => {
    if (!nutrition) return '0';
    
    const ratio = newServings / originalServings;
    
    // Extract numeric values from nutrition strings
    const extractValue = (value) => {
      if (!value || typeof value !== 'string') return 0;
      const match = value.match(/(\d+(?:\.\d+)?)/)?.[0];
      return match ? parseFloat(match) : 0;
    };
    
    // Get nutrition values in grams
    const fat = extractValue(nutrition.fat) * ratio;
    const carbs = extractValue(nutrition.carbs) * ratio;
    const protein = extractValue(nutrition.protein) * ratio;
    const fibre = extractValue(nutrition.fibre) * ratio;
    
    // Calculate calories based on conversion table
    // Fat: 9 kcal/g, Carbs: 4 kcal/g, Protein: 4 kcal/g, Fibre: 2 kcal/g
    const totalCalories = (fat * 9) + (carbs * 4) + (protein * 4) + (fibre * 2);
    
    return Math.round(totalCalories).toString();
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      username: 'Current User',
      avatar: '/default-avatar.png',
      comment: newComment,
      rating: newRating,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setNewRating(0);
  };

  const handleLike = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: (comment.likes || 0) + 1 }
        : comment
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else if (sortBy === 'oldest') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  const nutritionData = [
    { label: 'FAT', value: recipe.nutrition?.fat || '0g', color: '#f39c12' },
    { label: 'SATURATES', value: recipe.nutrition?.saturates || '0g', color: '#e67e22' },
    { label: 'CARBS', value: recipe.nutrition?.carbs || '0g', color: '#3498db' },
    { label: 'SUGARS', value: recipe.nutrition?.sugars || '0g', color: '#9b59b6' },
    { label: 'FIBRE', value: recipe.nutrition?.fibre || '0g', color: '#27ae60' },
    { label: 'PROTEIN', value: recipe.nutrition?.protein || '0g', color: '#e74c3c' },
    { label: 'SALT', value: recipe.nutrition?.salt || '0g', color: '#95a5a6' }
  ];

  return (
    <div className={styles.nutritionContainer}>
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'nutrition' ? styles.active : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <FaLeaf className={styles.tabIcon} />
          Nutrition
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'ingredients' ? styles.active : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          <FaUtensils className={styles.tabIcon} />
          Ingredients
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'method' ? styles.active : ''}`}
          onClick={() => setActiveTab('method')}
        >
          <FaUtensils className={styles.tabIcon} />
          Method
        </button>
        {isAuthenticated && (
          <button 
            className={`${styles.tabBtn} ${activeTab === 'comments' ? styles.active : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <FaComments className={styles.tabIcon} />
            Comments
          </button>
        )}
      </div>

      {/* Servings Controller */}
      <div className={styles.servingsController}>
        <span className={styles.servingsLabel}>Servings:</span>
        <div className={styles.servingsControls}>
          <button 
            onClick={() => handleServingsChange(servings - 1)}
            className={styles.servingsBtn}
            disabled={servings <= 1}
          >
            <FaMinus />
          </button>
          <span className={styles.servingsValue}>{servings}</span>
          <button 
            onClick={() => handleServingsChange(servings + 1)}
            className={styles.servingsBtn}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'nutrition' && (
          <div className={styles.nutritionTab}>
            <h3 className={styles.sectionTitle}>Nutrition Information</h3>
            <div className={styles.nutritionGrid}>
              {nutritionData.map((item, index) => (
                <div key={index} className={styles.nutritionItem}>
                  <div 
                    className={styles.nutritionBar}
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className={styles.nutritionInfo}>
                    <span className={styles.nutritionLabel}>{item.label}</span>
                    <span className={styles.nutritionValue}>
                      {calculateNutritionValue(item.value, recipe.servings, servings)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.caloriesHighlight}>
              <div className={styles.caloriesCircle}>
                <span className={styles.caloriesNumber}>
                  {calculateTotalCalories(recipe.nutrition, recipe.servings, servings)}
                </span>
                <span className={styles.caloriesLabel}>Calories</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className={styles.ingredientsTab}>
            <h3 className={styles.sectionTitle}>Ingredients</h3>
            <div className={styles.ingredientsList}>
              {recipe.detailedIngredients?.map((ingredient, index) => (
                <div key={index} className={styles.ingredientItem}>
                  <div className={styles.ingredientAmount}>
                    {calculateIngredientAmount(ingredient.amount, recipe.servings, servings)}
                  </div>
                  <div className={styles.ingredientName}>{ingredient.name}</div>
                  <div className={styles.ingredientCheck}>
                    <input type="checkbox" id={`ingredient-${index}`} />
                    <label htmlFor={`ingredient-${index}`} className={styles.checkmark}></label>
                  </div>
                </div>
              )) || (
                <p className={styles.noData}>No detailed ingredients available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'method' && (
          <div className={styles.methodTab}>
            <h3 className={styles.sectionTitle}>Cooking Method</h3>
            <div className={styles.methodSteps}>
              {recipe.instructions?.map((instruction, index) => (
                <div key={index} className={styles.methodStep}>
                  <div className={styles.stepNumber}>{instruction.step}</div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>{instruction.title}</h4>
                    <p className={styles.stepDescription}>{instruction.description}</p>
                    {instruction.time && (
                      <span className={styles.stepTime}>{instruction.time}</span>
                    )}
                  </div>
                </div>
              )) || (
                <p className={styles.noData}>No cooking instructions available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && isAuthenticated && (
          <div className={styles.commentsTab}>
            <div className={styles.commentsHeader}>
              <h3 className={styles.sectionTitle}>
                Comments ({comments.length})
              </h3>
              
              <div className={styles.sortControls}>
                <label className={styles.sortLabel}>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Add Comment Form */}
            <div className={styles.addCommentSection}>
              <h4 className={styles.addCommentTitle}>Leave a Review</h4>
              
              <form onSubmit={handleSubmitComment} className={styles.commentForm}>
                <div className={styles.ratingSection}>
                  <span className={styles.ratingLabel}>Your Rating:</span>
                  <div className={styles.ratingStars}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <FaStar
                        key={index}
                        className={index < newRating ? styles.starFilled : styles.starEmpty}
                        onClick={() => setNewRating(index + 1)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className={styles.commentInputSection}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className={styles.commentTextarea}
                    rows={4}
                  />
                  
                  <button type="submit" className={styles.submitBtn}>
                    <FaPaperPlane className={styles.submitIcon} />
                    Post Comment
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className={styles.commentsList}>
              {sortedComments.length === 0 ? (
                <div className={styles.noComments}>
                  <FaUser className={styles.noCommentsIcon} />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                sortedComments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <div className={styles.commentAuthor}>
                        <img 
                          src={comment.avatar} 
                          alt={comment.username}
                          className={styles.authorAvatar}
                        />
                        <div className={styles.authorInfo}>
                          <span className={styles.authorName}>{comment.username}</span>
                          <span className={styles.commentDate}>{formatDate(comment.timestamp)}</span>
                        </div>
                      </div>
                      
                      {comment.rating && (
                        <div className={styles.commentRating}>
                          {renderStars(comment.rating)}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.commentContent}>
                      <p className={styles.commentText}>{comment.comment}</p>
                    </div>
                    
                    <div className={styles.commentActions}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleLike(comment.id)}
                      >
                        <FaThumbsUp className={styles.actionIcon} />
                        {comment.likes || 0}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeNutrition;