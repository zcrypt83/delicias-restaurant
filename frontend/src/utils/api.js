import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth ---
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// --- Products ---
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// --- Orders ---
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getMyOrders = () => api.get('/orders/my-orders');
export const getAllOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

// --- Reservations ---
export const createReservation = (reservationData) => api.post('/reservations', reservationData);
export const getMyReservations = () => api.get('/reservations/my-reservations');
export const getAllReservations = () => api.get('/reservations');
export const updateReservationStatus = (id, status) => api.patch(`/reservations/${id}/status`, { status });
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);


const apiClient = {
  login,
  register,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
};

export default apiClient;