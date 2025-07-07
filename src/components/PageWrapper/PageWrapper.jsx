import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, staggerContainer, staggerItem } from '../../hooks/useScrollAnimation';
import styles from './PageWrapper.module.css';

const PageWrapper = ({ children, className = '', enableStagger = true }) => {
  const { ref, controls } = useScrollAnimation(0.1, false);

  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: enableStagger ? 0.1 : 0
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={enableStagger ? staggerContainer : pageVariants}
      className={`${styles.pageWrapper} ${className}`}
    >
      {enableStagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className={styles.staggerItem}
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
};

export default PageWrapper;