import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem('tastemate_current_user_id');
    if (savedUserId) {
      try {
        const allUsersData = localStorage.getItem('tastemate_users');
        if (allUsersData) {
          const allUsers = JSON.parse(allUsersData);
          if (Array.isArray(allUsers)) {
            const currentUser = allUsers.find(user => user.id === parseInt(savedUserId));
            if (currentUser) {
              setUser(currentUser);
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem('tastemate_current_user_id');
            }
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('tastemate_current_user_id');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('tastemate_current_user_id', userData.id.toString());
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tastemate_current_user_id');
  };

  const updateProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    try {
      const allUsersData = localStorage.getItem('tastemate_users');
      if (allUsersData) {
        const allUsers = JSON.parse(allUsersData);
        if (Array.isArray(allUsers)) {
          const userIndex = allUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            allUsers[userIndex] = newUserData;
            localStorage.setItem('tastemate_users', JSON.stringify(allUsers));
          }
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
