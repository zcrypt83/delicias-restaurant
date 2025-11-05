// src/pages/SelfOrdering.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

function SelfOrdering() {
  const { state, dispatch } = useRestaurant();
  const { isAuthenticated, user } = useAuth();
  const [selectedTable, setSelectedTable] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);

  const availableTables = state.tables.filter(table => table.status === 'libre');

  const cartTotal = state.cart.reduce((total, item) => {
    const basePrice = item.price;
    const additionsPrice = Object.values(item.customizations || {}).reduce(
      (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
    );
    return total + basePrice + additionsPrice;
  }, 0);

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      alert('Por favor selecciona una mesa');
      return;
    }

    if (state.cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const order = {
      type: 'Mesa',
      tableCode: selectedTable,
      items: state.cart,
      customerName: isAuthenticated ? user.name : 'Cliente Auto-Orden',
      status: 'PENDIENTE'
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Limpiar carrito y mesa seleccionada
    dispatch({ type: 'CLEAR_CART' });
    setSelectedTable('');
    
    alert('¡Orden enviada correctamente! La atenderemos pronto.');
  };

  const formatPrice = (price) => `S/ ${price.toFixed(2)}`;

  return (
    <Container className="py-4 py-md-5">
      <Row>
        <Col lg={8}>
          <div className="mb-4">
            <h1 className="display-5 display-md-4 fw-bold mb-3">Auto-Ordenar</h1>
            <p className="text-muted fs-6 fs-md-5">
              Ordena directamente desde tu mesa. Escanea el código QR o selecciona tu mesa manualmente.
            </p>
          </div>

          {/* Selección de Mesa */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <h5 className="fw-bold mb-3 small">📍 Selecciona tu Mesa</h5>
              <div className="d-flex flex-wrap gap-2">
                {availableTables.map(table => (
                  <Button
                    key={table.code}
                    variant={selectedTable === table.code ? 'warning' : 'outline-warning'}
                    onClick={() => setSelectedTable(table.code)}
                    size="sm"
                    className="fs-7"
                  >
                    Mesa {table.code}
                  </Button>
                ))}
                <Button variant="outline-secondary" onClick={() => setShowTableModal(true)} size="sm" className="fs-7">
                  Ver Todas las Mesas
                </Button>
              </div>
              {selectedTable && (
                <Alert variant="success" className="mt-3 mb-0 py-2 small">
                  ✅ Mesa {selectedTable} seleccionada
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Carrito Actual */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white p-3 p-md-4">
              <h5 className="mb-0 fs-6 fs-md-5">🛒 Tu Orden Actual</h5>
            </Card.Header>
            <Card.Body className="p-3 p-md-4">
              {state.cart.length === 0 ? (
                <div className="text-center py-4">
                  <div className="fs-1 mb-3">🛒</div>
                  <h5 className="h6 h5-md">Tu carrito está vacío</h5>
                  <p className="text-muted small">Agrega items del menú para continuar</p>
                  <Button as="a" href="/menu" variant="warning" size="sm">
                    Explorar Menú
                  </Button>
                </div>
              ) : (
                <>
                  {state.cart.map(item => (
                    <div key={item.cartId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <div className="fw-medium small">{item.name}</div>
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <small className="text-muted">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <div key={key} className="small">• {key}: {typeof value === 'object' ? value.option : value}</div>
                            ))}
                          </small>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-semibold small">{formatPrice(item.price)}</span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.cartId })}
                          className="fs-7"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fs-6 fs-md-5">Total:</h5>
                      <h4 className="text-warning mb-0 fs-5 fs-md-4">{formatPrice(cartTotal)}</h4>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Panel de Acción */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{top: '100px'}}>
            <Card.Body className="text-center p-3 p-md-4">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 p-md-4 d-inline-flex align-items-center justify-content-center mb-3">
                <span className="text-warning fs-1">📱</span>
              </div>
              <h5 className="fw-bold small">Orden Rápida</h5>
              <p className="text-muted small mb-4">
                Completa tu orden en pocos pasos desde tu dispositivo
              </p>

              <div className="d-grid gap-2">
                <Button as="a" href="/menu" variant="outline-warning" size="lg" className="fs-7 fs-md-6">
                  📖 Agregar Más Items
                </Button>
                
                <Button 
                  variant="warning" 
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={!selectedTable || state.cart.length === 0}
                  className="fw-bold fs-7 fs-md-6"
                >
                  ✅ Enviar Orden
                </Button>
              </div>

              {!isAuthenticated && (
                <Alert variant="info" className="mt-3 small py-2">
                  <strong>💡 Tip:</strong> 
                  <a href="/login" className="alert-link"> Inicia sesión</a> para guardar tu historial de órdenes
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Todas las Mesas */}
      <Modal show={showTableModal} onHide={() => setShowTableModal(false)} centered>
        <Modal.Header closeButton className="p-3">
          <Modal.Title className="fs-6 fs-md-5">Estado de Mesas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <Row className="g-2">
            {state.tables.map(table => (
              <Col xs={6} key={table.code}>
                <Card className={`text-center ${
                  table.status === 'libre' ? 'border-success' : 'border-warning'
                }`}>
                  <Card.Body className="p-2 p-md-3">
                    <div className={`fs-4 mb-2 ${
                      table.status === 'libre' ? 'text-success' : 'text-warning'
                    }`}>
                      {table.status === 'libre' ? '✅' : '⏳'}
                    </div>
                    <h6 className="mb-1 small">Mesa {table.code}</h6>
                    <small className={`text-${
                      table.status === 'libre' ? 'success' : 'warning'
                    } small`}>
                      {table.status === 'libre' ? 'Disponible' : 'Ocupada'}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SelfOrdering;