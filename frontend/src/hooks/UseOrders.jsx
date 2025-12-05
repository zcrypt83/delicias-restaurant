// src/hooks/UseOrders.jsx
import { useRestaurant } from '../context/RestaurantContext';
import { calculateOrderTotal, getOrderStatusVariant, getElapsedTime } from '../utils/OrderUtils';

export default function useOrders() {
  const { state } = useRestaurant();
  
  const getTodayOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return state.orders.filter(order => order.timestamp.startsWith(today));
  };

  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status);
  };

  const getTableOrders = () => {
    return state.orders.filter(order => order.type === 'Mesa');
  };

  return {
    allOrders: state.orders,
    todayOrders: getTodayOrders(),
    getOrdersByStatus,
    getTableOrders,
    calculateOrderTotal,
    getOrderStatusVariant,
    getElapsedTime
  };
}