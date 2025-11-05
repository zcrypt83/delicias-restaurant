// src/staff/StaffDashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import useOrders from '../hooks/UseOrders';
import usePermissions from '../hooks/UsePermissions';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingButton from '../components/common/LoadingButton';
import { formatPrice } from '../utils/Formatters';

function StaffDashboard() {
  const { user, hasRole } = useAuth();
  const { state } = useRestaurant();
  const navigate = useNavigate();
  const { todayOrders, getOrdersByStatus } = useOrders();
  const { isAdmin, canManage } = usePermissions();
  const [activeView, setActiveView] = useState('overview');

  // Métricas calculadas con hooks optimizados
  const metrics = {
    pendingOrders: getOrdersByStatus('PENDIENTE').length,
    cookingOrders: getOrdersByStatus('CONFIRMADO').length,
    readyOrders: getOrdersByStatus('LISTO').length,
    occupiedTables: state.tables.filter(t => t.status === 'ocupada').length,
    lowStockItems: state.menu.filter(item => !item.is_available).length,
    totalOrdersToday: todayOrders.length
  };

  const QuickActions = () => (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Acciones Rápidas</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-2">
          {(hasRole('mesero') || hasRole('admin')) && (
            <Col xs={6} md={3}>
              <Button 
                variant="outline-primary" 
                className="w-100 h-100 py-3"
                onClick={() => navigate('/staff/orders')}
              >
                <div className="fs-2 mb-2">📋</div>
                <small>Ver Órdenes</small>
              </Button>
            </Col>
          )}
          {(hasRole('cocinero') || hasRole('admin')) && (
            <Col xs={6} md={3}>
              <Button 
                variant="outline-warning" 
                className="w-100 h-100 py-3"
                onClick={() => navigate('/staff/kitchen')}
              >
                <div className="fs-2 mb-2">👨‍🍳</div>
                <small>Cocina</small>
              </Button>
            </Col>
          )}
          {(hasRole('cajero') || hasRole('admin')) && (
            <Col xs={6} md={3}>
              <Button 
                variant="outline-success" 
                className="w-100 h-100 py-3"
                onClick={() => navigate('/staff/cashier')}
              >
                <div className="fs-2 mb-2">💰</div>
                <small>Caja</small>
              </Button>
            </Col>
          )}
          {hasRole('admin') && (
            <Col xs={6} md={3}>
              <Button 
                variant="outline-danger" 
                className="w-100 h-100 py-3"
                onClick={() => navigate('/admin')}
              >
                <div className="fs-2 mb-2">⚙️</div>
                <small>Admin</small>
              </Button>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <div className="page-content">
      <Container className="py-4 bg-light min-vh-100">
        {/* Header */}
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="h3 fw-bold text-dark mb-2">
              <i className="bi bi-speedometer2 me-2 text-primary"></i>
              Panel del Staff
            </h1>
            <p className="text-muted mb-0">
              Bienvenido/a, <strong>{user?.name}</strong>. Rol: <Badge bg="primary">{user?.role}</Badge>
            </p>
          </Col>
          <Col xs="auto">
            <Badge bg="info" className="fs-6">
              {metrics.totalOrdersToday} hoy
            </Badge>
          </Col>
        </Row>

        <QuickActions />

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <Nav variant="tabs" className="card-header-tabs">
              <Nav.Item>
                <Nav.Link 
                  active={activeView === 'overview'}
                  onClick={() => setActiveView('overview')}
                  className="fw-semibold"
                >
                  📊 Resumen
                </Nav.Link>
              </Nav.Item>
              {(hasRole('mesero') || hasRole('admin')) && (
                <Nav.Item>
                  <Nav.Link 
                    active={activeView === 'tables'}
                    onClick={() => setActiveView('tables')}
                    className="fw-semibold"
                  >
                    🍽️ Mesas
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Card.Header>
          
          <Card.Body className="p-4">
            {activeView === 'overview' && (
              <>
                <h5 className="mb-4">Estado Actual del Restaurante</h5>
                <Row>
                  <MetricCard 
                    title="Órdenes Pendientes" 
                    value={metrics.pendingOrders}
                    variant="warning"
                    icon="⏳"
                    onClick={() => navigate('/staff/orders')}
                  />
                  <MetricCard 
                    title="En Cocina" 
                    value={metrics.cookingOrders}
                    variant="info" 
                    icon="👨‍🍳"
                    onClick={() => navigate('/staff/kitchen')}
                  />
                  <MetricCard 
                    title="Listas para Servir" 
                    value={metrics.readyOrders}
                    variant="success"
                    icon="🔔"
                  />
                  <MetricCard 
                    title="Mesas Ocupadas" 
                    value={metrics.occupiedTables}
                    variant="primary"
                    icon="🍽️"
                  />
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default StaffDashboard;