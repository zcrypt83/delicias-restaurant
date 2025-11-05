// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada al cargar la app
    const savedUser = localStorage.getItem('restaurant_user');
    const savedToken = localStorage.getItem('restaurant_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulación de llamada a API - en producción sería una petición real
      const users = {
        // Admin
        'admin@delicias.com': { 
          id: 1, 
          email: 'admin@delicias.com', 
          name: 'Administrador', 
          role: 'admin',
          password: 'admin123'
        },
        // Staff - Cocina
        'cocinero@delicias.com': { 
          id: 2, 
          email: 'cocinero@delicias.com', 
          name: 'Chef Carlos', 
          role: 'cocinero',
          password: 'cocina123'
        },
        // Staff - Mesero
        'mesero@delicias.com': { 
          id: 3, 
          email: 'mesero@delicias.com', 
          name: 'Mesero Juan', 
          role: 'mesero',
          password: 'mesero123'
        },
        // Staff - Cajero
        'cajero@delicias.com': { 
          id: 4, 
          email: 'cajero@delicias.com', 
          name: 'Cajera María', 
          role: 'cajero',
          password: 'caja123'
        },
        // Cliente
        'cliente@ejemplo.com': { 
          id: 5, 
          email: 'cliente@ejemplo.com', 
          name: 'Cliente Demo', 
          role: 'cliente',
          password: 'cliente123'
        }
      };

      const userData = users[email];
      
      if (!userData || userData.password !== password) {
        throw new Error('Credenciales incorrectas');
      }

      // Remover password antes de guardar
      const { password: _, ...userWithoutPassword } = userData;
      
      // Simular token
      const token = `token_${Date.now()}_${userData.id}`;
      
      // Guardar en localStorage
      localStorage.setItem('restaurant_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('restaurant_token', token);
      
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('restaurant_user');
    localStorage.removeItem('restaurant_token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      // Simulación de registro - en producción sería una petición real
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'cliente' // Por defecto todos se registran como clientes
      };

      // Guardar en localStorage (simulación)
      const token = `token_${Date.now()}_${newUser.id}`;
      localStorage.setItem('restaurant_user', JSON.stringify(newUser));
      localStorage.setItem('restaurant_token', token);
      
      setUser(newUser);
      return { success: true, user: newUser };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};