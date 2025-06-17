import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import useDragAndDrop from "../../hooks/useDragAndDrop";
import {
  FaPlus,
  FaTimes,
  FaImage,
  FaClock,
  FaUsers,
  FaTag,
  FaSave,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import styles from "./CreateRecipe.module.css";

const CreateRecipe = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showUpdateSuccess, showError } = useNotification();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const editRecipeId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    foodType: "",
    category: "",
    cookingTime: "",
    servings: "",
    difficulty: "Easy",
    tags: [],
    specialDescription: "",
    ingredients: [{ item: "", amount: "", name: "", category: "" }],
    instructions: [{ step: 1, title: "", description: "", time: "" }],
    nutrition: {
      kcal: "",
      fat: "",
      saturates: "",
      carbs: "",
      sugars: "",
      fibre: "",
      protein: "",
      salt: "",
    },
    status: "draft", // draft or published
  });

  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag and drop for ingredients
  const { getDragProps: getIngredientDragProps } = useDragAndDrop(
    formData.ingredients,
    (reorderedIngredients) => {
      setFormData(prev => ({
        ...prev,
        ingredients: reorderedIngredients
      }));
    }
  );

  const foodTypes = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Beverage",
  ];
  const categories = [
    "Appetizer",
    "Main Course",
    "Side Dish",
    "Dessert",
    "Soup",
    "Salad",
    "Beverage",
    "Sauce",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "High-Protein",
  ];

  // Load recipe data when editing
  useEffect(() => {
    if (editRecipeId) {
      const existingRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
      const recipeToEdit = existingRecipes.find(recipe => recipe.id === parseInt(editRecipeId));
      
      if (recipeToEdit) {
        // Map the existing recipe data to form structure
        setFormData({
          title: recipeToEdit.title || "",
          description: recipeToEdit.description || "",
          images: recipeToEdit.images || [],
          foodType: recipeToEdit.foodType || "",
          category: recipeToEdit.category || "",
          cookingTime: recipeToEdit.cookingTime || "",
          servings: recipeToEdit.servings || "",
          difficulty: recipeToEdit.difficulty || "Easy",
          tags: recipeToEdit.tags || [],
          specialDescription: recipeToEdit.specialDescription || "",
          ingredients: recipeToEdit.detailedIngredients?.length > 0 
            ? recipeToEdit.detailedIngredients.map(ing => ({
                item: `${ing.amount} ${ing.name}`.trim(),
                amount: ing.amount || "",
                name: ing.name || "",
                category: ing.category || ""
              }))
            : recipeToEdit.ingredients?.length > 0
            ? recipeToEdit.ingredients
            : [{ item: "", amount: "", name: "", category: "" }],
          instructions: recipeToEdit.instructions?.length > 0 
            ? recipeToEdit.instructions 
            : [{ step: 1, title: "", description: "", time: "" }],
          nutrition: recipeToEdit.nutrition || {
            kcal: "",
            fat: "",
            saturates: "",
            carbs: "",
            sugars: "",
            fibre: "",
            protein: "",
            salt: "",
          },
          status: recipeToEdit.status || "draft",
        });
        
        // Set image previews if images exist
        if (recipeToEdit.images && recipeToEdit.images.length > 0) {
          setImagePreview(recipeToEdit.images);
        }
      }
    }
  }, [editRecipeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("nutrition.")) {
      const nutritionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];
    let processedFiles = 0;

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          newImages.push(base64Image);
          newPreviews.push(base64Image);
          processedFiles++;

          if (processedFiles === files.length) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...newImages],
            }));
            setImagePreview((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedFiles++;
      }
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { item: "", amount: "", name: "", category: "" },
      ],
    }));
  };

  const updateIngredient = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        {
          step: prev.instructions.length + 1,
          title: "",
          description: "",
          time: "",
        },
      ],
    }));
  };

  const updateInstruction = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      ),
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions
          .filter((_, i) => i !== index)
          .map((inst, i) => ({ ...inst, step: i + 1 })),
      }));
    }
  };

  const generateRecipeId = () => {
    const existingRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    return existingRecipes.length > 0
      ? Math.max(...existingRecipes.map((r) => r.id)) + 1
      : 1001;
  };

  const saveRecipe = (status) => {
    setIsSubmitting(true);
    
    try {
      const existingRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
      
      if (editRecipeId) {
        // Update existing recipe
        const recipeIndex = existingRecipes.findIndex(recipe => recipe.id === parseInt(editRecipeId));
        if (recipeIndex !== -1) {
          const existingRecipe = existingRecipes[recipeIndex];
          const updatedRecipe = {
            ...existingRecipe,
            ...formData,
            image:
              formData.images && formData.images.length > 0
                ? formData.images[0]
                : existingRecipe.image || "https://via.placeholder.com/400x300?text=No+Image",
            images:
              formData.images && formData.images.length > 0
                ? formData.images
                : existingRecipe.images || ["https://via.placeholder.com/400x300?text=No+Image"],
            detailedIngredients: formData.ingredients.map((ing) => ({
              amount: ing.amount,
              name: ing.name,
              category: ing.category || "Main Ingredients",
            })),
            status,
            updatedAt: new Date().toISOString(),
          };
          
          existingRecipes[recipeIndex] = updatedRecipe;
          localStorage.setItem("recipes", JSON.stringify(existingRecipes));
        }
      } else {
        // Create new recipe
        const recipeData = {
          id: generateRecipeId(),
          ...formData,
          image:
            formData.images && formData.images.length > 0
              ? formData.images[0]
              : "https://via.placeholder.com/400x300?text=No+Image",
          images:
            formData.images && formData.images.length > 0
              ? formData.images
              : ["https://via.placeholder.com/400x300?text=No+Image"],
          detailedIngredients: formData.ingredients.map((ing) => ({
            amount: ing.amount,
            name: ing.name,
            category: ing.category || "Main Ingredients",
          })),
          status,
          createdBy: user?.id,
          rating: 0,
          totalRatings: 0,
          commentCount: 0,
          topRate: 0,
          popularityScore: 0,
          isPopular: false,
          isTopRated: false,
          author: {
            name: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
            avatar:
              user?.profilePicture ||
              `https://ui-avatars.com/api/?name=${
                user ? `${user.firstName}+${user.lastName}` : "User"
              }&background=00bf63&color=fff`,
            bio: user?.bio || "Recipe creator",
          },
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedRecipes = [...existingRecipes, recipeData];
        localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      }

      // Show success notifications
      if (editRecipeId) {
        if (status === "published") {
          showUpdateSuccess("Recipe updated and published successfully!");
        } else {
          showUpdateSuccess("Recipe updated successfully!");
        }
      } else {
        if (status === "published") {
          showSuccess("Recipe published successfully!");
        } else {
          showSuccess("Recipe saved as draft!");
        }
      }

      navigate("/profile");
    } catch (error) {
      console.error('Error saving recipe:', error);
      
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        showError('Storage quota exceeded. Please try reducing image sizes or clear some data.');
      } else {
        showError('Failed to save recipe. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveRecipe("published");
  };

  const saveDraft = () => {
    saveRecipe("draft");
  };

  return (
    <div
      className={`${styles.createRecipeContainer} ${
        isDarkMode ? styles.dark : styles.light
      }`}
    >
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <div className={styles.brandInfo}>
              <div className={styles.brandLogo}>TASTEMATE</div>
            </div>
            <div className={styles.titleSection}>
              <h1 className={styles.pageTitle}>
                <span className={styles.titleCreate}>{editRecipeId ? "EDIT" : "CREATE"}</span>
                <span className={styles.titleRecipe}>RECIPE</span>
              </h1>
              <p className={styles.subtitle}></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.contentSection}>
          <form onSubmit={handleSubmit} className={styles.recipeForm}>
            <div className={styles.leftColumn}>
              {/* Basic Information */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Basic Information</h2>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Recipe Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter a catchy recipe title"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Describe your recipe in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Special Description</label>
                  <textarea
                    name="specialDescription"
                    value={formData.specialDescription}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Add any special notes, dietary information, or unique aspects of your recipe..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className={styles.rightColumn}>
              {/* Images */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recipe Images</h2>

                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className={styles.hiddenInput}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadBtn}
                  >
                    <FaImage /> Add Images
                  </button>

                  <div className={styles.imagePreview}>
                    {imagePreview.map((image, index) => (
                      <div key={index} className={styles.imageItem}>
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className={styles.removeImageBtn}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Details - Full Width */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h2 className={styles.sectionTitle}>Recipe Details</h2>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Food Type *</label>
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select food type</option>
                    {foodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaClock /> Cooking Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaUsers /> Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="4"
                    min="1"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags - Full Width */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h2 className={styles.sectionTitle}>Tags</h2>

              <div className={styles.tagInput}>
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className={styles.input}
                  placeholder="Add tags (press Enter to add)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={styles.addTagBtn}
                >
                  <FaPlus />
                </button>
              </div>

              <div className={styles.dietaryTags}>
                <p className={styles.tagLabel}>Quick add dietary tags:</p>
                <div className={styles.dietaryOptions}>
                  {dietaryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(option)) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, option],
                          }));
                        }
                      }}
                      className={`${styles.dietaryTag} ${
                        formData.tags.includes(option) ? styles.active : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.tagList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    <FaTag /> {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className={styles.removeTagBtn}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Ingredients - Full Width */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>

              {formData.ingredients.map((ingredient, index) => (
                <div 
                  key={index} 
                  className={`${styles.ingredientRow} ${styles.draggable}`}
                  {...getIngredientDragProps(index)}
                >
                  <div className={styles.dragHandle}>⋮⋮</div>
                  <input
                    type="text"
                    placeholder="Category (e.g., Sauce, Broth, Spices)"
                    value={ingredient.category}
                    onChange={(e) =>
                      updateIngredient(index, "category", e.target.value)
                    }
                    className={styles.ingredientInput}
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g., 200g, 2 cups)"
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(index, "amount", e.target.value)
                    }
                    className={styles.ingredientInput}
                  />
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => {
                      updateIngredient(index, "name", e.target.value);
                      updateIngredient(
                        index,
                        "item",
                        `${ingredient.amount} ${e.target.value}`.trim()
                      );
                    }}
                    className={styles.ingredientInput}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className={styles.removeBtn}
                    disabled={formData.ingredients.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addIngredient}
                className={styles.addBtn}
              >
                <FaPlus /> Add Ingredient
              </button>
            </div>

            {/* Instructions - Full Width */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h2 className={styles.sectionTitle}>Cooking Instructions</h2>

              {formData.instructions.map((instruction, index) => (
                <div key={index} className={styles.instructionItem}>
                  <div className={styles.stepNumber}>
                    Step {instruction.step}
                  </div>
                  <div className={styles.instructionContent}>
                    <input
                      type="text"
                      placeholder="Step title"
                      value={instruction.title}
                      onChange={(e) =>
                        updateInstruction(index, "title", e.target.value)
                      }
                      className={styles.input}
                    />
                    <textarea
                      placeholder="Detailed instructions for this step"
                      value={instruction.description}
                      onChange={(e) =>
                        updateInstruction(index, "description", e.target.value)
                      }
                      className={styles.textarea}
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g., 5 minutes)"
                      value={instruction.time}
                      onChange={(e) =>
                        updateInstruction(index, "time", e.target.value)
                      }
                      className={styles.timeInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className={styles.removeBtn}
                    disabled={formData.instructions.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addInstruction}
                className={styles.addBtn}
              >
                <FaPlus /> Add Step
              </button>
            </div>

            {/* Nutrition Information - Full Width */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h2 className={styles.sectionTitle}>
                Nutrition Information (Optional)
              </h2>

              <div className={styles.nutritionGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Fat</label>
                  <input
                    type="text"
                    name="nutrition.fat"
                    value={formData.nutrition.fat}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="28g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Saturates</label>
                  <input
                    type="text"
                    name="nutrition.saturates"
                    value={formData.nutrition.saturates}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="17g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Carbs</label>
                  <input
                    type="text"
                    name="nutrition.carbs"
                    value={formData.nutrition.carbs}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="65g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Sugars</label>
                  <input
                    type="text"
                    name="nutrition.sugars"
                    value={formData.nutrition.sugars}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="58g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Fibre</label>
                  <input
                    type="text"
                    name="nutrition.fibre"
                    value={formData.nutrition.fibre}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="4g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Protein</label>
                  <input
                    type="text"
                    name="nutrition.protein"
                    value={formData.nutrition.protein}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="8g"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Salt</label>
                  <input
                    type="text"
                    name="nutrition.salt"
                    value={formData.nutrition.salt}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="0.2g"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Full Width */}
            <div className={`${styles.actionButtons} ${styles.fullWidth}`}>
              <button
                type="button"
                onClick={saveDraft}
                className={`${styles.btn} ${styles.draftBtn}`}
                disabled={isSubmitting}
              >
                <FaSave /> Save as Draft
              </button>

              <button
                type="submit"
                className={`${styles.btn} ${styles.publishBtn}`}
                disabled={isSubmitting}
              >
                <FaEye /> Publish Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
