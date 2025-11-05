// /src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccessDenied from '../common/AccessDenied';

function ProtectedRoute({ children, requiredRole, requiredRoles = [] }) {
  const { isAuthenticated, user, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <AccessDenied
        title="Acceso Denegado"
        message={`No tienes permisos para acceder a esta página. Se requiere el rol ${requiredRole} pero tu rol actual es ${user?.role}.`}
        icon="🚫"
        variant="danger"
        showHomeButton={true}
        showStaffButton={true}
      />
    );
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
    return (
      <AccessDenied
        title="Acceso Restringido"
        message={`Esta área está reservada para el personal autorizado. Tu rol actual (${user?.role}) no tiene acceso.`}
        icon="🔒"
        variant="warning"
        showHomeButton={true}
        showStaffButton={false}
      />
    );
  }

  return children;
}

export default ProtectedRoute;