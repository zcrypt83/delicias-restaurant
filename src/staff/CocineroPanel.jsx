// /src/staff/CocineroPanel.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Container, Row, Col, Card, Button, Badge, Alert,
  ProgressBar, Modal, ListGroup
} from 'react-bootstrap';

function CocineroPanel() {
  const { state, dispatch, showNotification } = useRestaurant();
  const [elapsedTimes, setElapsedTimes] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Actualizar tiempos cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      const times = {};
      state.orders.forEach(order => {
        if (order.status === 'CONFIRMADO') {
          times[order.id] = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000);
        }
      });
      setElapsedTimes(times);
    }, 60000);

    return () => clearInterval(timer);
  }, [state.orders]);

  // Métricas optimizadas
  const metrics = useMemo(() => {
    const confirmedOrders = state.orders.filter(order => 
      order.status === 'CONFIRMADO' && 
      order.items.some(item => item.status === 'PENDIENTE')
    );

    const allItems = confirmedOrders.flatMap(order => 
      order.items.map(item => ({ ...item, orderId: order.id, orderType: order.type }))
    );

    const pendingItems = allItems.filter(item => item.status === 'PENDIENTE');
    const readyItems = allItems.filter(item => item.status === 'LISTO');

    const urgentOrders = confirmedOrders.filter(order => 
      elapsedTimes[order.id] > 30
    );

    return {
      confirmedOrders,
      pendingItems,
      readyItems,
      urgentOrders,
      totalItems: allItems.length
    };
  }, [state.orders, elapsedTimes]);

  const handleMarkItemReady = (orderId, itemId, itemName) => {
    dispatch({
      type: 'UPDATE_ITEM_STATUS',
      payload: { orderId, itemId, status: 'LISTO' }
    });
    showNotification(`✅ ${itemName} listo`, 'success');
  };

  const handleMarkAllReady = (orderId) => {
    const order = state.orders.find(o => o.id === orderId);
    order.items.forEach(item => {
      if (item.status === 'PENDIENTE') {
        dispatch({
          type: 'UPDATE_ITEM_STATUS',
          payload: { orderId, itemId: item.id, status: 'LISTO' }
        });
      }
    });
    showNotification(`🎉 Orden #${orderId} completa`, 'success');
  };

  const isOrderReady = (order) => {
    return order.items.every(item => item.status === 'LISTO');
  };

  const getOrderProgress = (order) => {
    const totalItems = order.items.length;
    const readyItems = order.items.filter(item => item.status === 'LISTO').length;
    return (readyItems / totalItems) * 100;
  };

  const getUrgencyLevel = (minutes) => {
    if (minutes > 30) return 'danger';
    if (minutes > 20) return 'warning';
    return 'info';
  };

  const filteredOrders = metrics.confirmedOrders.filter(order => {
    if (activeFilter === 'urgent') return elapsedTimes[order.id] > 20;
    if (activeFilter === 'almostReady') return getOrderProgress(order) > 70;
    return true;
  });

  const OrderCard = ({ order }) => {
    const progress = getOrderProgress(order);
    const elapsedTime = elapsedTimes[order.id] || 0;
    const isUrgent = elapsedTime > 30;

    return (
      <Col lg={6} xl={4} key={order.id}>
        <Card className={`card-hover h-100 ${isUrgent ? 'border-danger border-2' : 'border-orange-200'}`}>
          {/* Header */}
          <Card.Header className={`${isUrgent ? 'bg-danger text-white' : 'bg-orange-500 text-white'} py-3`}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 fw-semibold">
                  {order.type === 'Mesa' ? `🍽️ Mesa ${order.tableCode}` : `🚚 ${order.type}`}
                </h6>
                <small>Orden #{order.id}</small>
              </div>
              <Badge bg={isUrgent ? 'light' : 'orange-100'} text={isUrgent ? 'danger' : 'orange'}>
                <i className="bi bi-clock me-1"></i>
                {elapsedTime}min
              </Badge>
            </div>
          </Card.Header>

          {/* Progress Bar */}
          <div className="px-3 pt-2">
            <div className="d-flex justify-content-between small mb-1">
              <span>Progreso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar 
              now={progress} 
              variant={
                progress === 100 ? 'success' :
                progress > 70 ? 'warning' : 'orange'
              }
              className="mb-2"
            />
          </div>

          {/* Items */}
          <Card.Body className="p-3">
            <ListGroup variant="flush">
              {order.items.map((item, index) => (
                <ListGroup.Item key={item.id} className="px-0 border-0">
                  <div className={`p-2 rounded ${item.status === 'LISTO' ? 'bg-success bg-opacity-10' : 'bg-orange bg-opacity-5'}`}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <span className="me-2">{item.image}</span>
                        <div>
                          <h6 className={`mb-1 ${item.status === 'LISTO' ? 'text-success' : 'fw-semibold'}`}>
                            {item.name}
                          </h6>
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <small className="text-muted">
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <div key={key} className="small">
                                  • {typeof value === 'object' ? `${key}: ${value.option}` : key}
                                </div>
                              ))}
                            </small>
                          )}
                        </div>
                      </div>
                      <Badge 
                        bg={item.status === 'LISTO' ? 'success' : 'orange'} 
                        className="badge-custom"
                      >
                        {item.status === 'LISTO' ? '✅' : '⏳'}
                      </Badge>
                    </div>
                    
                    {item.status === 'PENDIENTE' && (
                      <Button
                        variant="orange"
                        size="sm"
                        onClick={() => handleMarkItemReady(order.id, item.id, item.name)}
                        className="w-100"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Marcar Listo
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>

          {/* Footer */}
          <Card.Footer className="bg-transparent border-top-0">
            {progress === 100 ? (
              <Alert variant="success" className="mb-0 text-center py-2">
                <i className="bi bi-check-circle me-2"></i>
                Orden Completa
              </Alert>
            ) : (
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  onClick={() => handleMarkAllReady(order.id)}
                  disabled={progress === 100}
                >
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Completar Todo
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                >
                  <i className="bi bi-eye me-2"></i>
                  Ver Detalles
                </Button>
              </div>
            )}
          </Card.Footer>
        </Card>
      </Col>
    );
  };

  return (
    <div className="page-content">
      <Container className="py-4 bg-light min-vh-100">
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="h2 fw-bold text-dark mb-2">
              <i className="bi bi-fire me-3 text-orange"></i>
              Display de Cocina (KDS)
            </h1>
            <p className="text-muted mb-0">Sistema de gestión de órdenes en tiempo real</p>
          </Col>
          <Col xs="auto">
            <Badge bg="orange" className="badge-custom fs-6 px-3">
              <i className="bi bi-clock-history me-1"></i>
              {metrics.pendingItems.length} pendientes
            </Badge>
          </Col>
        </Row>

        {/* Alertas Urgentes */}
        {metrics.urgentOrders.length > 0 && (
          <Alert variant="danger" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle fs-4 me-3"></i>
              <div>
                <h5 className="mb-1">¡Órdenes Urgentes!</h5>
                <p className="mb-0">
                  {metrics.urgentOrders.length} orden(es) llevan más de 30 minutos en preparación
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* Métricas Rápidas */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className={`bg-orange bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3`}>
                  <span className="text-orange fs-2">👨‍🍳</span>
                </div>
                <h3 className="text-orange fw-bold">{metrics.confirmedOrders.length}</h3>
                <p className="text-muted mb-0">Órdenes Activas</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-warning fs-2">⏳</span>
                </div>
                <h3 className="text-warning fw-bold">{metrics.pendingItems.length}</h3>
                <p className="text-muted mb-0">Items Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-success fs-2">✅</span>
                </div>
                <h3 className="text-success fw-bold">{metrics.readyItems.length}</h3>
                <p className="text-muted mb-0">Items Listos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-danger fs-2">🚨</span>
                </div>
                <h3 className="text-danger fw-bold">{metrics.urgentOrders.length}</h3>
                <p className="text-muted mb-0">Órdenes Urgentes</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="py-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="fw-semibold me-2">Filtrar:</span>
              {[
                { id: 'all', label: 'Todas', icon: '📋' },
                { id: 'urgent', label: 'Urgentes', icon: '🚨' },
                { id: 'almostReady', label: 'Casi Listas', icon: '🎯' }
              ].map(filter => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'orange' : 'outline-orange'}
                  onClick={() => setActiveFilter(filter.id)}
                  className="d-flex align-items-center"
                >
                  <span className="me-2">{filter.icon}</span>
                  {filter.label}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Grid de Órdenes */}
        {filteredOrders.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <div className="fs-1 mb-3">👨‍🍳</div>
            <h4>¡Todo bajo control!</h4>
            <p className="mb-0 text-muted">No hay órdenes pendientes en cocina</p>
          </Alert>
        ) : (
          <Row className="g-4">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </Row>
        )}

        {/* Modal de Detalles de Orden */}
        <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-orange text-white">
            <Modal.Title>
              <i className="bi bi-list-ul me-2"></i>
              Detalles de Orden #{selectedOrder?.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Información</h6>
                    <p className="mb-1"><strong>Tipo:</strong> {selectedOrder.type}</p>
                    {selectedOrder.type === 'Mesa' && (
                      <p className="mb-1"><strong>Mesa:</strong> {selectedOrder.tableCode}</p>
                    )}
                    <p className="mb-1"><strong>Tiempo:</strong> {elapsedTimes[selectedOrder.id] || 0} minutos</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Progreso</h6>
                    <ProgressBar 
                      now={getOrderProgress(selectedOrder)} 
                      variant="orange" 
                      className="mb-2"
                    />
                    <div className="text-center">
                      <Badge bg="orange" className="fs-6">
                        {Math.round(getOrderProgress(selectedOrder))}% Completado
                      </Badge>
                    </div>
                  </div>
                </div>

                <h6>Items de la Orden</h6>
                <ListGroup variant="flush">
                  {selectedOrder.items.map((item, index) => (
                    <ListGroup.Item key={item.id} className="px-0">
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-5">{item.image}</span>
                          <div>
                            <h6 className="mb-1">{item.name}</h6>
                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                              <small className="text-muted">
                                {Object.entries(item.customizations).map(([key, value]) => (
                                  <div key={key}>
                                    • {typeof value === 'object' ? `${key}: ${value.option}` : key}
                                  </div>
                                ))}
                              </small>
                            )}
                          </div>
                        </div>
                        <Badge 
                          bg={item.status === 'LISTO' ? 'success' : 'warning'}
                          className="fs-6"
                        >
                          {item.status === 'LISTO' ? 'Listo' : 'Preparando'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="orange" onClick={() => handleMarkAllReady(selectedOrder?.id)}>
              <i className="bi bi-rocket-takeoff me-2"></i>
              Completar Todo
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default CocineroPanel;