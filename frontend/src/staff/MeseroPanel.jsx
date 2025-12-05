// src/staff/MeseroPanel.jsx
import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Container, Row, Col, Card, Button, Badge, Alert,
  Table, Modal, ListGroup, ProgressBar
} from 'react-bootstrap';

function MeseroPanel() {
  const { state, dispatch, showNotification } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [activeView, setActiveView] = useState('ordenes');

  // Métricas optimizadas
  const metrics = useMemo(() => {
    const pendingOrders = state.orders.filter(order => 
      order.status === 'PENDIENTE' && order.type === 'Mesa'
    );

    const activeTables = state.tables.filter(table => table.status === 'ocupada').length;
    const freeTables = state.tables.filter(table => table.status === 'libre').length;

    const tablesWithOrders = state.tables.map(table => {
      const order = state.orders.find(o => o.id === table.currentOrder);
      return {
        ...table,
        currentOrder: order
      };
    });

    return {
      pendingOrders,
      activeTables,
      freeTables,
      tablesWithOrders,
      totalOrders: state.orders.filter(order => order.type === 'Mesa').length
    };
  }, [state.orders, state.tables]);

  const handleConfirmOrder = (orderId) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'CONFIRMADO' }
    });
    showNotification('✅ Orden confirmada y enviada a cocina', 'success');
  };

  const handleQuickConfirm = (orderId) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status: 'CONFIRMADO' }
    });
    showNotification('⚡ Orden confirmada rápidamente', 'success');
  };

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

  const getTableStatus = (table) => {
    if (table.status === 'libre') return { variant: 'success', icon: '✅', text: 'Libre' };
    
    const order = state.orders.find(o => o.id === table.currentOrder);
    if (order?.status === 'PENDIENTE') return { variant: 'warning', icon: '⏳', text: 'Pendiente' };
    if (order?.status === 'CONFIRMADO') return { variant: 'info', icon: '👨‍🍳', text: 'En Cocina' };
    if (order?.status === 'LISTO') return { variant: 'primary', icon: '🔔', text: 'Listo' };
    
    return { variant: 'secondary', icon: '🍽️', text: 'Ocupada' };
  };

  const TableCard = ({ table }) => {
    const status = getTableStatus(table);
    const order = state.orders.find(o => o.id === table.currentOrder);

    return (
      <Col xs={6} md={4} lg={3} key={table.code}>
        <Card 
          className={`card-hover h-100 cursor-pointer border-${status.variant} ${table.status === 'ocupada' ? 'border-2' : ''}`}
          onClick={() => {
            setSelectedTable({ ...table, currentOrder: order });
            setShowTableModal(true);
          }}
        >
          <Card.Body className="text-center p-3">
            <div className={`bg-${status.variant} bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3`}>
              <span className={`text-${status.variant} fs-2`}>{status.icon}</span>
            </div>
            <h5 className="fw-bold mb-2">{table.code}</h5>
            <Badge bg={status.variant} className="w-100">
              {status.text}
            </Badge>
            {order && (
              <div className="mt-2">
                <small className="text-muted">
                  Orden #{order.id}<br />
                  {order.items.length} items
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const OrderCard = ({ order }) => {
    const total = calculateOrderTotal(order);
    const elapsedTime = Math.floor((Date.now() - new Date(order.timestamp).getTime()) / 60000);

    return (
      <Col lg={6} key={order.id}>
        <Card className="card-hover border-warning border-2 h-100">
          <Card.Header className="bg-warning bg-opacity-10 d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="warning" className="me-2">#{order.id}</Badge>
              <strong>Mesa {order.tableCode}</strong>
            </div>
            <Badge bg="outline-warning" text="dark">
              <i className="bi bi-clock me-1"></i>
              {elapsedTime}min
            </Badge>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h6 className="fw-semibold mb-3">Items del Pedido:</h6>
              <ListGroup variant="flush">
                {order.items.map((item, index) => (
                  <ListGroup.Item key={index} className="px-0">
                    <div className="d-flex justify-content-between align-items-start py-2">
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-3">{item.image}</span>
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
                      <span className="fw-semibold">{formatPrice(item.price)}</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-success mb-0">{formatPrice(total)}</h5>
                <small className="text-muted">Total</small>
              </div>
              
              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  onClick={() => handleConfirmOrder(order.id)}
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Confirmar y Enviar a Cocina
                </Button>
                <Button
                  variant="outline-success"
                  onClick={() => handleQuickConfirm(order.id)}
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-lightning me-2"></i>
                  Confirmación Rápida
                </Button>
              </div>
            </div>
          </Card.Body>
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
              <i className="bi bi-cup-hot me-3 text-success"></i>
              Panel de Mesero
            </h1>
            <p className="text-muted mb-0">Gestión de salón y confirmación de órdenes</p>
          </Col>
          <Col xs="auto">
            <Badge bg="success" className="badge-custom fs-6 px-3">
              <i className="bi bi-bell me-1"></i>
              {metrics.pendingOrders.length} pendientes
            </Badge>
          </Col>
        </Row>

        {/* Métricas Rápidas */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-warning fs-2">⏳</span>
                </div>
                <h3 className="text-warning fw-bold">{metrics.pendingOrders.length}</h3>
                <p className="text-muted mb-0">Órdenes Pendientes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-info fs-2">👨‍🍳</span>
                </div>
                <h3 className="text-info fw-bold">
                  {state.orders.filter(o => o.status === 'CONFIRMADO' && o.type === 'Mesa').length}
                </h3>
                <p className="text-muted mb-0">En Cocina</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-primary fs-2">🔔</span>
                </div>
                <h3 className="text-primary fw-bold">
                  {state.orders.filter(o => o.status === 'LISTO' && o.type === 'Mesa').length}
                </h3>
                <p className="text-muted mb-0">Listas para Servir</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="card-hover border-0 text-center">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3">
                  <span className="text-success fs-2">✅</span>
                </div>
                <h3 className="text-success fw-bold">{metrics.activeTables}</h3>
                <p className="text-muted mb-0">Mesas Ocupadas</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navegación */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom py-3">
            <div className="d-flex flex-wrap gap-2">
              {[
                { id: 'ordenes', label: 'Órdenes Pendientes', icon: '📋' },
                { id: 'mesas', label: 'Estado de Mesas', icon: '🍽️' },
                { id: 'resumen', label: 'Resumen del Turno', icon: '📊' }
              ].map(view => (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? 'success' : 'outline-success'}
                  onClick={() => setActiveView(view.id)}
                  className="d-flex align-items-center"
                >
                  <span className="me-2">{view.icon}</span>
                  {view.label}
                </Button>
              ))}
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            {/* Vista de Órdenes Pendientes */}
            {activeView === 'ordenes' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-clock-history me-2 text-warning"></i>
                  Órdenes Pendientes de Confirmación
                </h4>
                {metrics.pendingOrders.length === 0 ? (
                  <Alert variant="success" className="text-center py-5">
                    <div className="fs-1 mb-3">✅</div>
                    <h5>¡Todo confirmado!</h5>
                    <p className="mb-0 text-muted">No hay órdenes pendientes de confirmación</p>
                  </Alert>
                ) : (
                  <Row className="g-4">
                    {metrics.pendingOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </Row>
                )}
              </div>
            )}

            {/* Vista de Estado de Mesas */}
            {activeView === 'mesas' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-grid-3x3 me-2 text-primary"></i>
                  Mapa de Mesas
                </h4>
                <Row className="g-3">
                  {metrics.tablesWithOrders.map(table => (
                    <TableCard key={table.code} table={table} />
                  ))}
                </Row>
              </div>
            )}

            {/* Vista de Resumen */}
            {activeView === 'resumen' && (
              <div>
                <h4 className="mb-4 d-flex align-items-center">
                  <i className="bi bi-graph-up me-2 text-info"></i>
                  Resumen del Turno
                </h4>
                <Row className="g-4">
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Header>
                        <h5 className="mb-0">Actividad Reciente</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Mesa</th>
                              <th>Orden</th>
                              <th>Estado</th>
                              <th>Items</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {state.orders
                              .filter(order => order.type === 'Mesa')
                              .slice(-10)
                              .reverse()
                              .map(order => (
                                <tr key={order.id}>
                                  <td>
                                    <Badge bg="outline-primary" text="dark">
                                      {order.tableCode}
                                    </Badge>
                                  </td>
                                  <td>#{order.id}</td>
                                  <td>
                                    <Badge bg={
                                      order.status === 'PENDIENTE' ? 'warning' :
                                      order.status === 'CONFIRMADO' ? 'info' :
                                      order.status === 'LISTO' ? 'primary' : 'success'
                                    }>
                                      {order.status}
                                    </Badge>
                                  </td>
                                  <td>{order.items.length}</td>
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
                        <h5 className="mb-0">Estadísticas</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="space-y-3">
                          <div className="d-flex justify-content-between">
                            <span>Mesas Ocupadas:</span>
                            <strong>{metrics.activeTables}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Mesas Libres:</span>
                            <strong className="text-success">{metrics.freeTables}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Órdenes Totales:</span>
                            <strong>{metrics.totalOrders}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Eficiencia:</span>
                            <Badge bg="success">
                              {Math.round((metrics.totalOrders / Math.max(1, metrics.activeTables)) * 100)}%
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

        {/* Modal de Detalles de Mesa */}
        <Modal show={showTableModal} onHide={() => setShowTableModal(false)} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className="bi bi-table me-2"></i>
              Mesa {selectedTable?.code}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTable && (
              <>
                <div className="text-center mb-4">
                  <div className={`bg-${getTableStatus(selectedTable).variant} bg-opacity-10 rounded-circle p-4 d-inline-flex align-items-center justify-content-center`}>
                    <span className={`text-${getTableStatus(selectedTable).variant} fs-1`}>
                      {getTableStatus(selectedTable).icon}
                    </span>
                  </div>
                  <h4 className="mt-3">{selectedTable.code}</h4>
                  <Badge bg={getTableStatus(selectedTable).variant} className="fs-6">
                    {getTableStatus(selectedTable).text}
                  </Badge>
                </div>

                {selectedTable.currentOrder && (
                  <>
                    <h6>Orden Actual</h6>
                    <Alert variant="info">
                      <strong>Orden #{selectedTable.currentOrder.id}</strong><br />
                      <small>
                        Estado: <Badge bg="info">{selectedTable.currentOrder.status}</Badge><br />
                        Items: {selectedTable.currentOrder.items.length}<br />
                        Total: {formatPrice(calculateOrderTotal(selectedTable.currentOrder))}
                      </small>
                    </Alert>

                    {selectedTable.currentOrder.status === 'PENDIENTE' && (
                      <div className="d-grid gap-2">
                        <Button
                          variant="success"
                          onClick={() => {
                            handleConfirmOrder(selectedTable.currentOrder.id);
                            setShowTableModal(false);
                          }}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Confirmar Orden
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default MeseroPanel;