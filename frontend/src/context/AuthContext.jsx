import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/api'; // Import the real API client

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // You might want a dedicated /api/auth/me endpoint to get user data from token
          const userPayload = JSON.parse(atob(token.split('.')[1]));
          // This is a temporary solution, a '/me' endpoint is better
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // If user is not in local storage, you might need to fetch it
            // For now, we'll just use the payload, but it could be stale
            setUser({ id: userPayload.id, role: userPayload.role });
          }
        } catch (error) {
          console.error("Invalid token found in localStorage", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiClient.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await apiClient.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => Array.isArray(roles) && roles.includes(user?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};