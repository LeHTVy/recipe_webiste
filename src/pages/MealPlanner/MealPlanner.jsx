// src/pages/MealPlanner/MealPlanner.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { mockRecipes } from '../../data/mockData';
import {
  FaCalendarAlt,
  FaPlus,
  FaClock,
  FaUsers,
  FaFire,
  FaShoppingCart,
  FaSearch,
  FaTimes,
  FaUtensils,
  FaStar,
  FaDownload
} from 'react-icons/fa';
import styles from './MealPlanner.module.css';

const MealPlanner = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  const [activeTab, setActiveTab] = useState('planner');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [mealPlan, setMealPlan] = useState({});
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRecipes, setFilteredRecipes] = useState(mockRecipes);
  const [shoppingList, setShoppingList] = useState([]);
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'appetizer'];
  
  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };
  
  const weekDates = getWeekDates(selectedWeek);
  
  // Load meal plan from localStorage
  useEffect(() => {
    if (user) {
      const savedMealPlan = localStorage.getItem(`tastemate_meal_plan_${user.id}`);
      if (savedMealPlan) {
        try {
          setMealPlan(JSON.parse(savedMealPlan));
        } catch (error) {
          console.error('Error loading meal plan:', error);
        }
      }
    }
  }, [user]);
  
  // Save meal plan to localStorage
  const saveMealPlan = (newMealPlan) => {
    if (user) {
      localStorage.setItem(`tastemate_meal_plan_${user.id}`, JSON.stringify(newMealPlan));
      setMealPlan(newMealPlan);
    }
  };
  
  // Filter recipes
  useEffect(() => {
    let filtered = mockRecipes;
    
    if (searchTerm) {
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.category.toLowerCase() === selectedCategory.toLowerCase() ||
        recipe.foodType.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredRecipes(filtered);
  }, [searchTerm, selectedCategory]);
  
  // Generate shopping list
  useEffect(() => {
    const ingredients = new Map();
    
    Object.values(mealPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meals => {
        meals.forEach(meal => {
          if (meal.detailedIngredients) {
            meal.detailedIngredients.forEach(ingredient => {
              const key = ingredient.name.toLowerCase();
              if (ingredients.has(key)) {
                ingredients.set(key, {
                  ...ingredients.get(key),
                  amount: `${ingredients.get(key).amount} + ${ingredient.amount}`
                });
              } else {
                ingredients.set(key, {
                  name: ingredient.name,
                  amount: ingredient.amount,
                  item: ingredient.item
                });
              }
            });
          }
        });
      });
    });
    
    setShoppingList(Array.from(ingredients.values()));
  }, [mealPlan]);
  
  // Add meal to plan
  const addMealToPlan = (recipe) => {
    if (!selectedMealSlot || !user) return;
    
    const { date, mealType } = selectedMealSlot;
    const dateKey = date.toISOString().split('T')[0];
    
    const newMealPlan = { ...mealPlan };
    if (!newMealPlan[dateKey]) {
      newMealPlan[dateKey] = {};
    }
    if (!newMealPlan[dateKey][mealType]) {
      newMealPlan[dateKey][mealType] = [];
    }
    
    newMealPlan[dateKey][mealType].push(recipe);
    saveMealPlan(newMealPlan);
    setShowRecipeModal(false);
    setSelectedMealSlot(null);
    showNotification('Meal added to your plan!', 'success');
  };
  
  // Remove meal from plan
  const removeMealFromPlan = (date, mealType, recipeId) => {
    const dateKey = date.toISOString().split('T')[0];
    const newMealPlan = { ...mealPlan };
    
    if (newMealPlan[dateKey] && newMealPlan[dateKey][mealType]) {
      newMealPlan[dateKey][mealType] = newMealPlan[dateKey][mealType].filter(
        meal => meal.id !== recipeId
      );
      
      if (newMealPlan[dateKey][mealType].length === 0) {
        delete newMealPlan[dateKey][mealType];
      }
      
      if (Object.keys(newMealPlan[dateKey]).length === 0) {
        delete newMealPlan[dateKey];
      }
    }
    
    saveMealPlan(newMealPlan);
    showNotification('Meal removed from your plan!', 'info');
  };
  
  // Calculate daily calories
  const getDailyCalories = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    const dayMeals = mealPlan[dateKey];
    
    if (!dayMeals) return 0;
    
    let totalCalories = 0;
    Object.values(dayMeals).forEach(meals => {
      meals.forEach(meal => {
        if (meal.nutrition && meal.nutrition.kcal) {
          totalCalories += meal.nutrition.kcal;
        }
      });
    });
    
    return totalCalories;
  };
  
  // Calculate weekly stats
  const getWeeklyStats = () => {
    let totalMeals = 0;
    let totalCalories = 0;
    let totalIngredients = shoppingList.length;
    let totalCookingTime = 0;
    
    weekDates.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      const dayMeals = mealPlan[dateKey];
      
      if (dayMeals) {
        Object.values(dayMeals).forEach(meals => {
          totalMeals += meals.length;
          meals.forEach(meal => {
            if (meal.nutrition && meal.nutrition.kcal) {
              totalCalories += meal.nutrition.kcal;
            }
            if (meal.cookingTime) {
              totalCookingTime += meal.cookingTime;
            }
          });
        });
      }
    });
    
    return { totalMeals, totalCalories, totalIngredients, totalCookingTime };
  };
  
  const weeklyStats = getWeeklyStats();
  
  // Navigate weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };
  
  // Export shopping list
  const exportShoppingList = () => {
    const listText = shoppingList.map(item => `• ${item.item}`).join('\n');
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Shopping list exported!', 'success');
  };
  
  if (!user) {
    return (
      <div className={`${styles.mealPlannerPage} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className="container">
          <div className={styles.authRequired}>
            <h2>Please log in to access your meal planner</h2>
            <p>Create an account or sign in to start planning your weekly meals.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${styles.mealPlannerPage} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              <FaCalendarAlt className={styles.titleIcon} />
              Meal Planner
            </h1>
            <p className={styles.subtitle}>Plan your weekly meals and organize your cooking schedule</p>
          </div>
          
          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <FaUtensils className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{weeklyStats.totalMeals}</span>
                <span className={styles.statLabel}>Meals Planned</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaFire className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{weeklyStats.totalCalories.toLocaleString()}</span>
                <span className={styles.statLabel}>Total Calories</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaShoppingCart className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{weeklyStats.totalIngredients}</span>
                <span className={styles.statLabel}>Ingredients</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <FaClock className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{weeklyStats.totalCookingTime}m</span>
                <span className={styles.statLabel}>Cooking Time</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'planner' ? styles.active : ''}`}
            onClick={() => setActiveTab('planner')}
          >
            <FaCalendarAlt /> Weekly Planner
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'nutrition' ? styles.active : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <FaFire /> Nutrition Overview
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'shopping' ? styles.active : ''}`}
            onClick={() => setActiveTab('shopping')}
          >
            <FaShoppingCart /> Shopping List
          </button>
        </div>
        
        {/* Weekly Planner Tab */}
        {activeTab === 'planner' && (
          <div className={styles.plannerContent}>
            {/* Week Navigation */}
            <div className={styles.weekNavigation}>
              <button 
                className={styles.navButton}
                onClick={() => navigateWeek(-1)}
              >
                ← Previous Week
              </button>
              <h2 className={styles.weekTitle}>
                {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
                {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <button 
                className={styles.navButton}
                onClick={() => navigateWeek(1)}
              >
                Next Week →
              </button>
            </div>
            
            {/* Meal Planning Grid */}
            <div className={styles.mealGrid}>
              <div className={styles.gridHeader}>
                <div className={styles.mealTypeHeader}>Meal Type</div>
                {daysOfWeek.map((day, index) => (
                  <div key={day} className={styles.dayHeader}>
                    <span className={styles.dayName}>{day}</span>
                    <span className={styles.dayDate}>
                      {weekDates[index].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={styles.dayCalories}>
                      {getDailyCalories(weekDates[index])} kcal
                    </span>
                  </div>
                ))}
              </div>
              
              {mealTypes.map(mealType => (
                <div key={mealType} className={styles.mealRow}>
                  <div className={styles.mealTypeLabel}>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </div>
                  {weekDates.map(date => {
                    const dateKey = date.toISOString().split('T')[0];
                    const meals = mealPlan[dateKey]?.[mealType] || [];
                    
                    return (
                      <div key={`${dateKey}-${mealType}`} className={styles.mealSlot}>
                        {meals.map(meal => (
                          <div key={meal.id} className={styles.mealCard}>
                            <img src={meal.image} alt={meal.title} className={styles.mealImage} />
                            <div className={styles.mealInfo}>
                              <h4 className={styles.mealTitle}>{meal.title}</h4>
                              <div className={styles.mealMeta}>
                                <span><FaClock /> {meal.cookingTime}m</span>
                                <span><FaFire /> {meal.nutrition?.kcal || 0} kcal</span>
                              </div>
                            </div>
                            <button 
                              className={styles.removeMealBtn}
                              onClick={() => removeMealFromPlan(date, mealType, meal.id)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                        <button 
                          className={styles.addMealBtn}
                          onClick={() => {
                            setSelectedMealSlot({ date, mealType });
                            setShowRecipeModal(true);
                          }}
                        >
                          <FaPlus /> Add Meal
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Nutrition Overview Tab */}
        {activeTab === 'nutrition' && (
          <div className={styles.nutritionContent}>
            <h2>Weekly Nutrition Overview</h2>
            <div className={styles.nutritionGrid}>
              {weekDates.map(date => {
                const calories = getDailyCalories(date);
                const dateKey = date.toISOString().split('T')[0];
                const dayMeals = mealPlan[dateKey];
                
                return (
                  <div key={dateKey} className={styles.nutritionCard}>
                    <h3>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                    <div className={styles.calorieProgress}>
                      <div className={styles.calorieNumber}>{calories} kcal</div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${Math.min((calories / 2000) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className={styles.calorieTarget}>Target: 2000 kcal</div>
                    </div>
                    
                    {dayMeals && (
                      <div className={styles.mealBreakdown}>
                        {Object.entries(dayMeals).map(([mealType, meals]) => {
                          const mealCalories = meals.reduce((sum, meal) => 
                            sum + (meal.nutrition?.kcal || 0), 0
                          );
                          return (
                            <div key={mealType} className={styles.mealTypeCalories}>
                              <span>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                              <span>{mealCalories} kcal</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Shopping List Tab */}
        {activeTab === 'shopping' && (
          <div className={styles.shoppingContent}>
            <div className={styles.shoppingHeader}>
              <h2>Shopping List</h2>
              <div className={styles.shoppingActions}>
                <button className={styles.exportBtn} onClick={exportShoppingList}>
                  <FaDownload /> Export List
                </button>
              </div>
            </div>
            
            {shoppingList.length > 0 ? (
              <div className={styles.shoppingList}>
                {shoppingList.map((item, index) => (
                  <div key={index} className={styles.shoppingItem}>
                    <span className={styles.itemName}>{item.item}</span>
                    <span className={styles.itemAmount}>{item.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyShoppingList}>
                <FaShoppingCart className={styles.emptyIcon} />
                <h3>No ingredients yet</h3>
                <p>Add meals to your weekly plan to generate a shopping list.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Recipe Selection Modal */}
        {showRecipeModal && (
          <div className={styles.modalOverlay} onClick={() => setShowRecipeModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Select a Recipe</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowRecipeModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Search and Filter */}
              <div className={styles.modalFilters}>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input 
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.categoryFilter}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Recipe List */}
              <div className={styles.recipeList}>
                {filteredRecipes.map(recipe => (
                  <div 
                    key={recipe.id} 
                    className={styles.recipeItem}
                    onClick={() => addMealToPlan(recipe)}
                  >
                    <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                    <div className={styles.recipeInfo}>
                      <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                      <div className={styles.recipeMeta}>
                        <span><FaClock /> {recipe.cookingTime}m</span>
                        <span><FaUsers /> {recipe.servings} servings</span>
                        <span><FaStar /> {recipe.rating}</span>
                        <span><FaFire /> {recipe.nutrition?.kcal || 0} kcal</span>
                      </div>
                      <div className={styles.recipeTags}>
                        {recipe.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.recipeTag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
