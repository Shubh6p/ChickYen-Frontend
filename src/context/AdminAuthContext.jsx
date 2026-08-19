import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import config from '../config';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const storedUser = localStorage.getItem("adminUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem("adminToken") || null;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!adminToken || !adminUser || !['admin', 'owner'].includes(adminUser.role)) {
        setIsAdminAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${config.API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        if (res.status === 200) {
          setIsAdminAuthenticated(true);
        } else {
          handleAdminLogout();
        }
      } catch (err) {
        // If network fails but token exists, we'll optimistically keep them logged in
        setIsAdminAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [adminToken, adminUser]);

  const handleAdminLogin = (userData, authToken) => {
    setAdminUser(userData);
    setAdminToken(authToken);
    setIsAdminAuthenticated(true);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    localStorage.setItem("adminToken", authToken);
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      adminToken, 
      isAdminAuthenticated, 
      isLoading,
      handleAdminLogin, 
      handleAdminLogout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
