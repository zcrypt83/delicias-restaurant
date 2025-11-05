// src/context/RestaurantContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const RestaurantContext = createContext();

const initialState = {
  menu: [],
  cart: [],
  orders: [],
  reservations: [],
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

// Datos de ejemplo para el menú
const sampleMenu = [
  {
    id: 1,
    name: "Ceviche Mixto",
    description: "Pescado, mariscos, cebolla, camote, choclo, canchita",
    price: 35.00,
    category: "Ceviches",
    preparation_time: 15,
    image: "🐟",
    is_available: true,
    modifiers: {
      obligatorios: [
        {
          name: "Picante",
          options: [
            { name: "Suave", price: 0 },
            { name: "Medio", price: 0 },
            { name: "Picante", price: 0 }
          ]
        }
      ],
      opcionales: [
        { name: "Extra Camote", price: 3.00 },
        { name: "Extra Choclo", price: 2.50 }
      ]
    }
  },
  {
    id: 2,
    name: "Lomo Saltado",
    description: "Lomo de res, cebolla, tomate, papas fritas, arroz",
    price: 28.00,
    category: "Platos de Fondo",
    preparation_time: 20,
    image: "🥩",
    is_available: true,
    modifiers: {
      obligatorios: [
        {
          name: "Punto de Cocción",
          options: [
            { name: "Poco hecho", price: 0 },
            { name: "Medio", price: 0 },
            { name: "Bien hecho", price: 0 }
          ]
        }
      ],
      opcionales: [
        { name: "Extra Salsa", price: 2.00 },
        { name: "Sin Cebolla", price: 0 }
      ]
    }
  },
  {
    id: 3,
    name: "Pisco Sour",
    description: "Pisco, limón, jarabe de goma, clara de huevo, amargo de angostura",
    price: 18.00,
    category: "Bebidas",
    preparation_time: 5,
    image: "🍸",
    is_available: true,
    modifiers: {
      obligatorios: [],
      opcionales: [
        { name: "Extra Pisco", price: 5.00 },
        { name: "Sin Azúcar", price: 0 }
      ]
    }
  },
  {
    id: 4,
    name: "Causa Limeña",
    description: "Papa amarilla, pollo/atún, palta, mayonesa, limón",
    price: 22.00,
    category: "Entradas",
    preparation_time: 10,
    image: "🥔",
    is_available: true,
    modifiers: {
      obligatorios: [
        {
          name: "Relleno",
          options: [
            { name: "Pollo", price: 0 },
            { name: "Atún", price: 0 },
            { name: "Vegetariano", price: 0 }
          ]
        }
      ],
      opcionales: []
    }
  },
  {
    id: 5,
    name: "Arroz con Mariscos",
    description: "Arroz, mariscos mixtos, culantro, ají amarillo",
    price: 32.00,
    category: "Platos de Fondo",
    preparation_time: 25,
    image: "🍚",
    is_available: false,
    modifiers: {
      obligatorios: [],
      opcionales: [
        { name: "Extra Mariscos", price: 8.00 }
      ]
    }
  },
  {
    id: 6,
    name: "Chicha Morada",
    description: "Bebida tradicional de maíz morado",
    price: 8.00,
    category: "Bebidas",
    preparation_time: 2,
    image: "🍷",
    is_available: true,
    modifiers: {
      obligatorios: [],
      opcionales: [
        { name: "Extra Hielo", price: 0 }
      ]
    }
  }
];

// Datos de ejemplo para órdenes
const sampleOrders = [
  {
    id: 1001,
    type: "Mesa",
    tableCode: "A1",
    items: [
      {
        id: 1,
        name: "Ceviche Mixto",
        price: 35.00,
        image: "🐟",
        quantity: 1,
        status: "PENDIENTE",
        customizations: {
          "Picante": { option: "Medio", price: 0 }
        }
      },
      {
        id: 3,
        name: "Pisco Sour",
        price: 18.00,
        image: "🍸",
        quantity: 2,
        status: "LISTO",
        customizations: {}
      }
    ],
    customerName: "Juan Pérez",
    status: "PENDIENTE",
    timestamp: new Date().toISOString()
  },
  {
    id: 1002,
    type: "Delivery",
    items: [
      {
        id: 2,
        name: "Lomo Saltado",
        price: 28.00,
        image: "🥩",
        quantity: 1,
        status: "CONFIRMADO",
        customizations: {
          "Punto de Cocción": { option: "Medio", price: 0 }
        }
      }
    ],
    customerName: "María García",
    customerPhone: "987654321",
    customerAddress: "Av. Ejemplo 456",
    status: "CONFIRMADO",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 1003,
    type: "Mesa",
    tableCode: "B2",
    items: [
      {
        id: 4,
        name: "Causa Limeña",
        price: 22.00,
        image: "🥔",
        quantity: 1,
        status: "LISTO",
        customizations: {
          "Relleno": { option: "Pollo", price: 0 }
        }
      },
      {
        id: 6,
        name: "Chicha Morada",
        price: 8.00,
        image: "🍷",
        quantity: 1,
        status: "LISTO",
        customizations: {}
      }
    ],
    customerName: "Carlos López",
    status: "LISTO",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

function restaurantReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_DATA':
      return {
        ...state,
        menu: sampleMenu,
        orders: sampleOrders,
        tables: state.tables.map(table => {
          const order = sampleOrders.find(o => o.tableCode === table.code && o.status === 'PENDIENTE');
          return order ? { ...table, status: 'ocupada', currentOrder: order.id } : table;
        })
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

  // Inicializar datos al cargar
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_DATA' });
  }, []);

  const showNotification = (message, type = 'info') => {
    // Aquí puedes integrar con tu sistema de notificaciones
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  return (
    <RestaurantContext.Provider value={{ state, dispatch, showNotification }}>
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