// src/components/Hero/Hero.jsx - Cập nhật với Aurora effect
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import TasteMateAurora from '../Aurora/Aurora';
import styles from './Hero.module.css';

// Import GIF files
import heroGifLight from '../../assets/hero/hero-light.gif';
import heroGifDark from '../../assets/hero/hero-dark.gif';

const Hero = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className={styles.hero}>
      {/* Aurora Background Effect */}
      <TasteMateAurora 
        className={styles.auroraBackground}
        amplitude={1.5}
        blend={0.7}
        speed={0.6}
        intensity={0.8}
      />
      
      <div className="container">
        <div className={styles.heroContent}>
          {/* Left side - Text content */}
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Find your
              <br />
              <span className={styles.highlightText}>perfect recipe</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Looking for something new? Explore our library
              <br />
              of food recipes and get inspired!
            </p>
            <button className={styles.exploreBtn}>
              Explore recipes →
            </button>
          </div>
          
          {/* Right side - Hero GIF with Aurora */}
          <div className={styles.heroImage}>
            <div className={styles.gifContainer}>
              {/* Aurora effect for GIF container */}
              <TasteMateAurora 
                className={styles.auroraCard}
                amplitude={1.0}
                blend={0.5}
                speed={0.4}
                intensity={0.6}
              />
              
              <img 
                src={isDarkMode ? heroGifDark : heroGifLight}
                alt="TasteMate Hero Animation"
                className={styles.heroGif}
              />

              {/* Slogan in GIF */}
               <div className={styles.gifOverlay}>
                <div className={styles.overlayContent}>
                  <h3 className={`${styles.overlayTitle} ${isDarkMode ? styles.darkAccent : styles.lightAccent}`}>
                    Share your flavor
                  </h3>
                  <p className={styles.overlaySubtitle}>
                    Build your community
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
