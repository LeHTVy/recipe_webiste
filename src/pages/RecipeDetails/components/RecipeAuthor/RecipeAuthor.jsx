import React, { useState } from 'react';
import { FaUser, FaEye, FaHeart, FaUtensils, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './RecipeAuthor.module.css';

const RecipeAuthor = ({ author, onViewProfile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewProfile = () => {
    onViewProfile && onViewProfile(author);
  };

  return (
    <div className={`${styles.authorContainer} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {/* Collapsed State - Floating Button */}
      <div className={styles.authorTrigger} onClick={toggleExpanded}>
        <div className={styles.authorAvatar}>
          <img 
            src={author.avatar || '/default-avatar.png'} 
            alt={author.name}
            className={styles.avatarImage}
          />
        </div>
        
        {!isExpanded && (
          <div className={styles.quickInfo}>
            <span className={styles.authorName}>{author.name}</span>
            <div className={styles.expandIcon}>
              <FaChevronDown />
            </div>
          </div>
        )}
      </div>

      {/* Expanded State - Full Card */}
      {isExpanded && (
        <div className={styles.authorCard}>
          <div className={styles.cardHeader}>
            <button className={styles.collapseBtn} onClick={toggleExpanded}>
              <FaChevronUp />
            </button>
          </div>

          <div className={styles.authorProfile}>
            <div className={styles.profileImage}>
              <img 
                src={author.avatar || '/default-avatar.png'} 
                alt={author.name}
                className={styles.profileAvatar}
              />
              <div className={styles.profileBadge}>
                <FaUtensils className={styles.badgeIcon} />
              </div>
            </div>

            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{author.name}</h3>
              <p className={styles.profileTitle}>{author.title || 'Home Chef'}</p>
              
              <div className={styles.profileStats}>
                <div className={styles.stat}>
                  <FaUtensils className={styles.statIcon} />
                  <span className={styles.statValue}>{author.recipesCount || 0}</span>
                  <span className={styles.statLabel}>Recipes</span>
                </div>
                
                <div className={styles.stat}>
                  <FaHeart className={styles.statIcon} />
                  <span className={styles.statValue}>{author.followersCount || 0}</span>
                  <span className={styles.statLabel}>Followers</span>
                </div>
                
                <div className={styles.stat}>
                  <FaEye className={styles.statIcon} />
                  <span className={styles.statValue}>{author.viewsCount || 0}</span>
                  <span className={styles.statLabel}>Views</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.authorBio}>
            <p className={styles.bioText}>
              {author.bio || 'Passionate about creating delicious recipes and sharing culinary experiences with food lovers around the world.'}
            </p>
          </div>

          <div className={styles.authorActions}>
            <button className={styles.followBtn}>
              <FaHeart className={styles.actionIcon} />
              Follow
            </button>
            
            <button className={styles.profileBtn} onClick={handleViewProfile}>
              <FaUser className={styles.actionIcon} />
              View Profile
            </button>
          </div>

          {/* Author's Specialties */}
          {author.specialties && author.specialties.length > 0 && (
            <div className={styles.specialties}>
              <h4 className={styles.specialtiesTitle}>Specialties</h4>
              <div className={styles.specialtiesList}>
                {author.specialties.map((specialty, index) => (
                  <span key={index} className={styles.specialtyTag}>
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeAuthor;