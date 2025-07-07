import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUp } from '../../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  variant = fadeInUp, 
  delay = 0, 
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  as = 'div'
}) => {
  const { ref, controls } = useScrollAnimation(threshold, triggerOnce);
  
  const animationVariant = {
    ...variant,
    visible: {
      ...variant.visible,
      transition: {
        ...variant.visible.transition,
        delay
      }
    }
  };

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariant}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedSection;