// src/pages/RecipeDetails/RecipeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getRecipeById, getRelatedRecipes } from '../../data/mockData';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { FaHeart, FaShare, FaPrint } from 'react-icons/fa';
import styles from './RecipeDetails.module.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [recipe, setRecipe] = useState(null);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const recipeData = getRecipeById(id);
        if (!recipeData) {
          navigate('/recipes');
          return;
        }
        
        setRecipe(recipeData);
        setServings(recipeData.servings);
        
        const related = getRelatedRecipes(parseInt(id));
        setRelatedRecipes(related);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        navigate('/recipes');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, navigate]);

  const handleServingsChange = (newServings) => {
    setServings(Math.max(1, newServings));
  };

  const calculateIngredientAmount = (originalAmount, originalServings, newServings) => {
    if (!originalAmount || typeof originalAmount !== 'string') {
      return originalAmount || '';
    }
    
    const ratio = newServings / originalServings;
    const amount = originalAmount.match(/(\d+(?:\.\d+)?)/);
    if (amount) {
      const newAmount = (parseFloat(amount[0]) * ratio).toFixed(1);
      return originalAmount.replace(amount[0], newAmount);
    }
    return originalAmount;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.notFound}>
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')} className={styles.backBtn}>
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.recipeDetails} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            {/* Recipe Image */}
            <div className={styles.imageContainer}>
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className={styles.recipeImage}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.recipeInfo}>
                  <h1 className={styles.recipeTitle}>{recipe.title}</h1>
                  <div className={styles.recipeMeta}>
                    <span className={styles.difficulty}>{recipe.difficulty}</span>
                    <span className={styles.cookingTime}>{recipe.cookingTime} minutes</span>
                    <div className={styles.rating}>
                      <span className={styles.stars}>
                        {'★'.repeat(Math.floor(recipe.rating))}
                        {'☆'.repeat(5 - Math.floor(recipe.rating))}
                      </span>
                      <span className={styles.ratingText}>
                        {recipe.rating} ({recipe.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Card */}
            <div className={styles.nutritionCard}>
              <h3 className={styles.nutritionTitle}>Nutrition</h3>
              <div className={styles.nutritionGrid}>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>KCAL</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.kcal}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>FAT</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.fat}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>SATURATES</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.saturates}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>CARBS</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.carbs}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>SUGARS</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.sugars}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>FIBRE</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.fibre}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>PROTEIN</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.protein}</span>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutritionLabel}>SALT</span>
                  <span className={styles.nutritionValue}>{recipe.nutrition.salt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className="container">
          <div className={styles.contentGrid}>
            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Description */}
              <div className={styles.descriptionSection}>
                <p className={styles.description}>{recipe.description}</p>
              </div>

              {/* Tabs */}
              <div className={styles.tabsContainer}>
                <div className={styles.tabsHeader}>
                  <button 
                    className={`${styles.tab} ${activeTab === 'ingredients' ? styles.active : ''}`}
                    onClick={() => setActiveTab('ingredients')}
                  >
                    Ingredients
                  </button>
                  <button 
                    className={`${styles.tab} ${activeTab === 'method' ? styles.active : ''}`}
                    onClick={() => setActiveTab('method')}
                  >
                    Method
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTab === 'ingredients' && (
                    <div className={styles.ingredientsTab}>
                      {/* Servings Controller */}
                      <div className={styles.servingsController}>
                        <span className={styles.servingsLabel}>Servings:</span>
                        <div className={styles.servingsControls}>
                          <button 
                            onClick={() => handleServingsChange(servings - 1)}
                            className={styles.servingsBtn}
                            disabled={servings <= 1}
                          >
                            -
                          </button>
                          <span className={styles.servingsValue}>{servings}</span>
                          <button 
                            onClick={() => handleServingsChange(servings + 1)}
                            className={styles.servingsBtn}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Ingredients List */}
                      <div className={styles.ingredientsList}>
                        {recipe.detailedIngredients.map((ingredient, index) => (
                          <div key={index} className={styles.ingredientItem}>
                            <span className={styles.ingredientAmount}>
                              {calculateIngredientAmount(ingredient.amount, recipe.servings, servings)}
                            </span>
                            <span className={styles.ingredientName}>{ingredient.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'method' && (
                    <div className={styles.methodTab}>
                      {recipe.instructions.map((instruction, index) => (
                        <div key={index} className={styles.methodStep}>
                          <div className={styles.stepNumber}>
                            Step {instruction.step}
                          </div>
                          <div className={styles.stepContent}>
                            <h4 className={styles.stepTitle}>{instruction.title}</h4>
                            <p className={styles.stepDescription}>{instruction.description}</p>
                            <span className={styles.stepTime}>{instruction.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              {/* Author Info */}
              <div className={styles.authorCard}>
                <img 
                  src={recipe.author.avatar} 
                  alt={recipe.author.name}
                  className={styles.authorAvatar}
                />
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{recipe.author.name}</h4>
                  <p className={styles.authorBio}>{recipe.author.bio}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button className={styles.favoriteBtn}>
                  <FaHeart /> Add to Favorites
                </button>
                <button className={styles.shareBtn}>
                  <FaShare /> Share Recipe
                </button>
                <button className={styles.printBtn}>
                  <FaPrint /> Print Recipe
                </button>
              </div>

              {/* Tags */}
              <div className={styles.tagsSection}>
                <h4 className={styles.tagsTitle}>Tags</h4>
                <div className={styles.tagsList}>
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Recipes */}
          {relatedRecipes.length > 0 && (
            <div className={styles.relatedSection}>
              <h3 className={styles.relatedTitle}>You might also like</h3>
              <div className={styles.relatedGrid}>
                {relatedRecipes.map(relatedRecipe => (
                  <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
