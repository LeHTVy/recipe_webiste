// src/pages/Home/Home.jsx - Cập nhật để thêm Popular Recipes Carousel
import React, { useState, useEffect } from "react";
import Hero from "../../components/Hero/Hero";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import RecipeTagsCarousel from "../../components/RecipeTagsCarousel/RecipeTagsCarousel";
import PopularRecipesCarousel from "../../components/PopularRecipesCarousel/PopularRecipesCarousel";
import { mockRecipes, getRecipesByTag } from "../../data/mockData";
import styles from "./Home.module.css";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const sortedRecipes = [...mockRecipes].sort(
          (a, b) => b.rating - a.rating
        );
        setRecipes(sortedRecipes);
        setFilteredRecipes(sortedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleTagSelect = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setFilteredRecipes(recipes);
    } else {
      setSelectedTag(tag);
      const tagged = getRecipesByTag(tag);
      setFilteredRecipes(tagged);
    }
  };

  return (
    <div className={styles.home}>
      <Hero />

      {/* Popular Recipes Carousel Section */}
      <section className={styles.popularSection}>
        <div className="container">
          <PopularRecipesCarousel selectedTag={selectedTag} />
        </div>
      </section>

      <section className={styles.recipesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {selectedTag
                ? `${selectedTag.replace("-", " ")} recipes`
                : "All recipes"}
            </h2>
            <p className={styles.sectionSubtitle}>
              {selectedTag
                ? `Discover all ${selectedTag.replace(
                    "-",
                    " "
                  )} recipes from our collection.`
                : "Explore our complete collection of delicious recipes."}
            </p>
          </div>

          {/* Recipe Tags Carousel */}
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
              <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                  <span className={styles.countNumber}>
                    {filteredRecipes.length}
                  </span>
                  recipe{filteredRecipes.length !== 1 ? "s" : ""} found
                </span>
                {selectedTag && (
                  <button
                    className={styles.clearFilter}
                    onClick={() => handleTagSelect(selectedTag)}
                    type="button"
                  >
                    Clear filter <span className={styles.clearIcon}>✕</span>
                  </button>
                )}
              </div>

              <div className={styles.recipesGrid}>
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3 className={styles.featureTitle}>Explore the latest</h3>
              <p className={styles.featureDescription}>
                Stay up to date and check out our recently added recipes. You
                won't regret.
              </p>
              <button className={styles.featureBtn}>See recipes</button>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Quick and easy</h3>
              <p className={styles.featureDescription}>
                Vegan recipes or low-carb diet? Here you find ideas for quick
                meals.
              </p>
              <button className={styles.featureBtn}>See recipes</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
