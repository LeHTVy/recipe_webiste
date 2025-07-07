import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const FavoritesContext = createContext();

export { FavoritesContext };

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showFavoriteAdded } = useNotification();
  const [favorites, setFavorites] = useState([]);
  const getFavoritesKey = useCallback(() => {
    return user ? `favorites_${user.id || user.username}` : 'favorites_guest';
  }, [user]);

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

  useEffect(() => {
    const handleFavoritesReordered = (event) => {
      if (event.detail && event.detail.favorites) {
        setFavorites(event.detail.favorites);
      }
    };

    window.addEventListener('favoritesReordered', handleFavoritesReordered);
    
    return () => {
      window.removeEventListener('favoritesReordered', handleFavoritesReordered);
    };
  }, []);

  const saveFavoritesToStorage = (updatedFavorites) => {
    if (isAuthenticated && user) {
      const favoritesKey = getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    }
  };
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
      // Show notification when recipe is added to favorites
      showFavoriteAdded(recipe.title || recipe.name || 'Recipe');
      return true;
    }
    return false;
  };

  const removeFromFavorites = (recipeId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

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
      const success = addToFavorites(recipe);
      return success;
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

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
