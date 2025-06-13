// src/context/FavoritesContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Get localStorage key for specific user
  const getFavoritesKey = useCallback(() => {
    return user ? `favorites_${user.id || user.username}` : 'favorites_guest';
  }, [user]);

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const favoritesKey = getFavoritesKey();
      const storedFavorites = localStorage.getItem(favoritesKey);
      
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user, isAuthenticated, getFavoritesKey]);

  // Save favorites to localStorage
  const saveFavoritesToStorage = (updatedFavorites) => {
    if (isAuthenticated && user) {
      const favoritesKey = getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    }
  };

  // Add recipe to favorites
  const addToFavorites = (recipe) => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return false;
    }

    const isAlreadyFavorite = favorites.some(fav => fav.id === recipe.id);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, recipe];
      setFavorites(updatedFavorites);
      saveFavoritesToStorage(updatedFavorites);
      return true;
    }
    return false;
  };

  // Remove recipe from favorites
  const removeFromFavorites = (recipeId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  // Toggle favorite status
  const toggleFavorite = (recipe) => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return false;
    }

    const isCurrentlyFavorite = isFavorite(recipe.id);
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(recipe.id);
      return false;
    } else {
      addToFavorites(recipe);
      return true;
    }
  };

  // Check if recipe is favorite
  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  // Get favorites count
  const getFavoritesCount = () => {
    return favorites.length;
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    if (isAuthenticated && user) {
      const favoritesKey = getFavoritesKey();
      localStorage.removeItem(favoritesKey);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
