// src/utils/OrderUtils.jsx
import { formatPrice } from './Formatters';

export const calculateOrderTotal = (order) => {
  return order.items.reduce((total, item) => {
    const basePrice = item.price || 0;
    const additionsPrice = Object.values(item.customizations || {}).reduce(
      (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
    );
    return total + (basePrice + additionsPrice) * (item.quantity || 1);
  }, 0);
};

export const getOrderStatusVariant = (status) => {
  const variants = {
    'PENDIENTE': 'warning',
    'CONFIRMADO': 'info', 
    'LISTO': 'primary',
    'PAGADO': 'success',
    'CANCELADO': 'danger'
  };
  return variants[status] || 'secondary';
};

export const getOrderStatusIcon = (status) => {
  const icons = {
    'PENDIENTE': '⏳',
    'CONFIRMADO': '👨‍🍳',
    'LISTO': '🔔', 
    'PAGADO': '✅',
    'CANCELADO': '❌'
  };
  return icons[status] || '📦';
};

export const getElapsedTime = (timestamp) => {
  return Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
};

export const isOrderUrgent = (timestamp, threshold = 30) => {
  return getElapsedTime(timestamp) > threshold;
};