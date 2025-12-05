// src/hooks/UseCart.jsx
import { useRestaurant } from '../context/RestaurantContext';
import { calculateCartTotal, getCartItemCount, getCartSummary } from '../utils/CartUtils';

export default function useCart() {
  const { state } = useRestaurant();
  
  const cartSummary = getCartSummary(state.cart);
  
  return {
    ...cartSummary,
    items: state.cart,
    isEmpty: cartSummary.itemCount === 0
  };
}