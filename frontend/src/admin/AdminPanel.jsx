// /src/admin/AdminPanel.jsx
import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Nav } from 'react-bootstrap';

// Importaciones
import useOrders from '../hooks/UseOrders';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import PriceFormatter from '../components/common/PriceFormatter';
import ClientsManager from './ClientsManager';
import ProductsManager from './ProductsManager';
import { formatPrice } from '../utils/Formatters';
import { calculateOrderTotal } from '../utils/OrderUtils';

function AdminPanel() {
  const { state, dispatch, showNotification } = useRestaurant();
  const { todayOrders, getOrdersByStatus } = useOrders();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Métricas usando hooks optimizados
  const metrics = useMemo(() => {
    const paidOrders = getOrdersByStatus('PAGADO');
    const totalSales = paidOrders.reduce((total, order) => total + calculateOrderTotal(order), 0);
    
    const ordersByType = state.orders.reduce((acc, order) => {
      acc[order.type] = (acc[order.type] || 0) + 1;
      return acc;
    }, {});

    const popularItems = state.menu.map(item => {
      const orderCount = state.orders.reduce((count, order) => {
        return count + order.items.filter(orderItem => orderItem.id === item.id).length;
      }, 0);
      return { ...item, orderCount };
    }).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

    return {
      totalSales,
      ordersByType,
      popularItems,
      lowStockItems: state.menu.filter(item => !item.is_available).length
    };
  }, [state.orders, state.menu, getOrdersByStatus]);

  const handleToggleDelivery = () => {
    dispatch({ type: 'TOGGLE_DELIVERY' });
    showNotification(
      `Servicio de delivery ${state.businessConfig.deliveryEnabled ? 'desactivado' : 'activado'}`,
      'warning'
    );
  };

  const handleToggleReservations = () => {
    dispatch({ type: 'TOGGLE_RESERVATIONS' });
    showNotification(
      `Sistema de reservas ${state.businessConfig.reservationsEnabled ? 'desactivado' : 'activado'}`,
      'warning'
    );
  };

  const renderDashboard = () => (
    <div>
      {/* Métricas Principales */}
      <Row className="g-3 g-md-4 mb-4">
        <Col xs={6} md={6} lg={3}>
          <MetricCard
            title="Ventas Hoy"
            value={<PriceFormatter price={metrics.totalSales} />}
            variant="purple"
            icon="💰"
            className="text-center border-0 shadow-sm h-100"
          />
        </Col>
        <Col xs={6} md={6} lg={3}>
          <MetricCard
            title="Órdenes Hoy"
            value={todayOrders.length}
            variant="primary"
            icon="📦"
            className="text-center border-0 shadow-sm h-100"
          />
        </Col>
        <Col xs={6} md={6} lg={3}>
          <MetricCard
            title="Reservas Activas"
            value={state.reservations.length}
            variant="success"
            icon="📅"
            className="text-center border-0 shadow-sm h-100"
          />
        </Col>
        <Col xs={6} md={6} lg={3}>
          <MetricCard
            title="Items Agotados"
            value={metrics.lowStockItems}
            variant="warning"
            icon="⚠️"
            className="text-center border-0 shadow-sm h-100"
          />
        </Col>
      </Row>

      <Row className="g-3 g-md-4 mb-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fs-6 fs-md-5">Distribución por Tipo</h5>
            </Card.Header>
            <Card.Body className="p-3 p-md-4">
              {Object.entries(metrics.ordersByType).map(([type, count]) => (
                <div key={type} className="d-flex justify-content-between align-items-center p-2 p-md-3 border-bottom">
                  <span className="fw-medium small">{type}</span>
                  <Badge bg="primary" className="fs-7 fs-md-6">{count} órdenes</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fs-6 fs-md-5">Items Más Populares</h5>
            </Card.Header>
            <Card.Body className="p-3 p-md-4">
              {metrics.popularItems.map((item, index) => (
                <div key={item.id} className="d-flex align-items-center justify-content-between p-2 p-md-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <span className="fs-5 me-2 me-md-3">{item.image}</span>
                    <span className="fw-medium small">{item.name}</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold small">{item.orderCount} pedidos</div>
                    <div className="text-muted small">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ventas Recientes */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fs-6 fs-md-5">Ventas Recientes</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="small">Orden ID</th>
                  <th className="small">Tipo</th>
                  <th className="small">Cliente</th>
                  <th className="small">Estado</th>
                  <th className="small text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {state.orders.slice(-10).reverse().map(order => (
                  <tr key={order.id}>
                    <td className="small">#{order.id}</td>
                    <td className="small">{order.type}</td>
                    <td className="small">
                      {order.customerName || (order.type === 'Mesa' ? `Mesa ${order.tableCode}` : 'N/A')}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-end fw-semibold small">
                      <PriceFormatter price={calculateOrderTotal(order)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderConfiguration = () => (
    <div>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fs-6 fs-md-5">Configuración del Negocio</h5>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3">
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center p-2 p-md-3 border rounded">
                <div>
                  <h6 className="fw-bold mb-1 small">Servicio de Delivery</h6>
                  <p className="text-muted mb-0 small">Activar/desactivar pedidos a domicilio</p>
                </div>
                <Form.Check 
                  type="switch"
                  checked={state.businessConfig.deliveryEnabled}
                  onChange={handleToggleDelivery}
                  className="fs-6"
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-between align-items-center p-2 p-md-3 border rounded">
                <div>
                  <h6 className="fw-bold mb-1 small">Sistema de Reservas</h6>
                  <p className="text-muted mb-0 small">Activar/desactivar reservas en línea</p>
                </div>
                <Form.Check 
                  type="switch"
                  checked={state.businessConfig.reservationsEnabled}
                  onChange={handleToggleReservations}
                  className="fs-6"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Información del Restaurante */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0 fs-6 fs-md-5">Información del Restaurante</h5>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small">Nombre del Restaurante</Form.Label>
                <Form.Control 
                  type="text" 
                  value={state.businessConfig.restaurantName}
                  readOnly
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small">Dirección</Form.Label>
                <Form.Control 
                  type="text" 
                  value={state.businessConfig.address}
                  readOnly
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small">Teléfono</Form.Label>
                <Form.Control 
                  type="text" 
                  value={state.businessConfig.phone}
                  readOnly
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold small">Horario de Atención</Form.Label>
                <Form.Control 
                  type="text" 
                  value={state.businessConfig.openingHours}
                  readOnly
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );

  const renderMenuManagement = () => (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0 fs-6 fs-md-5">Gestión del Menú</h5>
      </Card.Header>
      <Card.Body className="p-3 p-md-4">
        {state.menu.map(item => (
          <div key={item.id} className="d-flex align-items-center justify-content-between p-2 p-md-3 border rounded mb-3">
            <div className="d-flex align-items-center flex-grow-1">
              <span className="fs-3 me-2 me-md-3">{item.image}</span>
              <div className="flex-grow-1">
                <div className="fw-semibold small">{item.name}</div>
                <div className="text-muted small">{item.description}</div>
                <div className="text-warning fw-semibold small">{formatPrice(item.price)}</div>
                <div className="text-muted small">{item.category} • {item.preparation_time} min</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 ms-2">
              <StatusBadge status={item.is_available ? 'disponible' : 'agotado'} type="item" />
              <Button
                variant={item.is_available ? 'outline-danger' : 'outline-success'}
                size="sm"
                onClick={() => dispatch({ type: 'TOGGLE_ITEM_AVAILABILITY', payload: item.id })}
                className="fs-7"
              >
                {item.is_available ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="px-2 px-md-4 py-3 py-md-4">
      <Row className="align-items-center mb-3 mb-md-4">
        <Col>
          <h1 className="h3 h2-md text-purple-700 fw-bold">Panel de Administración</h1>
          <p className="text-muted mb-0 small">Control gerencial y configuración del sistema</p>
        </Col>
        <Col xs="auto">
          <Badge bg="purple" className="fs-7 fs-md-6">Admin</Badge>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom p-3 p-md-4">
          <Nav variant="tabs" className="card-header-tabs flex-nowrap overflow-auto">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                className="fw-semibold small text-nowrap"
              >
                📊 Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'configuration'}
                onClick={() => setActiveTab('configuration')}
                className="fw-semibold small text-nowrap"
              >
                ⚙️ Configuración
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'products'}
                onClick={() => setActiveTab('products')}
                className="fw-semibold small text-nowrap"
              >
                🍽️ Menú
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'clients'}
                onClick={() => setActiveTab('clients')}
                className="fw-semibold small text-nowrap"
              >
                👥 Clientes
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'configuration' && renderConfiguration()}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'clients' && <ClientsManager />}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminPanel;