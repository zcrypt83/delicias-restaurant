// src/context/RestaurantContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';

const RestaurantContext = createContext();

export const initialState = {
  menu: [],
  cart: [],
  orders: [],
  reservations: [],
  loading: true, // Nuevo estado para la carga inicial
  tables: [
    { code: 'A1', status: 'libre', capacity: 4 },
    { code: 'A2', status: 'libre', capacity: 4 },
    { code: 'A3', status: 'libre', capacity: 2 },
    { code: 'B1', status: 'libre', capacity: 6 },
    { code: 'B2', status: 'libre', capacity: 4 },
    { code: 'B3', status: 'libre', capacity: 2 },
    { code: 'C1', status: 'libre', capacity: 8 },
    { code: 'C2', status: 'libre', capacity: 4 }
  ],
  businessConfig: {
    restaurantName: "Delicias Restaurant",
    address: "Av. Principal 123, Lima",
    phone: "+51 987 654 321",
    openingHours: "Lun-Dom: 12:00-23:00",
    deliveryEnabled: true,
    reservationsEnabled: true
  }
};

function restaurantReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      const { menu, orders } = action.payload;
      return {
        ...state,
        menu,
        orders,
        tables: state.tables.map(table => {
          const order = orders.find(o => o.tableCode === table.code && o.status === 'PENDIENTE');
          return order ? { ...table, status: 'ocupada', currentOrder: order.id } : table;
        }),
        loading: false
      };

    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, cartId: Date.now() }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.cartId !== action.payload)
      };

    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, ...action.payload.updates }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    case 'ADD_ORDER':
      const newOrder = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        items: action.payload.items.map(item => ({
          ...item,
          status: 'PENDIENTE'
        }))
      };

      // Actualizar mesa si es orden de mesa
      let updatedTables = state.tables;
      if (action.payload.type === 'Mesa' && action.payload.tableCode) {
        updatedTables = state.tables.map(table =>
          table.code === action.payload.tableCode
            ? { ...table, status: 'ocupada', currentOrder: newOrder.id }
            : table
        );
      }

      return {
        ...state,
        orders: [...state.orders, newOrder],
        tables: updatedTables
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };

    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === action.payload.itemId
                    ? { ...item, status: action.payload.status }
                    : item
                )
              }
            : order
        )
      };

    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload]
      };

    case 'TOGGLE_ITEM_AVAILABILITY':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload
            ? { ...item, is_available: !item.is_available }
            : item
        )
      };

    case 'TOGGLE_DELIVERY':
      return {
        ...state,
        businessConfig: {
          ...state.businessConfig,
          deliveryEnabled: !state.businessConfig.deliveryEnabled
        }
      };

    case 'TOGGLE_RESERVATIONS':
      return {
        ...state,
        businessConfig: {
          ...state.businessConfig,
          reservationsEnabled: !state.businessConfig.reservationsEnabled
        }
      };

    case 'SET_MENU':
      return {
        ...state,
        menu: Array.isArray(action.payload) ? action.payload : state.menu
      };

    case 'UPDATE_TABLE_STATUS':
      return {
        ...state,
        tables: state.tables.map(table =>
          table.code === action.payload.tableCode
            ? { ...table, status: action.payload.status }
            : table
        )
      };

    default:
      return state;
  }
}

export function RestaurantProvider({ children }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  // Cargar datos iniciales desde la API simulada
  useEffect(() => {
    const loadData = async () => {
      try {
        // Usar las funciones de la API que retornan promesas axios
        const [menuResp, ordersResp] = await Promise.all([
          api.getProducts(),
          api.getAllOrders()
        ]);
        const rawMenu = Array.isArray(menuResp && menuResp.data) ? menuResp.data : [];
        const orders = Array.isArray(ordersResp && ordersResp.data) ? ordersResp.data : [];

        // Normalizar productos: is_available a booleano, asegurarse de modifiers válidos
        const menu = rawMenu.map(item => {
          let modifiers = { obligatorios: [], opcionales: [] };
          try {
            if (item.modifiers) {
              if (typeof item.modifiers === 'string') {
                modifiers = JSON.parse(item.modifiers);
              } else if (typeof item.modifiers === 'object') {
                modifiers = item.modifiers;
              }
            }
          } catch (e) {
            console.warn('Error parsing modifiers for product', item.id, e.message);
          }

          return {
            ...item,
            is_available: !!item.is_available,
            modifiers: {
              obligatorios: Array.isArray(modifiers.obligatorios) ? modifiers.obligatorios : [],
              opcionales: Array.isArray(modifiers.opcionales) ? modifiers.opcionales : []
            },
            preparation_time: item.preparation_time || 10
          };
        });
        dispatch({ type: 'SET_INITIAL_DATA', payload: { menu, orders } });
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
        // Opcional: manejar el estado de error
      }
    };
    loadData();
  }, []);

  // Socket.IO: conectar y escuchar actualizaciones del menú en tiempo real
  useEffect(() => {
    // Determinar URL del servidor (puede venir de REACT_APP_SOCKET_URL o REACT_APP_API_URL)
    const serverBase = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '') : null) || 'http://localhost:5000';
    const socket = io(serverBase);

    socket.on('connect', () => {
      console.log('Socket connected (client):', socket.id);
    });

    socket.on('menuUpdated', (menu) => {
      if (menu && Array.isArray(menu)) {
        dispatch({ type: 'SET_MENU', payload: menu });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected (client)');
    });

    return () => {
      try { socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, [dispatch]);

  const showNotification = useCallback((message, type = 'info') => {
    // Aquí puedes integrar con tu sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
  }, []);

  const value = useMemo(() => ({
    state,
    dispatch,
    showNotification
  }), [state, showNotification]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant debe ser usado dentro de RestaurantProvider');
  }
  return context;
}