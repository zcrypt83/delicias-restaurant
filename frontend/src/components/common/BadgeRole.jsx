// src/components/common/BadgeRole.jsx
import React from 'react';
import { Badge } from 'react-bootstrap';

function BadgeRole({ role, className = '' }) {
  const roleConfig = {
    admin: { variant: 'danger', label: 'Admin' },
    cocinero: { variant: 'warning', label: 'Cocinero' },
    mesero: { variant: 'info', label: 'Mesero' },
    cajero: { variant: 'success', label: 'Cajero' },
    cliente: { variant: 'secondary', label: 'Cliente' }
  };

  const config = roleConfig[role] || { variant: 'secondary', label: role };
  return <Badge bg={config.variant} className={`fs-7 ${className}`}>{config.label}</Badge>;
}

export default BadgeRole;