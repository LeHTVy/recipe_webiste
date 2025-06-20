import React from 'react';
import { FaFire, FaComments, FaTrophy, FaStar } from 'react-icons/fa';
import styles from './RecipeBadge.module.css';

const RecipeBadge = ({ recipe, index = null, viewMode = 'popular' }) => {
  const getBadgeInfo = (recipe, index, viewMode) => {
    if (viewMode === 'popular') {
      if (recipe.recipeaward === 'POPULAR') {
        return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
      }
      if (recipe.commentCount > 10) {
        return { text: 'TRENDING', class: styles.trendingBadge, icon: <FaComments /> };
      }
      if (index !== null && index === 0) {
        return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
      }
    } else if (viewMode === 'toprated') {
      if (recipe.recipeaward === 'TOP_RATED') {
        return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
      }
      if (recipe.rating >= 4.8) {
        return { text: 'EXCELLENT', class: styles.excellentBadge, icon: <FaStar /> };
      }
      if (index !== null && index === 0) {
        return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
      }
    } else {
      if (recipe.recipeaward === 'TOP_RATED') {
        return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
      }
      if (recipe.recipeaward === 'POPULAR') {
        return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
      }
      if (recipe.rating >= 4.8) {
        return { text: 'EXCELLENT', class: styles.excellentBadge, icon: <FaStar /> };
      }
      if (recipe.commentCount > 10) {
        return { text: 'TRENDING', class: styles.trendingBadge, icon: <FaComments /> };
      }
      if (recipe.isPopular) {
        return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
      } else if (recipe.isTopRated) {
        return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
      }
    }
    return null;
  };

  const badgeInfo = getBadgeInfo(recipe, index, viewMode);

  if (!badgeInfo) {
    return null;
  }

  return (
    <div className={badgeInfo.class}>
      {badgeInfo.icon} {badgeInfo.text}
    </div>
  );
};

export default RecipeBadge;