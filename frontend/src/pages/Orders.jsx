// src/pages/Orders.jsx
import React from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';

function Orders() {
  const { user } = useAuth();
  const { state } = useRestaurant();

  const userOrders = state.orders
    .filter(order => order.customerName === user?.name)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const formatPrice = (price) => `S/ ${price.toFixed(2)}`;

  const getStatusVariant = (status) => {
    const variants = {
      'CONFIRMADO': 'warning',
      'PREPARANDO': 'info',
      'LISTO': 'primary',
      'ENTREGADO': 'success',
      'CANCELADO': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => {
      const itemTotal = item.price + Object.values(item.customizations || {}).reduce(
        (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
      );
      return total + itemTotal * (item.quantity || 1);
    }, 0);
  };

  return (
    <Container className="py-3 py-md-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-4">
            <h1 className="h3 h2-md mb-3">Mis Pedidos</h1>
            <p className="text-muted small">Historial y estado de tus pedidos</p>
          </div>

          {userOrders.length === 0 ? (
            <Card className="border-0 shadow-sm text-center py-5">
              <Card.Body>
                <div className="fs-1 mb-3">📝</div>
                <h4 className="fw-bold mb-3 h5 h4-md">Aún no tienes pedidos</h4>
                <p className="text-muted mb-4 small">
                  Realiza tu primer pedido y podrás verlo aquí
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <Button as="a" href="/menu" variant="warning" size="sm">
                    Ver Menú
                  </Button>
                  <Button as="a" href="/self-ordering" variant="outline-warning" size="sm">
                    Auto-Ordenar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-3">
              {userOrders.map(order => {
                const total = calculateOrderTotal(order);
                const elapsedTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000);

                return (
                  <Card key={order.id} className="border-0 shadow-sm">
                    <Card.Body className="p-3 p-md-4">
                      <Row className="align-items-center">
                        <Col xs={12} md={6} className="mb-3 mb-md-0">
                          <div className="d-flex align-items-center">
                            <span className="fs-3 me-3">
                              {order.type === 'Delivery' ? '🚚' : 
                               order.type === 'Mesa' ? '🍽️' : '🏃'}
                            </span>
                            <div>
                              <h5 className="fw-bold mb-1 fs-6 fs-md-5">Orden #{order.id}</h5>
                              <small className="text-muted small">
                                {new Date(order.timestamp).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </small>
                            </div>
                          </div>
                        </Col>
                        
                        <Col xs={6} md={2}>
                          <div>
                            <small className="text-muted d-block d-md-none small">Tipo</small>
                            <div className="fw-medium small">{order.type}</div>
                          </div>
                        </Col>
                        
                        <Col xs={6} md={2}>
                          <div>
                            <small className="text-muted d-block d-md-none small">Estado</small>
                            <Badge bg={getStatusVariant(order.status)} className="fs-7">
                              {order.status}
                            </Badge>
                          </div>
                        </Col>
                        
                        <Col xs={6} md={1}>
                          <div className="text-md-center">
                            <small className="text-muted d-block d-md-none small">Total</small>
                            <span className="fw-bold text-warning small">
                              {formatPrice(total)}
                            </span>
                          </div>
                        </Col>
                        
                        <Col xs={6} md={1}>
                          <Button variant="outline-primary" size="sm" className="w-100 fs-7">
                            Ver
                          </Button>
                        </Col>
                      </Row>
                      
                      {elapsedTime < 120 && (
                        <Alert variant="info" className="mt-2 mb-0 py-2 small">
                          <i className="bi bi-clock me-2"></i>
                          Pedido realizado hace {elapsedTime} minutos
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Orders;