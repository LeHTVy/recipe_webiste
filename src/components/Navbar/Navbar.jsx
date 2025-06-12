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
  FaChevronDown,
  FaUsers,
  FaCalendarAlt
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
    <nav className={`${styles.navbar} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className="container">
        <div className={styles.navContent}>
          {/* Logo - Clickable to home */}
          <div
            onClick={() => handleNavigation('/')}
            className={styles.logo}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigation('/');
              }
            }}
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

            {/* Community và Meal Planner - Chỉ hiện khi đã login */}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => handleNavigation('/community')}
                  className={`${styles.navLink} ${styles.authenticatedLink} ${isActive('/community') ? styles.active : ''}`}
                >
                  Community
                </button>
                <button
                  onClick={() => handleNavigation('/meal-planner')}
                  className={`${styles.navLink} ${styles.authenticatedLink} ${isActive('/meal-planner') ? styles.active : ''}`}
                >
                  Meal Planner
                </button>
              </>
            )}

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
                  onClick={handleProfileClick}
                  className={styles.profileBtn}
                >
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=00bf63&color=fff`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className={styles.profileAvatar}
                  />
                  <span className={styles.profileName}>{user.firstName}</span>
                  <FaChevronDown className={`${styles.chevronIcon} ${isProfileMenuOpen ? styles.rotated : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className={styles.profileMenu}>
                    <div className={styles.profileMenuHeader}>
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=00bf63&color=fff`}
                        alt={`${user.firstName} ${user.lastName}`}
                        className={styles.menuAvatar}
                      />
                      <div>
                        <p className={styles.menuUserName}>{user.firstName} {user.lastName}</p>
                        <p className={styles.menuUsername}>@{user.username}</p>
                      </div>
                    </div>

                    <div className={styles.profileMenuActions}>
                      {/* Profile Menu Actions với React Icons */}
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

                      {/* Thêm Community và Meal Planner vào Profile Menu */}
                      <button
                        onClick={() => {
                          handleNavigation("/community");
                          setIsProfileMenuOpen(false);
                        }}
                        className={styles.menuAction}
                      >
                        <FaUsers className={styles.menuActionIcon} />
                        <span className={styles.menuActionText}>Community</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavigation("/meal-planner");
                          setIsProfileMenuOpen(false);
                        }}
                        className={styles.menuAction}
                      >
                        <FaCalendarAlt className={styles.menuActionIcon} />
                        <span className={styles.menuActionText}>Meal Planner</span>
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`${styles.mobileMenuBtn} ${isMenuOpen ? styles.open : ''}`}
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>
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
                {/* Community và Meal Planner cho Mobile */}
                <button
                  onClick={() => handleNavigation('/community')}
                  className={`${styles.mobileNavLink} ${isActive('/community') ? styles.active : ''}`}
                >
                  <FaUsers className={styles.mobileNavIcon} />
                  Community
                </button>
                <button
                  onClick={() => handleNavigation('/meal-planner')}
                  className={`${styles.mobileNavLink} ${isActive('/meal-planner') ? styles.active : ''}`}
                >
                  <FaCalendarAlt className={styles.mobileNavIcon} />
                  Meal Planner
                </button>

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
