/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import styles from "./Footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaMobileAlt,
  FaBell,
} from "react-icons/fa";

// Import logo GIFs
import logoLight from "../../assets/hero/hero-light.gif";
import logoDark from "../../assets/hero/hero-dark.gif";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    // You can add actual subscription logic here
    alert("Thank you for subscribing to our newsletter!");
    e.target.reset();
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logo}>
              <img
                src={isDarkMode ? logoDark : logoLight}
                alt="TasteMate Logo"
                className={styles.logoGif}
              />
              <span className={styles.logoText}>TasteMate</span>
            </div>
            <p className={styles.brandDescription}>
              Share your flavor, build your community. Discover amazing recipes,
              connect with fellow food lovers, and create culinary memories
              together.
            </p>

            {/* Social Links với React Icons */}
            <div className={styles.socialLinks}>
              <a
                href="https://www.facebook.com/?locale=vi_VN"
                className={styles.socialLink}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className={styles.socialIcon} />
              </a>
              <a
                href="https://www.instagram.com/"
                className={styles.socialLink}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className={styles.socialIcon} />
              </a>
              <a
                href="https://x.com/"
                className={styles.socialLink}
                aria-label="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className={styles.socialIcon} />
              </a>
              <a
                href="https://www.linkedin.com/"
                className={styles.socialLink}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className={styles.socialIcon} />
              </a>
              <a
                href="https://www.youtube.com/?app=desktop&hl=vi"
                className={styles.socialLink}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className={styles.socialIcon} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  All Recipes
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Popular Recipes
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Meal Planner
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  My Favorites
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Categories</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  Breakfast
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Lunch
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Dinner
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Desserts
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Healthy
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Quick & Easy
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Community</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="#" className={styles.footerLink}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Submit Recipe
                </a>
              </li>
              <li>
                <a href="#" className={styles.footerLink}>
                  Join Community
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterSection}>
            <h4 className={styles.sectionTitle}>Stay Updated</h4>
            <p className={styles.newsletterDescription}>
              Get the latest recipes, cooking tips, and food inspiration
              delivered to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className={styles.newsletterForm}
            >
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </div>
            </form>

            {/* Features với React Icons và Màu Sắc */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <FaMobileAlt className={styles.featureIcon} />
                <span className={styles.featureText}>
                  Mobile App Coming Soon
                </span>
              </div>
              <div className={styles.feature}>
                <FaBell className={styles.featureIcon} />
                <span className={styles.featureText}>
                  Weekly Recipe Updates
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>
              © {currentYear} TasteMate. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>
                Privacy Policy
              </a>
              <a href="#" className={styles.legalLink}>
                Terms of Service
              </a>
              <a href="#" className={styles.legalLink}>
                Cookie Policy
              </a>
            </div>
          </div>
          <div className={styles.bottomRight}>
            <div className={styles.status}>
              <span className={styles.statusIndicator}></span>
              <span className={styles.statusText}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
