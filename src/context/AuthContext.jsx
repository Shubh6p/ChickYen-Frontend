import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("customerUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem("customerToken") || null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("customerUser", JSON.stringify(userData));
    localStorage.setItem("customerToken", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("customerUser");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("cartItems"); // Clear cart on logout
  };

  const updateDetails = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("customerUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateDetails, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
