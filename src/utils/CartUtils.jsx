// src/utils/CartUtils.jsx
import { formatPrice } from './Formatters';

export const calculateItemTotal = (item) => {
  const basePrice = item.price || 0;
  const additionsPrice = Object.values(item.customizations || {}).reduce(
    (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
  );
  return (basePrice + additionsPrice) * (item.quantity || 1);
};

export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
};

export const getCartSummary = (cart) => {
  const itemCount = getCartItemCount(cart);
  const total = calculateCartTotal(cart);
  
  return {
    itemCount,
    total,
    formattedTotal: formatPrice(total),
    isEmpty: itemCount === 0
  };
};