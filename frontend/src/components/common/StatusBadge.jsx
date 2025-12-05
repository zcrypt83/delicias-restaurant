// src/components/common/StatusBadge.jsx
import React from 'react';
import { Badge } from 'react-bootstrap';
import { getOrderStatusVariant, getOrderStatusIcon } from '../../utils/OrderUtils';

function StatusBadge({ 
  status, 
  type = 'order', 
  showIcon = true,
  className = '' 
}) {
  const getStatusConfig = () => {
    if (type === 'order') {
      return {
        variant: getOrderStatusVariant(status),
        icon: getOrderStatusIcon(status),
        text: status
      };
    }
    
    // Para otros tipos (table, item, etc.)
    const configs = {
      table: {
        libre: { variant: 'success', icon: '✅', text: 'Libre' },
        ocupada: { variant: 'warning', icon: '⏳', text: 'Ocupada' },
        reservada: { variant: 'info', icon: '📅', text: 'Reservada' }
      },
      item: {
        disponible: { variant: 'success', icon: '🟢', text: 'Disponible' },
        agotado: { variant: 'danger', icon: '🔴', text: 'Agotado' }
      }
    };
    
    return configs[type]?.[status] || { variant: 'secondary', icon: '❓', text: status };
  };

  const config = getStatusConfig();

  return (
    <Badge bg={config.variant} className={className}>
      {showIcon && <span className="me-1">{config.icon}</span>}
      {config.text}
    </Badge>
  );
}

export default StatusBadge;