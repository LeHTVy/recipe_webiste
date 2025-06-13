// src/App.jsx
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
import { FavoritesProvider } from "./context/FavoritesContext";
import Favorites from "./pages/Favorites/Favorites";
import Community from "./pages/Community/Community";
import MealPlanner from "./pages/MealPlanner/MealPlanner";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipes/:id" element={<RecipeDetails />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/mealplanner" element={<MealPlanner />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
