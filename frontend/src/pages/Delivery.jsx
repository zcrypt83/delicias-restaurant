// src/pages/Delivery.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Container, Row, Col, Card, Button, Form, Badge, Alert, 
  ListGroup, Modal, InputGroup, Accordion, Collapse
} from 'react-bootstrap';

function Delivery() {
  const { state, dispatch, showNotification } = useRestaurant();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: '',
    paymentMethod: 'efectivo'
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('25-40');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddresses, setShowAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const baseTime = 25;
    const additionalTime = Math.floor(state.cart.length * 3);
    setEstimatedTime(`${baseTime}-${baseTime + additionalTime}`);
  }, [state.cart.length]);

  // Cargar direcciones guardadas del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const saveAddress = () => {
    if (customerInfo.address && customerInfo.name) {
      const newAddress = {
        id: Date.now(),
        name: customerInfo.name,
        address: customerInfo.address,
        phone: customerInfo.phone
      };
      const updatedAddresses = [...savedAddresses, newAddress].slice(-5); // Guardar solo las últimas 5
      setSavedAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      showNotification('📍 Dirección guardada para futuros pedidos', 'success');
    }
  };

  const selectSavedAddress = (address) => {
    setCustomerInfo(prev => ({
      ...prev,
      name: address.name,
      address: address.address,
      phone: address.phone
    }));
    setShowAddresses(false);
    showNotification('📍 Dirección cargada', 'info');
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      showNotification('👤 Por favor ingresa tu nombre completo', 'error');
      return false;
    }

    if (!customerInfo.phone.trim() || customerInfo.phone.length < 9) {
      showNotification('📞 Por favor ingresa un número de teléfono válido', 'error');
      return false;
    }

    if (orderType === 'delivery' && !customerInfo.address.trim()) {
      showNotification('📍 La dirección es requerida para delivery', 'error');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (state.cart.length === 0) {
      showNotification('🛒 Tu carrito está vacío', 'error');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simular procesamiento
    setTimeout(() => {
      setShowOrderModal(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const confirmOrder = () => {
    const order = {
      id: Date.now(),
      type: orderType === 'delivery' ? 'Delivery' : 'Recoger',
      items: state.cart,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      customerAddress: customerInfo.address,
      specialInstructions: customerInfo.instructions,
      paymentMethod: customerInfo.paymentMethod,
      status: 'CONFIRMADO',
      estimatedTime,
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Guardar dirección si es delivery
    if (orderType === 'delivery' && customerInfo.address) {
      saveAddress();
    }

    showNotification(`✅ ¡Orden de ${orderType} confirmada!`, 'success');
    setShowOrderModal(false);
    
    // Limpiar carrito después de confirmar
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      navigate('/orders');
    }, 2000);
  };

  const formatPrice = (price) => `S/ ${price.toFixed(2)}`;

  const cartTotal = state.cart.reduce((total, item) => {
    const basePrice = item.price;
    const additionsPrice = Object.values(item.customizations || {}).reduce(
      (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
    );
    const quantity = item.quantity || 1;
    return total + (basePrice + additionsPrice) * quantity;
  }, 0);

  const deliveryFee = orderType === 'delivery' ? 5.00 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const quickActions = [
    { label: 'Agregar Más', icon: 'plus-circle', variant: 'outline-warning', action: () => navigate('/menu') },
    { label: 'Ver Carrito', icon: 'cart', variant: 'outline-info', action: () => navigate('/cart') },
    { label: 'Auto-Ordenar', icon: 'table', variant: 'outline-success', action: () => navigate('/self-ordering') }
  ];

  if (!state.businessConfig.deliveryEnabled && orderType === 'delivery') {
    return (
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-lg bg-gradient-warning text-white animated-card">
              <Card.Body className="py-5">
                <div className="display-1 mb-4">🚫</div>
                <h1 className="h2 mb-4">Delivery No Disponible</h1>
                <p className="lead mb-4">
                  El servicio de delivery está temporalmente desactivado. 
                  Puedes recoger tu pedido en nuestro local.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Button 
                    variant="light" 
                    onClick={() => setOrderType('pickup')}
                    className="fw-bold"
                  >
                    <i className="bi bi-bag me-2"></i>
                    Cambiar a Recoger
                  </Button>
                  <Button 
                    variant="outline-light" 
                    onClick={() => navigate('/self-ordering')}
                  >
                    <i className="bi bi-table me-2"></i>
                    Ordenar en Mesa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xl={10}>
          {/* Header */}
          <Row className="text-center mb-4">
            <Col>
              <div className="display-1 mb-3">
                {orderType === 'delivery' ? '🚚' : '📦'}
              </div>
              <h1 className="h2 mb-3">
                {orderType === 'delivery' ? 'Delivery a Domicilio' : 'Recoger en Local'}
              </h1>
              <p className="text-muted">
                {orderType === 'delivery' 
                  ? 'Recibe tu pedido en la comodidad de tu hogar' 
                  : 'Recoge tu pedido en nuestro local'
                }
              </p>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm bg-light">
                <Card.Body className="p-3">
                  <Row className="g-2 text-center">
                    {quickActions.map((action, index) => (
                      <Col key={index} xs={6} md={4}>
                        <Button
                          variant={action.variant}
                          size="sm"
                          onClick={action.action}
                          className="w-100 fs-7"
                        >
                          <i className={`bi bi-${action.icon} me-1`}></i>
                          {action.label}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 g-md-4">
            {/* Tipo de Orden */}
            <Col xs={12}>
              <Card className="border-0 shadow-sm animated-card">
                <Card.Body className="p-3 p-md-4">
                  <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    <Button
                      variant={orderType === 'delivery' ? 'warning' : 'outline-warning'}
                      onClick={() => setOrderType('delivery')}
                      disabled={!state.businessConfig.deliveryEnabled}
                      className="py-3 hover-scale"
                    >
                      <i className="bi bi-truck me-2"></i>
                      Delivery
                      {!state.businessConfig.deliveryEnabled && (
                        <Badge bg="secondary" className="ms-1 fs-7">No disponible</Badge>
                      )}
                    </Button>
                    <Button
                      variant={orderType === 'pickup' ? 'warning' : 'outline-warning'}
                      onClick={() => setOrderType('pickup')}
                      className="py-3 hover-scale"
                    >
                      <i className="bi bi-bag me-2"></i>
                      Para Recoger
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Formulario y Resumen */}
            <Col md={7}>
              <Card className="border-0 shadow-sm h-100 animated-card">
                <Card.Header className="bg-white">
                  <h5 className="mb-0 p-3 p-md-4">
                    <i className="bi bi-person-circle me-2 text-warning"></i>
                    Información de {orderType === 'delivery' ? 'Envío' : 'Recojo'}
                  </h5>
                </Card.Header>
                <Card.Body className="p-3 p-md-4">
                  <Form onSubmit={handlePlaceOrder}>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Nombre Completo *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            required
                            size="lg"
                            placeholder="Ingresa tu nombre completo"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Teléfono *
                          </Form.Label>
                          <InputGroup>
                            <InputGroup.Text>+51</InputGroup.Text>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={customerInfo.phone}
                              onChange={handleInputChange}
                              required
                              size="lg"
                              placeholder="987654321"
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>

                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            size="lg"
                            placeholder="tu@email.com"
                          />
                        </Form.Group>
                      </Col>

                      {orderType === 'delivery' && (
                        <Col xs={12}>
                          <Form.Group>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <Form.Label className="fw-semibold mb-0">
                                Dirección de Delivery *
                              </Form.Label>
                              {savedAddresses.length > 0 && (
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => setShowAddresses(!showAddresses)}
                                  className="fs-7"
                                >
                                  <i className={`bi bi-${showAddresses ? 'chevron-up' : 'chevron-down'} me-1`}></i>
                                  Direcciones Guardadas
                                </Button>
                              )}
                            </div>
                            
                            <Collapse in={showAddresses}>
                              <Card className="mb-3 border-0 bg-light">
                                <Card.Body className="p-2">
                                  {savedAddresses.map(address => (
                                    <Button
                                      key={address.id}
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => selectSavedAddress(address)}
                                      className="me-2 mb-1 fs-7"
                                    >
                                      <i className="bi bi-geo-alt me-1"></i>
                                      {address.name}
                                    </Button>
                                  ))}
                                </Card.Body>
                              </Card>
                            </Collapse>

                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="address"
                              value={customerInfo.address}
                              onChange={handleInputChange}
                              required
                              placeholder="Ingresa tu dirección completa para el delivery"
                            />
                            <Form.Text className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Incluye referencia, urbanización, etc.
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      )}

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Método de Pago
                          </Form.Label>
                          <Form.Select
                            name="paymentMethod"
                            value={customerInfo.paymentMethod}
                            onChange={handleInputChange}
                            size="lg"
                          >
                            <option value="efectivo">💵 Efectivo</option>
                            <option value="yape">💜 Yape</option>
                            <option value="plin">🟢 Plin</option>
                            <option value="tarjeta">💳 Tarjeta</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-chat-text me-1"></i>
                            Instrucciones Especiales
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="instructions"
                            value={customerInfo.instructions}
                            onChange={handleInputChange}
                            placeholder="Alergias, preferencias, instrucciones de entrega, etc."
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Resumen del Pedido */}
            <Col md={5}>
              <Card className="border-0 shadow-sm sticky-md-top animated-card" style={{ top: '100px' }}>
                <Card.Header className="bg-warning text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-receipt me-2"></i>
                    Resumen del Pedido
                    <Badge bg="light" text="dark" className="ms-auto">
                      {state.cart.length} items
                    </Badge>
                  </h5>
                </Card.Header>
                <Card.Body>
                  {state.cart.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="fs-1 mb-3">🛒</div>
                      <p className="text-muted mb-3">Tu carrito está vacío</p>
                      <Button
                        onClick={() => navigate('/menu')}
                        variant="outline-warning"
                        className="w-100"
                      >
                        <i className="bi bi-menu-up me-2"></i>
                        Ver Menú
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <ListGroup variant="flush">
                          {state.cart.map(item => {
                            const itemTotal = (item.price + Object.values(item.customizations || {}).reduce(
                              (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
                            )) * (item.quantity || 1);
                            
                            return (
                              <ListGroup.Item key={item.cartId} className="px-0 py-2">
                                <Row className="align-items-center">
                                  <Col xs="auto">
                                    <div className="fs-4">{item.image}</div>
                                  </Col>
                                  <Col>
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <h6 className="mb-1 fs-6">{item.name}</h6>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                          <Badge bg="outline-secondary" className="text-dark fs-7">
                                            x{item.quantity || 1}
                                          </Badge>
                                          <Badge bg="outline-warning" className="text-dark fs-7">
                                            {formatPrice(item.price)}
                                          </Badge>
                                        </div>
                                      </div>
                                      <span className="fw-semibold text-warning fs-6">
                                        {formatPrice(itemTotal)}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </div>
                      
                      <div className="border-top pt-3 mt-2">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Subtotal:</span>
                          <span>{formatPrice(cartTotal)}</span>
                        </div>
                        {orderType === 'delivery' && (
                          <div className="d-flex justify-content-between mb-1">
                            <span>🚚 Delivery:</span>
                            <span>{formatPrice(deliveryFee)}</span>
                          </div>
                        )}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold fs-5">
                          <span>Total:</span>
                          <span className="text-warning">{formatPrice(finalTotal)}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handlePlaceOrder}
                        variant="warning"
                        size="lg"
                        className="w-100 mt-3 fw-bold py-3 pulse-on-hover"
                        disabled={state.cart.length === 0 || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>
                            Confirmar Pedido
                          </>
                        )}
                      </Button>

                      <Alert variant="info" className="mt-3 mb-0 small">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Entrega estimada:</strong> {estimatedTime} minutos
                      </Alert>

                      {orderType === 'delivery' && (
                        <Alert variant="success" className="mt-2 mb-0 small">
                          <i className="bi bi-geo-alt me-2"></i>
                          <strong>Zona de delivery:</strong> Lima Metropolitana
                        </Alert>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Order Confirmation Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered className="animated-modal">
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>
            <i className="bi bi-check-circle me-2"></i>
            Confirmar Pedido
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="fs-1 text-success mb-3">✅</div>
            <h5>¿Confirmar tu pedido de {orderType}?</h5>
            <p className="text-muted">
              {orderType === 'delivery' 
                ? `Tu pedido llegará en ${estimatedTime} minutos a ${customerInfo.address}`
                : 'Puedes recoger tu pedido en nuestro local'
              }
            </p>
          </div>
          
          <Card className="border-0 bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total a pagar:</span>
                <span className="text-warning">{formatPrice(finalTotal)}</span>
              </div>
              <div className="small text-muted">
                <i className="bi bi-credit-card me-1"></i>
                Método: {customerInfo.paymentMethod}
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)} className="flex-fill">
            <i className="bi bi-arrow-left me-1"></i>
            Revisar
          </Button>
          <Button variant="warning" onClick={confirmOrder} className="flex-fill pulse-on-hover">
            <i className="bi bi-check-lg me-1"></i>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Delivery;