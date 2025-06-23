import { useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import Recipes from "./pages/Recipes/Recipes";
import RecipeDetails from "./pages/RecipeDetails/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe/CreateRecipe";
import { FavoritesProvider } from "./context/FavoritesContext";
import { NotificationProvider } from "./context/NotificationContext";
import Favorites from "./pages/Favorites/Favorites";
import Community from "./pages/Community/Community";
import CreatePost from "./pages/CreatePost/CreatePost";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import AuthorProfile from "./pages/AuthorProfile/AuthorProfile";
import ConfirmationModal from "./components/ConfirmationModal/ConfirmationModal";
import { useState, createContext, useContext } from "react";
import { mockRecipes } from "./data/mockData";
import "./App.css";

// Global Modal Context
const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const openModal = (config) => {
    setModalState({
      isOpen: true,
      type: config.type || 'warning',
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: config.onConfirm || (() => {}),
      onCancel: config.onCancel || (() => {})
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };
  

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isModalOpen: modalState.isOpen }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => {
          closeModal();
          modalState.onCancel();
        }}
        onConfirm={() => {
          modalState.onConfirm();
          closeModal();
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </ModalContext.Provider>
  );
};

const initializeMockData = () => {
  try {
    console.log('Initializing mock data...');
    
    // Kiểm tra xem mock recipes đã có trong localStorage chưa
    const existingRecipes = localStorage.getItem('tastemate_recipes');
    const recipes = existingRecipes ? JSON.parse(existingRecipes) : [];
    
    console.log('Current recipes in localStorage:', recipes.length);
    console.log('Mock recipes to load:', mockRecipes.length);
    
    // Nếu chưa có recipes hoặc số lượng ít hơn mock data
    if (recipes.length === 0 || recipes.length < mockRecipes.length) {
      // Merge existing recipes với mock recipes, tránh duplicate
      const allRecipes = [...recipes];
      
      mockRecipes.forEach(mockRecipe => {
        // Chỉ thêm nếu chưa tồn tại
        if (!allRecipes.some(recipe => recipe.id === mockRecipe.id)) {
          allRecipes.push(mockRecipe);
        }
      });
      
      localStorage.setItem('tastemate_recipes', JSON.stringify(allRecipes));
      console.log('Mock recipes loaded into localStorage. Total recipes:', allRecipes.length);
    } else {
      console.log('Mock recipes already exist in localStorage');
    }
    
    // Verify data loaded correctly
    const verifyRecipes = JSON.parse(localStorage.getItem('tastemate_recipes') || '[]');
    console.log('Verification - recipes in localStorage:', verifyRecipes.length);
    
    // Log some sample authors for debugging
    const authors = verifyRecipes.map(r => r.author?.id).filter(Boolean);
    console.log('Available authors:', authors.slice(0, 5)); // Show first 5
    
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

const AppContent = () => {
  const { isModalOpen } = useModal();
  useEffect(() => {
    console.log('App started, loading mock data...');
    initializeMockData();
  }, []);
  return (
    <Router>
      <div className={`App ${isModalOpen ? 'modal-open' : ''}`}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/community" element={<Community />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/mealplanner" element={<MealPlanner />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/author/:authorId" element={<AuthorProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <ModalProvider>
              <AppContent />
            </ModalProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
