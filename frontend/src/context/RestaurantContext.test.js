// src/context/RestaurantContext.test.js
import { restaurantReducer, initialState } from './RestaurantContext';

describe('restaurantReducer', () => {
  let state;

  beforeEach(() => {
    // Usamos una copia profunda del estado inicial para cada prueba
    state = JSON.parse(JSON.stringify(initialState));
  });

  test('debería manejar ADD_TO_CART', () => {
    const newItem = { id: 1, name: 'Ceviche', price: 35.00, quantity: 1 };
    const action = { type: 'ADD_TO_CART', payload: newItem };
    const newState = restaurantReducer(state, action);

    expect(newState.cart).toHaveLength(1);
    expect(newState.cart[0].name).toBe('Ceviche');
    // cartId es un timestamp, así que solo verificamos que exista
    expect(newState.cart[0]).toHaveProperty('cartId');
  });

  test('debería manejar REMOVE_FROM_CART', () => {
    // Primero, añadimos un item al carrito
    const itemToAdd = { id: 1, name: 'Ceviche', price: 35.00, quantity: 1 };
    const addAction = { type: 'ADD_TO_CART', payload: itemToAdd };
    const addedState = restaurantReducer(state, addAction);
    const cartIdToRemove = addedState.cart[0].cartId;

    // Luego, lo removemos
    const removeAction = { type: 'REMOVE_FROM_CART', payload: cartIdToRemove };
    const newState = restaurantReducer(addedState, removeAction);

    expect(newState.cart).toHaveLength(0);
  });

  test('debería manejar UPDATE_CART_ITEM', () => {
    // Añadimos un item
    const itemToAdd = { id: 2, name: 'Lomo Saltado', price: 28.00, quantity: 1 };
    const addAction = { type: 'ADD_TO_CART', payload: itemToAdd };
    const addedState = restaurantReducer(state, addAction);
    const cartIdToUpdate = addedState.cart[0].cartId;

    // Lo actualizamos (cambiamos la cantidad)
    const updateAction = {
      type: 'UPDATE_CART_ITEM',
      payload: { cartId: cartIdToUpdate, updates: { quantity: 3 } }
    };
    const newState = restaurantReducer(addedState, updateAction);

    expect(newState.cart[0].quantity).toBe(3);
    expect(newState.cart[0].name).toBe('Lomo Saltado');
  });

  test('debería manejar CLEAR_CART', () => {
    // Añadimos varios items
    const itemsToAdd = [
      { id: 1, name: 'Ceviche', price: 35.00, quantity: 1 },
      { id: 2, name: 'Lomo Saltado', price: 28.00, quantity: 2 }
    ];
    let currentState = state;
    itemsToAdd.forEach(item => {
      currentState = restaurantReducer(currentState, { type: 'ADD_TO_CART', payload: item });
    });

    expect(currentState.cart).toHaveLength(2);

    // Limpiamos el carrito
    const clearAction = { type: 'CLEAR_CART' };
    const newState = restaurantReducer(currentState, clearAction);

    expect(newState.cart).toHaveLength(0);
  });

  test('debería manejar SET_INITIAL_DATA', () => {
    const mockMenu = [{ id: 100, name: 'Test Food' }];
    const mockOrders = [{ id: 200, status: 'PENDIENTE' }];
    const action = { type: 'SET_INITIAL_DATA', payload: { menu: mockMenu, orders: mockOrders } };
    const newState = restaurantReducer(state, action);

    expect(newState.menu).toEqual(mockMenu);
    expect(newState.orders).toEqual(mockOrders);
    expect(newState.loading).toBe(false);
  });
});
