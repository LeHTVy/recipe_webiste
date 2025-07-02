// src/pages/Auth/Auth.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUtensils,
  FaLeaf,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaGoogle,
  FaFacebookF,
} from "react-icons/fa";
import Stack from "../../components/Stack/Stack";
import styles from "./Auth.module.css";

// Import GIF files
import authGifLight from "../../assets/auth/auth-light.gif";
import authGifDark from "../../assets/auth/auth-dark.gif";

const Auth = () => {
  const { isDarkMode } = useTheme();
  const { login } = useAuth();
  const { showSignupSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Recipe images data for Stack
  const recipeImages = [
    {
      id: 1,
      img: "https://www.foodiesfeed.com/wp-content/uploads/2023/08/crispy-spicy-chicken-wings.jpg",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500&auto=format",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=500&auto=format",
    },
    {
      id: 5,
      img: "https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/refreshing-lemon-cheesecake-slice-with-mint-garnish.jpg",
    },
    {
      id: 6,
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=500&auto=format",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (isSignUp) {
      if (!formData.username) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (isSignUp) {
        let existingUsers;
        try {
          const storedData = localStorage.getItem("tastemate_users");
          existingUsers = storedData ? JSON.parse(storedData) : [];
          // Ensure existingUsers is an array
          if (!Array.isArray(existingUsers)) {
            existingUsers = [];
          }
        } catch (error) {
          console.warn("Invalid localStorage data, resetting to empty array");
          existingUsers = [];
          localStorage.setItem("tastemate_users", JSON.stringify([]));
        }

        const userExists = existingUsers.find(
          (user) =>
            user.email === formData.email || user.username === formData.username
        );

        if (userExists) {
          setErrors({
            email:
              userExists.email === formData.email ? "Email already exists" : "",
            username:
              userExists.username === formData.username
                ? "Username already exists"
                : "",
          });
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: Date.now(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          profilePicture:
            formData.profilePicture ||
            `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
          createdAt: new Date().toISOString(),
          recipesCreated: 0,
          totalRatings: 0,
          favoriteRecipes: [],
          dietaryPreferences: [],
          bio: [],
        };

        existingUsers.push(newUser);
        localStorage.setItem("tastemate_users", JSON.stringify(existingUsers));

        login(newUser);
        showSignupSuccess(formData.firstName);
        navigate("/profile");
      } else {
        let existingUsers;
        try {
          const storedData = localStorage.getItem("tastemate_users");
          existingUsers = storedData ? JSON.parse(storedData) : [];
          if (!Array.isArray(existingUsers)) {
            existingUsers = [];
          }
        } catch (error) {
          console.warn("Invalid localStorage data, resetting to empty array");
          existingUsers = [];
          localStorage.setItem("tastemate_users", JSON.stringify([]));
        }
        const user = existingUsers.find(
          (user) => user.email === formData.email
        );

        if (!user) {
          setErrors({ email: "User not found" });
          setIsLoading(false);
          return;
        }

        if (user.password && user.password !== formData.password) {
          setErrors({ password: "Incorrect password" });
          setIsLoading(false);
          return;
        }

        login(user);
        navigate("/");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
      showError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
    });
    setErrors({});
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`${styles.authContainer} ${isDarkMode ? styles.darkMode : ""}`}
    >
      {/* Left Side - Form */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          {/* Back to Home Button */}
          <button onClick={handleBackToHome} className={styles.backButton}>
            ← Back to Home
          </button>

          {/* Brand Header */}
          <div className={styles.brandHeader}>
            <FaUser className={styles.brandIcon} />
            <h1 className={styles.brandTitle}>TasteMate</h1>
            <p className={styles.brandSubtitle}>
              {isSignUp
                ? "Join our community of food lovers"
                : "Sign in to your account or create a new one"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className={styles.tabSwitcher}>
            <button
              className={`${styles.tabButton} ${
                !isSignUp ? styles.active : ""
              }`}
              onClick={() => !isSignUp || toggleMode()}
            >
              Login
            </button>
            <button
              className={`${styles.tabButton} ${isSignUp ? styles.active : ""}`}
              onClick={() => isSignUp || toggleMode()}
            >
              Sign Up
            </button>
          </div>

          {/* Welcome Message */}
          <div className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>
              {isSignUp ? "Welcome" : "Welcome"}
            </h2>
            <p className={styles.welcomeText}>
              {isSignUp
                ? "Sign in to your account or create a new one"
                : "Sign in to your account or create a new one"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
              <div className={styles.errorMessage}>{errors.general}</div>
            )}

            {isSignUp && (
              <>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${
                        errors.firstName ? styles.error : ""
                      }`}
                    />
                    {errors.firstName && (
                      <span className={styles.errorText}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${
                        errors.lastName ? styles.error : ""
                      }`}
                    />
                    {errors.lastName && (
                      <span className={styles.errorText}>
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.username ? styles.error : ""
                    }`}
                  />
                  {errors.username && (
                    <span className={styles.errorText}>{errors.username}</span>
                  )}
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.inputWithIconPadding} ${
                    errors.email ? styles.error : ""
                  }`}
                />
              </div>
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWithIcon}>
                <span className={styles.inputIcon}>
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.inputWithIconPadding} ${
                    errors.password ? styles.error : ""
                  }`}
                />
                {formData.password.length > 0 && (
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            {isSignUp && (
              <div className={styles.inputGroup}>
                <div className={styles.inputWithIcon}>
                  <span className={styles.inputIcon}>
                    <FaLock />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      styles.inputWithIconPadding
                    } ${errors.confirmPassword ? styles.error : ""}`}
                  />
                  {formData.confirmPassword.length > 0 && (
                    <button
                      type="button"
                      className={styles.togglePasswordBtn}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
                {errors.confirmPassword && (
                  <span className={styles.errorText}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>

            {/* Social Login Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerText}>or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className={styles.socialButtons}>
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.googleBtn}`}
                onClick={() => console.log('Google login')}
              >
                <FaGoogle className={styles.socialIcon} />
                <span>Google</span>
              </button>
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.facebookBtn}`}
                onClick={() => console.log('Facebook login')}
              >
                <FaFacebookF className={styles.socialIcon} />
                <span>Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main GIF - Center */}
      {/* Right Side - Full Visual Section */}
      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          {/* Stack Component - Top Left */}
          <div className={styles.stackSection}>
            <Stack
              cardsData={recipeImages}
              cardDimensions={{ width: 150, height: 150 }}
              randomRotation={true}
              sensitivity={150}
              sendToBackOnClick={true}
            />
          </div>

          {/* Recipe Badges - Top Right */}
          <div className={styles.recipeBadges}>
            <div className={styles.recipeBadge}>
              <FaUtensils className={styles.badgeIcon} />
              <span className={styles.badgeText}>
                Choose your favorite recipes
              </span>
            </div>
            <div className={styles.recipeBadge}>
              <span className={styles.badgeIcon}>🍝</span>
              <span className={styles.badgeText}>Share your taste</span>
            </div>
            <div className={styles.recipeBadge}>
              <FaLeaf className={styles.badgeIcon} />
              <span className={styles.badgeText}>Find your soulmate</span>
            </div>
          </div>

          {/* Main GIF - Center với opacity giảm */}
          <div className={styles.mainVisual}>
            <img
              src={isDarkMode ? authGifDark : authGifLight}
              alt="TasteMate Authentication"
              className={styles.authGif}
            />
            {/* Overlay để giảm độ chói của GIF */}
            <div className={styles.gifOverlay}></div>
          </div>

          {/* Bottom Text */}
          <div className={styles.visualText}>
            <h3 className={styles.visualTitle}>Discover Amazing Recipes</h3>
            <p className={styles.visualSubtitle}>
              Join thousands of food lovers sharing their favorite recipes
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollText}>Scroll to explore</div>
            <div className={styles.scrollArrow}>↓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
