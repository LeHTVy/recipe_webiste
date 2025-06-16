import React from 'react';
import { FaFire, FaComments, FaTrophy, FaStar } from 'react-icons/fa';
import styles from './RecipeBadge.module.css';

const RecipeBadge = ({ recipe, index = null, viewMode = 'popular' }) => {
  const getBadgeInfo = (recipe, index, viewMode) => {
    // For carousel components with index-based logic
    if (index !== null) {
      if (viewMode === 'popular') {
        if (index === 0) {
          return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
        } else if (recipe.commentCount > 10) {
          return { text: 'TRENDING', class: styles.trendingBadge, icon: <FaComments /> };
        }
      } else {
        if (index === 0) {
          return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
        } else if (recipe.rating >= 4.8) {
          return { text: 'EXCELLENT', class: styles.excellentBadge, icon: <FaStar /> };
        }
      }
    } else {
      // For single recipe components (like HeroRecipe)
      if (recipe.isPopular) {
        return { text: 'MOST POPULAR', class: styles.mostPopularBadge, icon: <FaFire /> };
      } else if (recipe.commentCount > 10) {
        return { text: 'TRENDING', class: styles.trendingBadge, icon: <FaComments /> };
      } else if (recipe.isTopRated) {
        return { text: 'TOP RATED', class: styles.topRatedBadge, icon: <FaTrophy /> };
      } else if (recipe.rating >= 4.8) {
        return { text: 'EXCELLENT', class: styles.excellentBadge, icon: <FaStar /> };
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