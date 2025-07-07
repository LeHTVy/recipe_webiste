import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNumberCycler } from '../../hooks/useNumberCycler';
import { cn } from '../../lib/utils';
import TiltedCard from '../TiltedCard/TiltedCard';
import styles from './FeatureCarousel.module.css';

const defaultClasses = {
  step1img1: "pointer-events-none w-[50%] border border-stone-100/10 transition-all duration-500 dark:border-stone-700/50 rounded-[24px] left-[25%] top-[57%]",
  step1img2: "pointer-events-none w-[60%] border border-stone-100/10 dark:border-stone-700/50 transition-all duration-500 overflow-hidden rounded-2xl left-[69%] top-[53%]",
  step2img1: "pointer-events-none w-[50%] rounded-t-[24px] overflow-hidden border border-stone-100/10 transition-all duration-500 dark:border-stone-700 left-[25%] top-[69%]",
  step2img2: "pointer-events-none w-[40%] border border-stone-100/10 dark:border-stone-700 transition-all duration-500 rounded-2xl overflow-hidden left-[70%] top-[53%]",
  step3img: "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden left-[5%] top-[50%]",
  step4img: "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-2xl transition-all duration-500 overflow-hidden left-[5%] top-[50%]",
};

const FeatureCard = ({ 
  children, 
  className, 
  bgClass = "bg-gradient-to-tr from-neutral-900/90 to-neutral-800/90",
  ...props 
}) => {
  return (
    <motion.div
      className={cn(
        "group relative h-96 w-full cursor-pointer overflow-hidden rounded-2xl border border-stone-100/10 dark:border-stone-700/50",
        bgClass,
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export function FeatureCarousel({
  title = "Feature Showcase",
  description = "Explore our amazing features",
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  bgClass,
  autoPlay = true,
  autoPlayInterval = 3000,
  ...props
}) {
  const { currentNumber: step, increment } = useNumberCycler(4, 1);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        increment();
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, increment, isAnimating]);

  const handleIncrement = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    increment();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getImageForStep = (step) => {
    switch (step) {
      case 1:
        return [
          { src: image.step1light1, className: step1img1Class, key: "step1img1" },
          { src: image.step1light2, className: step1img2Class, key: "step1img2" }
        ];
      case 2:
        return [
          { src: image.step2light1, className: step2img1Class, key: "step2img1" },
          { src: image.step2light2, className: step2img2Class, key: "step2img2" }
        ];
      case 3:
        return [
          { src: image.step3light, className: step3imgClass, key: "step3img" }
        ];
      case 4:
        return [
          { src: image.step4light, className: step4imgClass, key: "step4img" }
        ];
      default:
        return [];
    }
  };

  const images = getImageForStep(step);

  return (
    <div className={styles.featureCarouselContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Progress Indicators */}
      <div className={styles.progressContainer}>
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className={styles.progressItem}>
            <div 
              className={cn(
                styles.progressIndicator,
                step >= stepNumber ? styles.active : styles.inactive
              )}
            >
              {step > stepNumber ? '✓' : stepNumber}
            </div>
            <span className={styles.stepLabel}>Step {stepNumber}</span>
          </div>
        ))}
      </div>

      {/* Feature Card với TiltedCard wrapper */}
      <TiltedCard
        maxTilt={12}
        perspective={1000}
        scale={1.05}
        speed={400}
        glareEnable={true}
        glareMaxOpacity={0.4}
        className={styles.tiltWrapper}
      >
        <FeatureCard
          className={styles.featureCard}
          bgClass={bgClass}
          onClick={handleIncrement}
          {...props}
        >
          {images.map(({ src, className, key }) => (
            <motion.img
              key={key}
              src={src}
              alt={image.alt || `Feature step ${step}`}
              className={cn("absolute", className)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          ))}
          
          {/* Click Indicator */}
          <div className={styles.clickIndicator}>
            <span>Click to continue</span>
          </div>
        </FeatureCard>
      </TiltedCard>
    </div>
  );
}
