// src/utils/NavigationRoutes.jsx
export const getNavigationRoutes = (user, isAuthenticated, hasRole) => {
  const publicRoutes = [
    { path: '/', label: 'Inicio', icon: '🏠', exact: true },
    { path: '/menu', label: 'Menú Digital', icon: '📱' },
    { path: '/self-ordering', label: 'Auto-Ordenar', icon: '📋' },
    { path: '/delivery', label: 'Delivery/Recoger', icon: '🚚' },
    { path: '/reservations', label: 'Reservas', icon: '📅' }
  ];

  if (!isAuthenticated) return publicRoutes;

  if (user?.role === 'cliente') {
    return [
      ...publicRoutes,
      { path: '/orders', label: 'Mis Pedidos', icon: '📝' },
      { path: '/profile', label: 'Mi Perfil', icon: '👤' }
    ];
  }

  const staffRoutes = [
    { path: '/staff/dashboard', label: 'Dashboard Staff', icon: '📊', staffOnly: true }
  ];

  // ADMIN tiene acceso a TODOS los paneles
  if (hasRole('mesero') || hasRole('admin')) {
    staffRoutes.push(
      { path: '/staff/orders', label: 'Panel Mesero', icon: '👨‍💼', staffOnly: true }
    );
  }

  if (hasRole('cocinero') || hasRole('admin')) {
    staffRoutes.push(
      { path: '/staff/kitchen', label: 'Panel Cocina', icon: '👨‍🍳', staffOnly: true }
    );
  }

  if (hasRole('cajero') || hasRole('admin')) {
    staffRoutes.push(
      { path: '/staff/cashier', label: 'Panel Caja', icon: '💰', staffOnly: true }
    );
  }

  if (hasRole('admin')) {
    staffRoutes.push(
      { path: '/admin', label: 'Panel Admin', icon: '⚙️', staffOnly: true }
    );
  }

  return [...publicRoutes, ...staffRoutes];
};