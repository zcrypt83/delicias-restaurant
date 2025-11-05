// src/components/common/PriceFormatter.jsx
import React from 'react';
import { formatPrice } from '../../utils/Formatters';

function PriceFormatter({ price, currency = 'S/', className = '' }) {
  return <span className={className}>{formatPrice(price, currency)}</span>;
}

export default PriceFormatter;
export { formatPrice };