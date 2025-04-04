import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Default user state - always authenticated
  const [user] = useState({
    name: "Guest User",
    email: "guest@example.com",
    role: "user",
    stats: {
      completedTasks: 0,
      streak: 0,
      lastActive: new Date()
    }
  });
  
  // Always authenticated
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);
  
  // Store default user in localStorage for other components
  localStorage.setItem('username', user.name);
  localStorage.setItem('hasCompletedStartup', 'true');
  
  // These functions exist but don't do anything since auth is removed
  const register = async () => {
    return { success: true, user };
  };
  
  const login = async () => {
    return { success: true, user };
  };
  
  const googleLogin = async () => {
    return { success: true, user };
  };
  
  const logout = async () => {
    // Don't do anything as we always want to be logged in
    return { success: true };
  };
  
  const updateProfile = async (profileData) => {
    return { 
      success: true, 
      data: { 
        ...user, 
        ...profileData 
      } 
    };
  };
  
  const completeStartup = () => {
    localStorage.setItem('hasCompletedStartup', 'true');
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error: null,
    register,
    login,
    googleLogin,
    logout,
    updateProfile,
    completeStartup
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;