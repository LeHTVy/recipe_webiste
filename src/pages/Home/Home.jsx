import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import PageWrapper from '../../components/PageWrapper/PageWrapper';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../hooks/useScrollAnimation';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import RecipeTagsCarousel from '../../components/RecipeTagsCarousel/RecipeTagsCarousel';
import PopularRecipesCarousel from '../../components/PopularRecipesCarousel/PopularRecipesCarousel';
import { FeatureCarousel } from '../../components/FeatureCarousel/FeatureCarousel';
import { mockRecipes, getRecipesByTag } from '../../data/mockData';
import { FaSearch, FaBolt } from 'react-icons/fa';
import styles from './Home.module.css';

// Images for Feature Carousel
import worldFlavors from '../../assets/images/world-flavor.png';
import recipeSharing from '../../assets/images/recipe-sharing.png';
import communitySharing from '../../assets/images/community-sharing.png';
import shareyourFlavors from '../../assets/images/own_flavor.png';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const featureImages = {
    step1light1: worldFlavors,
    step1light2: recipeSharing, 
    
    step2light1: recipeSharing,
    step2light2: communitySharing, 
    
    step3light: communitySharing,
    
    step4light: shareyourFlavors,
    
    alt: "TasteMate Features Showcase"
  };

  const handleViewRecipe = () => {
    navigate('/recipes');
  };

  return (
    <PageWrapper className={styles.home}>
      <AnimatedSection variant={fadeInUp}>
        <Hero />
      </AnimatedSection>

      {/* Popular Recipes Carousel Section */}
      <AnimatedSection variant={fadeInLeft} delay={0.2}>
        <section className={styles.popularSection}>
          <div className="container">
            <PopularRecipesCarousel selectedTag={selectedTag} />
          </div>
        </section>
      </AnimatedSection>

      {/* Feature Carousel Section */}
      <AnimatedSection variant={fadeInRight} delay={0.4}>
        <section className={styles.featuresCarouselSection}>
          <div className="container">
            <FeatureCarousel
              title="Discover TasteMate Features"
              description="Explore our powerful features designed to enhance your cooking journey"
              image={featureImages}
              autoPlay={true}
              autoPlayInterval={4000}
              bgClass="bg-gradient-to-tr from-orange-500/10 to-green-500/10"
            />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection variant={fadeInUp} delay={0.6}>
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
                {filteredRecipes.slice(0, 6).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection variant={fadeInLeft} delay={0.8}>
        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FaSearch /></div>
                <h3 className={styles.featureTitle}>Explore the latest</h3>
                <p className={styles.featureDescription}>
                  Stay up to date and check out our recently added recipes. You
                  won't regret.
                </p>
                <button className={styles.featureBtn}>See recipes</button>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon} onClick={handleViewRecipe}><FaBolt /></div>
                <h3 className={styles.featureTitle}>Quick and easy</h3>
                <p className={styles.featureDescription}>
                  Vegan recipes or low-carb diet? Here you find ideas for quick
                  meals.
                </p>
                <button className={styles.featureBtn} onClick={handleViewRecipe}>See recipes</button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  );
};

export default Home;
