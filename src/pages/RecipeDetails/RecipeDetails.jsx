// src/pages/RecipeDetails/RecipeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getRecipeById, getRelatedRecipes } from '../../data/mockData';
import HeroRecipe from './components/HeroRecipe/HeroRecipe';
import RecipeNutrition from './components/RecipeNutrition/RecipeNutrition';
import RecipeAuthor from './components/RecipeAuthor/RecipeAuthor';

import RecipeCard from '../../components/RecipeCard/RecipeCard';
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
      {/* Hero Recipe Component */}
      <HeroRecipe 
        recipe={recipe}
        onFavorite={() => console.log('Favorite clicked')}
        onShare={() => console.log('Share clicked')}
      />
      
      {/* Recipe Author Component */}
      <RecipeAuthor 
        author={recipe.author}
      />
      
      {/* Recipe Nutrition Component */}
      <RecipeNutrition 
        recipe={recipe}
        servings={servings}
        onServingsChange={handleServingsChange}
        calculateIngredientAmount={calculateIngredientAmount}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <div className={styles.relatedRecipes}>
          <h3 className={styles.relatedTitle}>You might also like</h3>
          <div className={styles.relatedGrid}>
            {relatedRecipes.map(relatedRecipe => (
              <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
