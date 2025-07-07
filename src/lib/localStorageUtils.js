/**
 * Get current user ID from localStorage
 * @returns {string|null} Current user ID or null if not logged in
 */
export const getCurrentUserId = () => {
  let userId = localStorage.getItem('tastemate_current_user_id');
  if (!userId) {
    userId = localStorage.getItem('currentUserId');
  }
  console.log('getCurrentUserId result:', userId);
  return userId;
};

/**
 * Get user details by user ID
 * @param {string|number} userId - User ID to look up
 * @returns {object|null} User object or null if not found
 */
export const getUserById = (userId) => {
  try {
    const allUsers = JSON.parse(localStorage.getItem('tastemate_users') || '[]');
    const communityUsers = JSON.parse(localStorage.getItem('tastemate_community_users') || '[]');
    
    let searchId = userId;
    if (typeof userId === 'string' && userId.startsWith('tastemate-user-')) {
      searchId = userId.replace('tastemate-user-', '');
    }

    let user = allUsers.find(u =>
      u.id === userId ||
      u.id === searchId ||
      u.id === parseInt(searchId) ||
      `tastemate-user-${u.id}` === userId ||
      u.username === userId ||
      u.username === searchId
    );

    if (!user) {
      user = communityUsers.find(u =>
        u.id === userId ||
        u.id === searchId ||
        u.id === parseInt(searchId) ||
        `tastemate-user-${u.id}` === userId ||
        u.username === userId ||
        u.username === searchId
      );
    }

    if (!user) {
      console.log(`getUserById - searching for author: ${userId}`);
      const recipes = JSON.parse(localStorage.getItem('tastemate_recipes') || '[]');
      console.log(`getUserById - recipes in localStorage:`, recipes.length);
      
      const recipe = recipes.find(r => r.author && r.author.id === userId);
      console.log(`getUserById - found recipe for author:`, recipe ? recipe.title : 'none');
      
      if (recipe && recipe.author) {
        // Transform mock author to  user format
        user = {
          id: recipe.author.id,
          username: recipe.author.id,
          firstName: recipe.author.name.split(' ')[0] || recipe.author.name,
          lastName: recipe.author.name.split(' ').slice(1).join(' ') || '',
          displayName: recipe.author.name,
          profilePicture: recipe.author.avatar,
          bio: recipe.author.bio || '',
          location: recipe.author.location || '',
          followers: recipe.author.followers || 0,
          following: recipe.author.following || 0,
          totalRecipes: recipe.author.totalRecipes || 0,
          joinDate: recipe.author.joinDate,
          isFromMockData: true 
        };
        console.log(`getUserById - created user from author:`, user);
      }
    }

    return user || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// ==================== FOLLOWING FUNCTIONALITY ====================

/**
 * Get the following list for current user
 * @returns {Array} Array of user IDs that current user is following
 */
export const getFollowingList = () => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];
  
  try {
    const followingKey = `following_${currentUserId}`;
    return JSON.parse(localStorage.getItem(followingKey) || '[]');
  } catch (error) {
    console.error('Error getting following list:', error);
    return [];
  }
};

/**
 * 
 * Get detailed information of users that current user is following
 * @returns {Array} Array of user objects with detailed information
 */
export const getFollowingDetails = () => {
  const followingList = getFollowingList();
  console.log('getFollowingDetails - followingList:', followingList);
  
  const userDetails = followingList.map(userId => {
    const user = getUserById(userId);
    console.log(`getFollowingDetails - userId: ${userId}, found user:`, user);
    return user;
  }).filter(user => user !== null);
  
  console.log('getFollowingDetails - final userDetails:', userDetails);
  return userDetails;
};

/**
 * Follow a user
 * @param {string|number} userIdToFollow - ID of user to follow
 * @returns {boolean} Success status
 */
export const followUser = (userIdToFollow) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId || currentUserId === userIdToFollow.toString()) {
    return false;
  }

  try {
    const followingKey = `following_${currentUserId}`;
    const followedKey = `followed_${userIdToFollow}`;

    const currentFollowing = getFollowingList();
    if (!currentFollowing.includes(userIdToFollow.toString())) {
      currentFollowing.push(userIdToFollow.toString());
      localStorage.setItem(followingKey, JSON.stringify(currentFollowing));
      console.log(`Added ${userIdToFollow} to following list of ${currentUserId}`);
    }

    const followedByList = JSON.parse(localStorage.getItem(followedKey) || '[]');
    if (!followedByList.includes(currentUserId)) {
      followedByList.push(currentUserId);
      localStorage.setItem(followedKey, JSON.stringify(followedByList));
      console.log(`Added ${currentUserId} to followers list of ${userIdToFollow}`);
    }

    window.dispatchEvent(new CustomEvent('localStorageUpdate', {
      detail: { type: 'follow', userId: userIdToFollow, currentUserId }
    }));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: followedKey,
      newValue: JSON.stringify(followedByList),
      oldValue: JSON.stringify(followedByList.slice(0, -1))
    }));

    return true;
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};

/**
 * Unfollow a user
 * @param {string|number} userIdToUnfollow - ID of user to unfollow
 * @returns {boolean} Success status
 */
export const unfollowUser = (userIdToUnfollow) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  
  try {
    const followingKey = `following_${currentUserId}`;
    const followedKey = `followed_${userIdToUnfollow}`;
    
    const currentFollowing = getFollowingList();
    const updatedFollowing = currentFollowing.filter(id => id !== userIdToUnfollow.toString());
    localStorage.setItem(followingKey, JSON.stringify(updatedFollowing));
    
    const followedByList = JSON.parse(localStorage.getItem(followedKey) || '[]');
    const updatedFollowedBy = followedByList.filter(id => id !== currentUserId);
    localStorage.setItem(followedKey, JSON.stringify(updatedFollowedBy));
    
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};

/**
 * Check if current user is following a specific user
 * @param {string|number} userId - ID of user to check
 * @returns {boolean} True if following, false otherwise
 */
export const isFollowing = (userId) => {
  const followingList = getFollowingList();
  return followingList.includes(userId.toString());
};

/**
 * Get followers of a specific user
 * @param {string|number} userId - ID of user to get followers for
 * @returns {Array} Array of user objects who follow this user
 */
export const getFollowers = (userId) => {
  try {
    console.log('getFollowers - userId:', userId);
    
    const followedKey1 = `followed_${userId}`;
    const followedKey2 = `followed_tastemate-user-${userId}`;
    
    console.log('getFollowers - checking keys:', followedKey1, followedKey2);
    
    let followerIds = JSON.parse(localStorage.getItem(followedKey1) || '[]');
    console.log('getFollowers - followerIds from key1:', followerIds);
    
    if (followerIds.length === 0) {
      followerIds = JSON.parse(localStorage.getItem(followedKey2) || '[]');
      console.log('getFollowers - followerIds from key2:', followerIds);
    }
    
    const followers = followerIds.map(id => {
      console.log('getFollowers - processing follower ID:', id);
      const user = getUserById(id);
      console.log('getFollowers - found user for ID:', id, user);
      return user;
    }).filter(user => user !== null);
    
    console.log('getFollowers - final followers array:', followers);
    return followers;
  } catch (error) {
    console.error('Error getting followers:', error);
    return [];
  }
};

/**
 * Get followers of current user
 * @returns {Array} Array of user objects who follow current user
 */
export const getFollowersDetails = () => {
  const currentUserId = getCurrentUserId();
  console.log('getFollowersDetails - currentUserId:', currentUserId);
  
  if (!currentUserId) {
    console.log('getFollowersDetails - no current user ID found');
    return [];
  }
  
  const followedKey1 = `followed_${currentUserId}`;
  const followedKey2 = `followed_tastemate-user-${currentUserId}`;
  
  console.log('getFollowersDetails - checking keys:', followedKey1, followedKey2);
  
  let followerIds = JSON.parse(localStorage.getItem(followedKey1) || '[]');
  console.log('getFollowersDetails - followerIds from key1:', followerIds);
  
  if (followerIds.length === 0) {
    followerIds = JSON.parse(localStorage.getItem(followedKey2) || '[]');
    console.log('getFollowersDetails - followerIds from key2:', followerIds);
  }
  
  if (followerIds.length === 0) {
    console.log('getFollowersDetails - no followers found for either key format');
    return [];
  }
  
  const followers = followerIds.map(id => {
    console.log('getFollowersDetails - processing follower ID:', id);
    const user = getUserById(id);
    console.log('getFollowersDetails - found user for ID:', id, user);
    return user;
  }).filter(user => user !== null);
  
  console.log('getFollowersDetails - final followers array:', followers);
  return followers;
};

// ==================== AUTHOR BOOKMARKS FUNCTIONALITY ====================

/**
 * Get author bookmarks for current user
 * @returns {Array} Array of bookmarked author IDs
 */
export const getAuthorBookmarks = () => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];
  
  try {
    const bookmarksKey = `authorBookmarks_${currentUserId}`;
    return JSON.parse(localStorage.getItem(bookmarksKey) || '[]');
  } catch (error) {
    console.error('Error getting author bookmarks:', error);
    return [];
  }
};

/**
 * Get detailed information of bookmarked authors
 * @returns {Array} Array of author objects with detailed information
 */
export const getAuthorBookmarkDetails = () => {
  const bookmarkedAuthorIds = getAuthorBookmarks();
  return bookmarkedAuthorIds.map(authorId => getUserById(authorId)).filter(author => author !== null);
};

/**
 * Bookmark an author
 * @param {string|number} authorId - ID of author to bookmark
 * @returns {boolean} Success status
 */
export const bookmarkAuthor = (authorId) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  
  try {
    const bookmarksKey = `authorBookmarks_${currentUserId}`;
    const currentBookmarks = getAuthorBookmarks();
    
    if (!currentBookmarks.includes(authorId.toString())) {
      currentBookmarks.push(authorId.toString());
      localStorage.setItem(bookmarksKey, JSON.stringify(currentBookmarks));
      return true;
    }
    
    return false; 
  } catch (error) {
    console.error('Error bookmarking author:', error);
    return false;
  }
};

/**
 * Remove author bookmark
 * @param {string|number} authorId - ID of author to remove from bookmarks
 * @returns {boolean} Success status
 */
export const removeAuthorBookmark = (authorId) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  
  try {
    const bookmarksKey = `authorBookmarks_${currentUserId}`;
    const currentBookmarks = getAuthorBookmarks();
    const updatedBookmarks = currentBookmarks.filter(id => id !== authorId.toString());
    
    localStorage.setItem(bookmarksKey, JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    console.error('Error removing author bookmark:', error);
    return false;
  }
};

/**
 * Check if an author is bookmarked
 * @param {string|number} authorId - ID of author to check
 * @returns {boolean} True if bookmarked, false otherwise
 */
export const isAuthorBookmarked = (authorId) => {
  const bookmarks = getAuthorBookmarks();
  return bookmarks.includes(authorId.toString());
};

/**
 * Toggle author bookmark status
 * @param {string|number} authorId - ID of author to toggle
 * @returns {boolean} New bookmark status (true if now bookmarked, false if removed)
 */
export const toggleAuthorBookmark = (authorId) => {
  if (isAuthorBookmarked(authorId)) {
    removeAuthorBookmark(authorId);
    return false;
  } else {
    bookmarkAuthor(authorId);
    return true;
  }
};

// ==================== COMMUNITY BOOKMARKS FUNCTIONALITY ====================

/**
 * Get community post bookmarks for current user
 * @returns {Array} Array of bookmarked post objects
 */
export const getCommunityBookmarks = () => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];
  
  try {
    const bookmarksKey = `communityBookmarks_${currentUserId}`;
    return JSON.parse(localStorage.getItem(bookmarksKey) || '[]');
  } catch (error) {
    console.error('Error getting community bookmarks:', error);
    return [];
  }
};

/**
 * Bookmark a community post
 * @param {object} post - Post object to bookmark
 * @returns {boolean} Success status
 */
export const bookmarkCommunityPost = (post) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId || !post || !post.id) return false;
  
  try {
    const bookmarksKey = `communityBookmarks_${currentUserId}`;
    const currentBookmarks = getCommunityBookmarks();
    
    const existingIndex = currentBookmarks.findIndex(bookmark => bookmark.id === post.id);
    if (existingIndex === -1) {
      const bookmarkData = {
        ...post,
        bookmarkedAt: new Date().toISOString()
      };
      currentBookmarks.push(bookmarkData);
      localStorage.setItem(bookmarksKey, JSON.stringify(currentBookmarks));
      return true;
    }
    
    return false; 
  } catch (error) {
    console.error('Error bookmarking community post:', error);
    return false;
  }
};

/**
 * Remove community post bookmark
 * @param {string|number} postId - ID of post to remove from bookmarks
 * @returns {boolean} Success status
 */
export const removeCommunityBookmark = (postId) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  
  try {
    const bookmarksKey = `communityBookmarks_${currentUserId}`;
    const currentBookmarks = getCommunityBookmarks();
    const updatedBookmarks = currentBookmarks.filter(bookmark => bookmark.id !== postId);
    
    localStorage.setItem(bookmarksKey, JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    console.error('Error removing community bookmark:', error);
    return false;
  }
};

/**
 * Check if a community post is bookmarked
 * @param {string|number} postId - ID of post to check
 * @returns {boolean} True if bookmarked, false otherwise
 */
export const isCommunityPostBookmarked = (postId) => {
  const bookmarks = getCommunityBookmarks();
  return bookmarks.some(bookmark => bookmark.id === postId);
};

/**
 * Toggle community post bookmark status
 * @param {object} post - Post object to toggle
 * @returns {boolean} New bookmark status (true if now bookmarked, false if removed)
 */
export const toggleCommunityBookmark = (post) => {
  if (isCommunityPostBookmarked(post.id)) {
    removeCommunityBookmark(post.id);
    return false;
  } else {
    bookmarkCommunityPost(post);
    return true;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Clear all user-specific data (useful for logout)
 * @param {string} userId - User ID to clear data for (optional, defaults to current user)
 */
export const clearUserData = (userId = null) => {
  const targetUserId = userId || getCurrentUserId();
  if (!targetUserId) return;
  
  try {
    localStorage.removeItem(`following_${targetUserId}`);
    localStorage.removeItem(`authorBookmarks_${targetUserId}`);
    localStorage.removeItem(`communityBookmarks_${targetUserId}`);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Get followers count for a specific user (more efficient than getFollowers)
 * @param {string|number} userId - ID of user to get followers count for
 * @returns {number} Number of followers
 */
export const getFollowersCount = (userId) => {
  try {
    console.log('getFollowersCount - userId:', userId);
    const followedKey1 = `followed_${userId}`;
    const followedKey2 = `followed_tastemate-user-${userId}`;
    
    console.log('getFollowersCount - checking keys:', followedKey1, followedKey2);
    
    let followerIds = JSON.parse(localStorage.getItem(followedKey1) || '[]');
    console.log('getFollowersCount - followerIds from key1:', followerIds);
    if (followerIds.length === 0) {
      followerIds = JSON.parse(localStorage.getItem(followedKey2) || '[]');
      console.log('getFollowersCount - followerIds from key2:', followerIds);
    }
    
    console.log('getFollowersCount - final count:', followerIds.length);
    return followerIds.length;
  } catch (error) {
    console.error('Error getting followers count:', error);
    return 0;
  }
};

/**
 * Get statistics for current user
 * @returns {object} Object containing user statistics
 */
export const getUserStats = () => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    return {
      followingCount: 0,
      followersCount: 0,
      authorBookmarksCount: 0,
      communityBookmarksCount: 0
    };
  }
  
  return {
    followingCount: getFollowingList().length,
    followersCount: getFollowersCount(currentUserId),
    authorBookmarksCount: getAuthorBookmarks().length,
    communityBookmarksCount: getCommunityBookmarks().length
  };
};

/**
 * Export all user data (useful for backup or data portability)
 * @returns {object} Object containing all user data
 */
export const exportUserData = () => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return null;
  
  return {
    userId: currentUserId,
    following: getFollowingDetails(),
    followers: getFollowers(currentUserId),
    authorBookmarks: getAuthorBookmarkDetails(),
    communityBookmarks: getCommunityBookmarks(),
    stats: getUserStats(),
    exportedAt: new Date().toISOString()
  };
};