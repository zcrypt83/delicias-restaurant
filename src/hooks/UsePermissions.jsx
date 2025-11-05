// src/hooks/UsePermissions.jsx
import { useAuth } from '../context/AuthContext';

export default function usePermissions() {
  const { user, hasRole } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const isStaff = ['admin', 'cocinero', 'mesero', 'cajero'].includes(user?.role);
  const isClient = user?.role === 'cliente';

  const canAccess = (requiredRoles) => {
    if (isAdmin) return true;
    return requiredRoles.some(role => hasRole(role));
  };

  const canManage = (permission) => {
    const permissions = {
      'kitchen': ['admin', 'cocinero'],
      'orders': ['admin', 'mesero'],
      'cashier': ['admin', 'cajero'],
      'admin': ['admin'],
      'menu': ['admin', 'cocinero'],
      'users': ['admin']
    };
    
    return permissions[permission]?.includes(user?.role) || false;
  };

  return {
    isAdmin,
    isStaff, 
    isClient,
    canAccess,
    canManage,
    userRole: user?.role
  };
}