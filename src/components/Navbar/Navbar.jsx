// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { 
  FaUser, 
  FaPlus, 
  FaSignOutAlt,
  FaChevronDown 
} from 'react-icons/fa';
import styles from './Navbar.module.css';

// Import logo GIFs
import logoLight from '../../assets/logo/logo-light.png';
import logoDark from '../../assets/logo/logo-dark.png';

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo - Clickable to home */}
          <div 
            className={styles.logo} 
            onClick={() => handleNavigation('/')}
            role="button"
            tabIndex={0}
          >
            <img 
              src={isDarkMode ? logoDark : logoLight}
              alt="TasteMate Logo"
              className={styles.logoGif}
            />
            <span className={styles.logoText}>TasteMate</span>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            <button 
              onClick={() => handleNavigation('/')}
              className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/recipes')}
              className={`${styles.navLink} ${isActive('/recipes') ? styles.active : ''}`}
            >
              Recipes
            </button>
            <button 
              onClick={() => handleNavigation('/favorites')}
              className={`${styles.navLink} ${isActive('/favorites') ? styles.active : ''}`}
            >
              Favorites
            </button>
            {!isAuthenticated && (
              <button 
                onClick={() => handleNavigation('/auth')}
                className={`${styles.loginBtn} ${isActive('/auth') ? styles.active : ''}`}
              >
                Login
              </button>
            )}
          </div>

          {/* Theme Toggle and Profile */}
          <div className={styles.navActions}>
            <ThemeToggle />
            
            {isAuthenticated && (
              <div className={styles.profileSection}>
                <button 
                  className={styles.profileBtn}
                  onClick={handleProfileClick}
                >
                  <img 
                    src={user.profilePicture} 
                    alt={user.username}
                    className={styles.profileAvatar}
                  />
                  <span className={styles.profileName}>{user.firstName}</span>
                  <FaChevronDown className={`${styles.chevronIcon} ${isProfileMenuOpen ? styles.rotated : ''}`} />
                </button>
                
                {isProfileMenuOpen && (
                  <div className={styles.profileMenu}>
                    <div className={styles.profileMenuHeader}>
                      <img 
                        src={user.profilePicture} 
                        alt={user.username}
                        className={styles.menuAvatar}
                      />
                      <div>
                        <p className={styles.menuUserName}>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className={styles.menuUsername}>@{user.username}</p>
                      </div>
                    </div>
                    
                    {/* Profile Menu Actions với React Icons */}
                    <div className={styles.profileMenuActions}>
                      <button
                        onClick={() => {
                          handleNavigation("/profile");
                          setIsProfileMenuOpen(false);
                        }}
                        className={styles.menuAction}
                      >
                        <FaUser className={styles.menuActionIcon} />
                        <span className={styles.menuActionText}>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavigation("/create-recipe");
                          setIsProfileMenuOpen(false);
                        }}
                        className={styles.menuAction}
                      >
                        <FaPlus className={styles.menuActionIcon} />
                        <span className={styles.menuActionText}>Create Recipe</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`${styles.menuAction} ${styles.logoutAction}`}
                      >
                        <FaSignOutAlt className={styles.menuActionIcon} />
                        <span className={styles.menuActionText}>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className={styles.mobileMenuBtn}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileNav}>
            <button 
              onClick={() => handleNavigation('/')}
              className={`${styles.mobileNavLink} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/recipes')}
              className={`${styles.mobileNavLink} ${isActive('/recipes') ? styles.active : ''}`}
            >
              Recipes
            </button>
            <button 
              onClick={() => handleNavigation('/favorites')}
              className={`${styles.mobileNavLink} ${isActive('/favorites') ? styles.active : ''}`}
            >
              Favorites
            </button>
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className={`${styles.mobileNavLink} ${isActive('/profile') ? styles.active : ''}`}
                >
                  <FaUser className={styles.mobileNavIcon} />
                  Profile
                </button>
                <button 
                  onClick={() => handleNavigation('/create-recipe')}
                  className={styles.mobileNavLink}
                >
                  <FaPlus className={styles.mobileNavIcon} />
                  Create Recipe
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`${styles.mobileNavLink} ${styles.logoutMobile}`}
                >
                  <FaSignOutAlt className={styles.mobileNavIcon} />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleNavigation('/auth')}
                className={`${styles.mobileNavLink} ${isActive('/auth') ? styles.active : ''}`}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
