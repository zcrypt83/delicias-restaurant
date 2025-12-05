// src/utils/Formatters.jsx
export const formatPrice = (price, currency = 'S/') => {
  return `${currency} ${price.toFixed(2)}`;
};

export const formatPhone = (phone) => {
  return `+51 ${phone}`;
};

export const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatOrderId = (id) => `#${id}`;

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};