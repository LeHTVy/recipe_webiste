// src/components/TiltedCard/TiltedCard.jsx
import React, { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './TiltedCard.module.css';

const TiltedCard = ({ 
  children, 
  className = '', 
  maxTilt = 15,
  perspective = 1000,
  scale = 1.05,
  speed = 300,
  glareEnable = true,
  glareMaxOpacity = 0.7,
  glareColor = '#ffffff',
  glarePosition = 'bottom',
  gyroscope = true,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    
    setTilt({ x: -rotateX, y: rotateY });
    
    if (glareEnable) {
      const glareX = (e.clientX - rect.left) / rect.width * 100;
      const glareY = (e.clientY - rect.top) / rect.height * 100;
      setGlare({ 
        x: glareX, 
        y: glareY, 
        opacity: glareMaxOpacity 
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const cardStyle = {
    transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovering ? scale : 1})`,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
  };

  const glareStyle = glareEnable ? {
    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glareColor} 0%, transparent 50%)`,
    opacity: glare.opacity,
    transition: `opacity ${speed}ms ease`,
  } : {};

  return (
    <div 
      ref={ref}
      className={`${styles.tiltedCard} ${isDarkMode ? styles.darkMode : styles.lightMode} ${className}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      {glareEnable && (
        <div 
          className={styles.glare}
          style={glareStyle}
        />
      )}
    </div>
  );
};

export default TiltedCard;
