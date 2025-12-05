// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Container, Row, Col, Card, Button, ListGroup, Badge, Alert, 
  Modal, ProgressBar, Toast, ToastContainer, InputGroup, Form,
  Fade, Collapse
} from 'react-bootstrap';

function Cart() {
  const { state, dispatch, showNotification } = useRestaurant();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [animateItems, setAnimateItems] = useState({});
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const formatPrice = (price) => {
    return `S/ ${price.toFixed(2)}`;
  };

  useEffect(() => {
    if (state.cart.length > 0) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.cart.length]);

  // Generar sugerencias basadas en el carrito actual
  useEffect(() => {
    if (state.cart.length > 0) {
      const categoriesInCart = [...new Set(state.cart.map(item => item.category))];
      const suggested = state.menu
        .filter(item => 
          !state.cart.some(cartItem => cartItem.id === item.id) &&
          categoriesInCart.includes(item.category) &&
          item.is_available
        )
        .slice(0, 3);
      setSuggestedItems(suggested);
    }
  }, [state.cart, state.menu]);

  const removeFromCart = (cartId, itemName) => {
    setAnimateItems(prev => ({ ...prev, [cartId]: 'removing' }));
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
      showNotification(`🗑️ ${itemName} removido del carrito`, 'warning');
      setAnimateItems(prev => {
        const newState = { ...prev };
        delete newState[cartId];
        return newState;
      });
    }, 300);
  };

  const updateQuantity = (cartId, newQuantity, itemName) => {
    if (newQuantity < 1) {
      removeFromCart(cartId, itemName);
      return;
    }
    
    setAnimateItems(prev => ({ ...prev, [cartId]: 'updating' }));
    
    dispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {
        cartId,
        updates: { quantity: newQuantity }
      }
    });
    
    setTimeout(() => {
      setAnimateItems(prev => {
        const newState = { ...prev };
        delete newState[cartId];
        return newState;
      });
    }, 200);
    
    if (newQuantity > 1) {
      showNotification(`🔄 Cantidad de ${itemName} actualizada`, 'info');
    }
  };

  const calculateItemTotal = (item) => {
    const basePrice = item.price;
    const additionsPrice = Object.values(item.customizations || {}).reduce(
      (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
    );
    const quantity = item.quantity || 1;
    return (basePrice + additionsPrice) * quantity;
  };

  const applyPromoCode = () => {
    const promos = {
      'DELICIAS10': 10,
      'BIENVENIDO15': 15,
      'PERUANO20': 20
    };
    
    if (promos[promoCode.toUpperCase()]) {
      setDiscount(promos[promoCode.toUpperCase()]);
      showNotification(`🎉 ¡Cupón ${promoCode.toUpperCase()} aplicado! ${promos[promoCode.toUpperCase()]}% de descuento`, 'success');
      setShowPromoInput(false);
      setPromoCode('');
    } else {
      showNotification('❌ Código promocional inválido', 'error');
    }
  };

  const addSuggestedItem = (item) => {
    if (item.modifiers && Array.isArray(item.modifiers.obligatorios) && item.modifiers.obligatorios.length > 0) {
      showNotification(`⚙️ Personaliza "${item.name}" antes de agregar`, 'info');
      navigate('/menu');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...item,
        customizations: {},
        cartId: Date.now()
      }
    });
    showNotification(`✅ "${item.name}" agregado al carrito`, 'success');
  };

  const quickQuantityUpdate = (cartId, change) => {
    const item = state.cart.find(item => item.cartId === cartId);
    if (item) {
      const newQuantity = (item.quantity || 1) + change;
      updateQuantity(cartId, newQuantity, item.name);
    }
  };

  const cartSubtotal = state.cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  const discountAmount = (cartSubtotal * discount) / 100;
  const cartTotal = cartSubtotal - discountAmount;

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setShowClearModal(false);
    showNotification('🗑️ Carrito vaciado', 'warning');
  };

  const getCartProgress = () => {
    const itemCount = state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return Math.min((itemCount / 10) * 100, 100);
  };

  const getProgressVariant = () => {
    const progress = getCartProgress();
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'info';
  };

  const getProgressMessage = () => {
    const progress = getCartProgress();
    if (progress >= 80) return '🎉 ¡Pedido ideal casi listo!';
    if (progress >= 50) return '📈 ¡Sigue agregando items!';
    return '🛒 ¡Sigue comprando!';
  };

  if (state.cart.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="display-4 display-md-1 text-muted mb-4 animate-bounce">🛒</div>
            <h1 className="h3 h2-md mb-4 text-gradient">Tu carrito está vacío</h1>
            <Alert variant="info" className="mb-4 border-0 shadow-sm">
              <Alert.Heading className="h5 h6-md">¡Descubre nuestros sabores!</Alert.Heading>
              <p className="mb-0 small">
                Explora nuestro menú y déjate sorprender por los auténticos sabores peruanos.
              </p>
            </Alert>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Button
                onClick={() => navigate('/menu')}
                size="lg"
                className="btn-warning px-4 fw-bold shadow-hover pulse-animation"
                style={{ 
                  background: 'linear-gradient(45deg, #ffc107, #ff6b00)',
                  border: 'none'
                }}
              >
                <i className="bi bi-menu-up me-2"></i>
                Explorar Menú
              </Button>
              <Button
                onClick={() => navigate('/self-ordering')}
                variant="outline-warning"
                size="lg"
                className="px-4 fw-bold"
              >
                <i className="bi bi-table me-2"></i>
                Ordenar en Mesa
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-3 py-md-4">
      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg="success" delay={3000} autohide>
          <Toast.Header className="bg-success text-white">
            <strong className="me-auto small">🛒 Carrito Actualizado</strong>
          </Toast.Header>
          <Toast.Body className="text-white small">
            Tienes {state.cart.length} {state.cart.length === 1 ? 'item' : 'items'} en tu carrito
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Progress Bar */}
      <Card className="border-0 shadow-sm mb-4 bg-gradient-primary animated-card">
        <Card.Body className="text-center py-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted small">Tu progreso de compra</small>
            <Badge bg="warning" text="dark" className="fs-7 pulse-badge">
              {state.cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
            </Badge>
          </div>
          <ProgressBar 
            now={getCartProgress()} 
            variant={getProgressVariant()} 
            animated 
            style={{ height: '8px' }}
            className="mb-2"
          />
          <small className="text-success mt-2 d-block small fw-semibold">
            {getProgressMessage()}
          </small>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 h2-md mb-1 text-gradient">Tu Carrito</h1>
              <p className="text-muted mb-0 small">Revisa y confirma tu pedido</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="warning" text="dark" className="fs-7 fs-md-6 px-3 py-2 pulse-badge">
                <i className="bi bi-basket me-1"></i>
                {state.cart.length} {state.cart.length === 1 ? 'item' : 'items'}
              </Badge>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="fs-7"
              >
                <i className={`bi bi-chevron-${showQuickActions ? 'up' : 'down'} me-1`}></i>
                Acciones
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Collapse in={showQuickActions}>
        <Card className="border-0 shadow-sm mb-4 bg-light">
          <Card.Body className="p-3">
            <Row className="g-2 text-center">
              <Col xs={6} md={3}>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => navigate('/menu')}
                  className="w-100 fs-7"
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  Agregar Más
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setShowPromoInput(true)}
                  className="w-100 fs-7"
                >
                  <i className="bi bi-tag me-1"></i>
                  Cupón
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => navigate('/self-ordering')}
                  className="w-100 fs-7"
                >
                  <i className="bi bi-cup-hot me-1"></i>
                  Ordenar Mesa
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                  className="w-100 fs-7"
                >
                  <i className="bi bi-trash me-1"></i>
                  Vaciar Todo
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Collapse>

      <Row className="g-3 g-md-4">
        {/* Lista de Items */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm animated-card">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center p-3 p-md-4">
              <h5 className="mb-0 fs-6 fs-md-5">
                <i className="bi bi-list-check me-2"></i>
                Items del Pedido
              </h5>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="fs-7"
                >
                  <i className="bi bi-tag me-1"></i>
                  Cupón
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                  className="fs-7 shake-on-hover"
                >
                  <i className="bi bi-trash me-1"></i>
                  Vaciar Todo
                </Button>
              </div>
            </Card.Header>
            <ListGroup variant="flush">
              {state.cart.map(item => (
                <Fade in={!animateItems[item.cartId]} key={item.cartId}>
                  <ListGroup.Item 
                    className={`p-3 p-md-4 hover-lift ${animateItems[item.cartId] ? 'item-removing' : ''}`}
                  >
                    <Row className="align-items-start">
                      <Col xs="auto" className="pe-0">
                        <div 
                          className="fs-4 fs-md-2 rounded-circle bg-light d-flex align-items-center justify-content-center item-image"
                          style={{ width: '50px', height: '50px' }}
                        >
                          {item.image}
                        </div>
                      </Col>
                      <Col>
                        <Row className="g-2">
                          <Col>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="mb-1 fs-6 fs-md-5">{item.name}</h5>
                                <Badge bg="outline-secondary" className="text-dark fs-7">
                                  {formatPrice(item.price)}
                                </Badge>
                              </div>
                              <span className="h5 h4-md text-warning mb-0 fw-bold price-animation">
                                {formatPrice(calculateItemTotal(item))}
                              </span>
                            </div>
                            
                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                              <Collapse in={true}>
                                <Card className="mt-2 border-0 bg-light">
                                  <Card.Body className="py-2">
                                    <small className="text-muted">
                                      <strong className="text-dark">Personalizaciones:</strong>
                                      {Object.entries(item.customizations).map(([key, value]) => (
                                        <div key={key} className="ms-2">
                                          • {typeof value === 'object' ? `${key}: ${value.option}` : key}
                                          {typeof value === 'number' && value > 0 && ` (+${formatPrice(value)})`}
                                        </div>
                                      ))}
                                    </small>
                                  </Card.Body>
                                </Card>
                              </Collapse>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div className="d-flex align-items-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => quickQuantityUpdate(item.cartId, -1)}
                                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm fs-7 quantity-btn"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  -
                                </Button>
                                <span className="mx-3 fw-semibold fs-6 bg-light px-3 py-1 rounded quantity-display">
                                  {item.quantity || 1}
                                </span>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => quickQuantityUpdate(item.cartId, 1)}
                                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm fs-7 quantity-btn"
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => quickQuantityUpdate(item.cartId, 2)}
                                  className="ms-2 fs-7"
                                >
                                  +2
                                </Button>
                              </div>
                              
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => navigate('/menu')}
                                  className="fs-7"
                                >
                                  <i className="bi bi-pencil me-1"></i>
                                  Editar
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removeFromCart(item.cartId, item.name)}
                                  className="fs-7 remove-btn"
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </Fade>
              ))}
            </ListGroup>
          </Card>
          
          {/* Sugerencias Basadas en el Carrito */}
          {suggestedItems.length > 0 && (
            <Card className="mt-4 border-0 shadow-sm animated-card">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0 fs-6 fs-md-5">
                  <i className="bi bi-lightbulb me-2"></i>
                  Te podría gustar
                </h5>
              </Card.Header>
              <Card.Body className="p-3">
                <Row className="g-2">
                  {suggestedItems.map(item => (
                    <Col key={item.id} xs={12} md={4}>
                      <Card className="border-0 shadow-sm h-100 hover-scale">
                        <Card.Body className="text-center p-2">
                          <div className="fs-3 text-warning mb-2">{item.image}</div>
                          <h6 className="fw-bold small mb-1">{item.name}</h6>
                          <Badge bg="outline-warning" className="text-dark fs-7 mb-2">
                            {formatPrice(item.price)}
                          </Badge>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => addSuggestedItem(item)}
                              className="flex-fill fs-7"
                            >
                              <i className="bi bi-plus-circle me-1"></i>
                              Agregar
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => navigate('/menu')}
                              className="fs-7"
                              style={{ width: '35px' }}
                            >
                              <i className="bi bi-eye"></i>
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
          
          {/* Cupón de Descuento */}
          <Collapse in={showPromoInput}>
            <Card className="mt-3 border-0 shadow-sm animated-card">
              <Card.Header className="bg-warning text-white">
                <h6 className="mb-0 fs-6">
                  <i className="bi bi-tag me-2"></i>
                  Cupón de Descuento
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <InputGroup>
                  <Form.Control
                    placeholder="Ingresa tu código promocional"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    size="sm"
                    className="promo-input"
                  />
                  <Button variant="warning" onClick={applyPromoCode} size="sm" className="pulse-on-hover">
                    Aplicar
                  </Button>
                </InputGroup>
                <small className="text-muted mt-2 d-block small">
                  Códigos disponibles: <span className="text-success fw-bold">DELICIAS10</span>,{' '}
                  <span className="text-primary fw-bold">BIENVENIDO15</span>,{' '}
                  <span className="text-warning fw-bold">PERUANO20</span>
                </small>
              </Card.Body>
            </Card>
          </Collapse>

          {/* Botones de Navegación */}
          <div className="mt-3 d-flex flex-column flex-md-row gap-2">
            <Button
              variant="outline-warning"
              onClick={() => navigate('/menu')}
              className="d-flex align-items-center justify-content-center shadow-sm hover-scale flex-fill"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Seguir agregando items
            </Button>
            <Button
              variant="outline-info"
              onClick={() => navigate('/self-ordering')}
              className="d-flex align-items-center justify-content-center shadow-sm hover-scale flex-fill"
            >
              <i className="bi bi-cup-hot me-2"></i>
              Ordenar en Mesa
            </Button>
          </div>
        </Col>

        {/* Resumen y Acciones */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top animated-card" style={{ top: '100px' }}>
            <Card.Header className="bg-warning text-white p-3 p-md-4">
              <h5 className="mb-0 fs-6 fs-md-5">
                <i className="bi bi-receipt me-2"></i>
                Resumen del Pedido
              </h5>
            </Card.Header>
            <Card.Body className="p-3 p-md-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small">Subtotal:</span>
                  <span className="small">{formatPrice(cartSubtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <Fade in={discount > 0}>
                    <>
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span className="small">Descuento ({discount}%):</span>
                        <span className="small">-{formatPrice(discountAmount)}</span>
                      </div>
                      <hr />
                    </>
                  </Fade>
                )}
                
                <div className="d-flex justify-content-between fw-bold fs-6 fs-md-5 total-price">
                  <span>Total:</span>
                  <span className="text-warning">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button
                  onClick={() => navigate('/self-ordering')}
                  variant="success"
                  size="lg"
                  className="d-flex align-items-center justify-content-center py-2 py-md-3 shadow-hover pulse-on-hover"
                >
                  <i className="bi bi-cup-hot me-2"></i>
                  Ordenar en Mesa
                </Button>
                <Button
                  onClick={() => navigate('/delivery')}
                  variant="primary"
                  size="lg"
                  className="d-flex align-items-center justify-content-center py-2 py-md-3 shadow-hover pulse-on-hover"
                >
                  <i className="bi bi-truck me-2"></i>
                  Delivery/Recoger
                </Button>
                <Button
                  onClick={() => navigate('/menu')}
                  variant="outline-warning"
                  size="lg"
                  className="d-flex align-items-center justify-content-center py-2 py-md-3"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar Más Items
                </Button>
              </div>

              <Alert variant="info" className="mt-3 mb-2 small border-0 animated-card">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Entrega rápida:</strong> 25-40 min • <strong>Pago seguro</strong>
              </Alert>

              {/* Indicador de ahorro */}
              {discount > 0 && (
                <Alert variant="success" className="mb-0 small border-0">
                  <i className="bi bi-piggy-bank me-2"></i>
                  <strong>¡Estás ahorrando {formatPrice(discountAmount)}!</strong>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Clear Cart Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered className="animated-modal">
        <Modal.Header closeButton className="border-0 p-3 p-md-4">
          <Modal.Title className="fs-6 fs-md-5 text-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Vaciar Carrito
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="fs-1 mb-3 animate-bounce">🗑️</div>
            <h5 className="fs-6 fs-md-5">¿Estás seguro de vaciar el carrito?</h5>
            <p className="text-muted small">
              Se eliminarán {state.cart.length} items de tu pedido.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)} size="sm" className="flex-fill">
            <i className="bi bi-x-circle me-1"></i>
            Cancelar
          </Button>
          <Button variant="danger" onClick={clearCart} size="sm" className="flex-fill shake-on-hover">
            <i className="bi bi-trash me-1"></i>
            Vaciar Carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Cart;