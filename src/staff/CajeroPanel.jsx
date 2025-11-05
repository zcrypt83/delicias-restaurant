// src/staff/CajeroPanel.jsx
import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Container, Row, Col, Card, Button, Badge, Modal,
  Form, Table, Alert, InputGroup
} from 'react-bootstrap';

function CajeroPanel() {
  const { state, dispatch, showNotification } = useRestaurant();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [cashAmount, setCashAmount] = useState('');
  const [activeTab, setActiveTab] = useState('cobros');

  // Métricas optimizadas
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = state.orders.filter(order => 
      order.timestamp.startsWith(today)
    );

    const pendingOrders = todayOrders.filter(order => order.status === 'PENDIENTE');
    const confirmedOrders = todayOrders.filter(order => order.status === 'CONFIRMADO');
    const readyOrders = todayOrders.filter(order => order.status === 'LISTO');
    const paidOrders = todayOrders.filter(order => order.status === 'PAGADO');

    const totalRevenue = paidOrders.reduce((total, order) => {
      return total + order.items.reduce((orderTotal, item) => {
        const basePrice = item.price;
        const additionsPrice = Object.values(item.customizations || {}).reduce(
          (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
        );
        return orderTotal + basePrice + additionsPrice;
      }, 0);
    }, 0);

    const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    return {
      pendingOrders,
      confirmedOrders,
      readyOrders,
      paidOrders,
      totalRevenue,
      averageTicket,
      todayOrders
    };
  }, [state.orders]);

  const formatPrice = (price) => `S/ ${price.toFixed(2)}`;

  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => {
      const basePrice = item.price;
      const additionsPrice = Object.values(item.customizations || {}).reduce(
        (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
      );
      return total + basePrice + additionsPrice;
    }, 0);
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setCashAmount(calculateOrderTotal(order).toFixed(2));
  };

  const processPayment = () => {
    if (!selectedOrder) return;

    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId: selectedOrder.id, status: 'PAGADO' }
    });

    const change = paymentMethod === 'efectivo' ? (parseFloat(cashAmount) - calculateOrderTotal(selectedOrder)) : 0;
    
    showNotification(
      `Pago procesado ${change > 0 ? `- Vuelto: ${formatPrice(change)}` : ''}`,
      'success'
    );
    
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setPaymentMethod('efectivo');
    setCashAmount('');
  };

  const handleToggleAvailability = (itemId) => {
    dispatch({ type: 'TOGGLE_ITEM_AVAILABILITY', payload: itemId });
    const item = state.menu.find(i => i.id === itemId);
    showNotification(
      `${item.name} ${item.is_available ? 'agotado' : 'disponible'}`,
      'warning'
    );
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      efectivo: '💰',
      yape: '📱',
      plin: '💳',
      tarjeta: '💳'
    };
    return icons[method] || '💳';
  };

  const MetricCard = ({ title, value, subtitle, variant = 'primary', icon, trend }) => (
    <Card className="card-hover border-0 h-100">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="text-muted text-uppercase fs-7 fw-semibold mb-2">{title}</h6>
            <h3 className={`fw-bold text-${variant} mb-1`}>{value}</h3>
            {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
            {trend && (
              <Badge bg={`${trend > 0 ? 'success' : 'danger'}-subtle`} text={trend > 0 ? 'success' : 'danger'} className="mt-1">
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Badge>
            )}
          </div>
          <div className={`bg-${variant} bg-opacity-10 p-2 rounded flex-shrink-0 ms-2`}>
            <span className={`text-${variant} fs-4`}>{icon}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="page-content">
      <Container fluid className="py-4 px-3">
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="h2 fw-bold text-dark mb-2">
              <i className="bi bi-cash-coin me-3 text-success"></i>
              Panel de Cajero
            </h1>
            <p className="text-muted mb-0">Gestión de cobros y stock operacional</p>
          </Col>
          <Col xs="auto">
            <Badge bg="success" className="fs-6 px-3">
              <i className="bi bi-graph-up me-1"></i>
              {formatPrice(metrics.totalRevenue)}
            </Badge>
          </Col>
        </Row>

        {/* Métricas Rápidas */}
        <Row className="g-4 mb-4">
          <Col xs={6} md={3}>
            <MetricCard
              title="Por Cobrar"
              value={metrics.readyOrders.length}
              variant="warning"
              icon="⏳"
            />
          </Col>
          <Col xs={6} md={3}>
            <MetricCard
              title="Pagadas Hoy"
              value={metrics.paidOrders.length}
              variant="success"
              icon="✅"
            />
          </Col>
          <Col xs={6} md={3}>
            <MetricCard
              title="Ticket Promedio"
              value={formatPrice(metrics.averageTicket)}
              variant="info"
              icon="🧾"
            />
          </Col>
          <Col xs={6} md={3}>
            <MetricCard
              title="Agotados"
              value={state.menu.filter(item => !item.is_available).length}
              variant="danger"
              icon="⚠️"
            />
          </Col>
        </Row>

        {/* Navegación por Pestañas */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom py-3">
            <div className="d-flex flex-wrap gap-2">
              {[
                { id: 'cobros', label: 'Cobros Pendientes', icon: '💸' },
                { id: 'stock', label: 'Gestión de Stock', icon: '📦' },
                { id: 'ventas', label: 'Resumen Ventas', icon: '📊' }
              ].map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'success' : 'outline-success'}
                  onClick={() => setActiveTab(tab.id)}
                  className="d-flex align-items-center"
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            {/* Pestaña de Cobros */}
            {activeTab === 'cobros' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-clock-history me-2 text-warning"></i>
                  Órdenes Listas para Cobrar
                </h4>
                {metrics.readyOrders.length === 0 ? (
                  <Alert variant="info" className="text-center py-5">
                    <div className="fs-1 mb-3">💸</div>
                    <h5>No hay órdenes pendientes de cobro</h5>
                    <p className="mb-0 text-muted">Todas las órdenes han sido procesadas</p>
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {metrics.readyOrders.map(order => {
                      const orderTotal = calculateOrderTotal(order);
                      const elapsedTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000);
                      
                      return (
                        <Col key={order.id} lg={6}>
                          <Card className="card-hover border-warning border-2 h-100">
                            <Card.Header className="bg-warning bg-opacity-10 d-flex justify-content-between align-items-center">
                              <div>
                                <Badge bg="warning" className="me-2">#{order.id}</Badge>
                                <strong>{order.type === 'Mesa' ? `Mesa ${order.tableCode}` : order.type}</strong>
                              </div>
                              <Badge bg="outline-warning" text="dark">
                                <i className="bi bi-clock me-1"></i>
                                {elapsedTime}min
                              </Badge>
                            </Card.Header>
                            <Card.Body>
                              <div className="mb-3">
                                {order.items.map((item, index) => {
                                  const itemTotal = item.price + Object.values(item.customizations || {}).reduce(
                                    (sum, price) => sum + (typeof price === 'number' ? price : 0), 0
                                  );
                                  return (
                                    <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                      <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">{item.image}</span>
                                        <div>
                                          <div className="fw-medium">{item.name}</div>
                                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                                            <small className="text-muted">
                                              {Object.entries(item.customizations).slice(0, 2).map(([key, value]) => (
                                                <div key={key} className="small">
                                                  • {typeof value === 'object' ? `${key}: ${value.option}` : key}
                                                </div>
                                              ))}
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                      <span className="fw-semibold">{formatPrice(itemTotal)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                <div>
                                  <h5 className="text-success mb-0">{formatPrice(orderTotal)}</h5>
                                  <small className="text-muted">Total a pagar</small>
                                </div>
                                <Button
                                  variant="success"
                                  onClick={() => handlePayment(order)}
                                  className="d-flex align-items-center"
                                >
                                  <i className="bi bi-cash-coin me-2"></i>
                                  Cobrar
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                )}
              </div>
            )}

            {/* Pestaña de Stock */}
            {activeTab === 'stock' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-box-seam me-2 text-primary"></i>
                  Gestión de Stock Operacional
                </h4>
                <Row className="g-3">
                  {state.menu.map(item => (
                    <Col key={item.id} md={6} lg={4}>
                      <Card className={`card-hover h-100 ${item.is_available ? 'border-success' : 'border-danger'}`}>
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded p-2 me-3">
                                <span className="fs-4">{item.image}</span>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-semibold">{item.name}</h6>
                                <small className="text-muted">{formatPrice(item.price)}</small>
                              </div>
                            </div>
                            <Form.Switch
                              checked={item.is_available}
                              onChange={() => handleToggleAvailability(item.id)}
                              className="fs-5"
                            />
                          </div>
                          <div className="mt-2">
                            <Badge 
                              bg={item.is_available ? 'success-subtle text-success' : 'danger-subtle text-danger'}
                              className="w-100 text-center"
                            >
                              {item.is_available ? '🟢 Disponible' : '🔴 Agotado'}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Pestaña de Ventas */}
            {activeTab === 'ventas' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-graph-up me-2 text-info"></i>
                  Resumen de Ventas del Día
                </h4>
                <Row className="g-4">
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header>
                        <h5 className="mb-0">Detalle de Ventas</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Orden</th>
                              <th>Tipo</th>
                              <th>Estado</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics.todayOrders.slice(-10).reverse().map(order => (
                              <tr key={order.id}>
                                <td>
                                  <Badge bg="outline-primary" text="dark">
                                    #{order.id}
                                  </Badge>
                                </td>
                                <td>{order.type}</td>
                                <td>
                                  <Badge 
                                    bg={
                                      order.status === 'PAGADO' ? 'success' :
                                      order.status === 'LISTO' ? 'warning' :
                                      order.status === 'CONFIRMADO' ? 'info' : 'secondary'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </td>
                                <td className="text-end fw-semibold">
                                  {formatPrice(calculateOrderTotal(order))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Header>
                        <h5 className="mb-0">Métricas Clave</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="space-y-3">
                          <div className="d-flex justify-content-between">
                            <span>Ventas Totales:</span>
                            <strong className="text-success">{formatPrice(metrics.totalRevenue)}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Órdenes Procesadas:</span>
                            <strong>{metrics.paidOrders.length}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Ticket Promedio:</span>
                            <strong>{formatPrice(metrics.averageTicket)}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Eficiencia:</span>
                            <Badge bg="success">
                              {metrics.todayOrders.length > 0 
                                ? Math.round((metrics.paidOrders.length / metrics.todayOrders.length) * 100)
                                : 0
                              }%
                            </Badge>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal de Pago */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>
              <i className="bi bi-cash-coin me-2"></i>
              Procesar Pago
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <>
                <Alert variant="info">
                  <strong>Orden #{selectedOrder.id}</strong><br />
                  {selectedOrder.type === 'Mesa' ? `Mesa ${selectedOrder.tableCode}` : selectedOrder.type}<br />
                  <strong>Total: {formatPrice(calculateOrderTotal(selectedOrder))}</strong>
                </Alert>

                <Form.Group className="mb-3">
                  <Form.Label>Método de Pago</Form.Label>
                  <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    {['efectivo', 'yape', 'plin', 'tarjeta'].map(method => (
                      <Button
                        key={method}
                        variant={paymentMethod === method ? 'success' : 'outline-success'}
                        onClick={() => setPaymentMethod(method)}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <span className="me-2">{getPaymentMethodIcon(method)}</span>
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                {paymentMethod === 'efectivo' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Monto Recibido</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>S/</InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </InputGroup>
                    {cashAmount && (
                      <Form.Text className="text-muted">
                        Vuelto: {formatPrice(parseFloat(cashAmount) - calculateOrderTotal(selectedOrder))}
                      </Form.Text>
                    )}
                  </Form.Group>
                )}

                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={processPayment}
                    disabled={paymentMethod === 'efectivo' && parseFloat(cashAmount) < calculateOrderTotal(selectedOrder)}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Pago
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default CajeroPanel;