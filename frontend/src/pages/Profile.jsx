// src/pages/Profile.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';

function Profile() {
  const { user } = useAuth();
  const { state } = useRestaurant();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: ''
  });

  const userOrders = state.orders.filter(order => 
    order.customerName === user?.name || order.customerName?.includes(user?.email)
  );

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente');
  };

  return (
    <Container className="py-4 py-md-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-4 mb-md-5">
            <h1 className="display-5 display-md-4 fw-bold mb-3">Mi Perfil</h1>
            <p className="text-muted small">Gestiona tu información y preferencias</p>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="card-header-tabs flex-nowrap overflow-auto p-3 p-md-4"
              >
                <Tab eventKey="profile" title="👤 Perfil" className="p-0">
                  <div className="p-3 p-md-4">
                    <Row>
                      <Col md={8}>
                        <Form onSubmit={handleProfileUpdate}>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="small">Nombre Completo *</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                  }))}
                                  required
                                  size="sm"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="small">Email *</Form.Label>
                                <Form.Control
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    email: e.target.value
                                  }))}
                                  required
                                  size="sm"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label className="small">Teléfono</Form.Label>
                            <Form.Control
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                phone: e.target.value
                              }))}
                              size="sm"
                            />
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="small">Dirección</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Dirección para delivery"
                              value={profileData.address}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                address: e.target.value
                              }))}
                              size="sm"
                            />
                          </Form.Group>

                          <Button type="submit" variant="warning" className="fw-bold" size="sm">
                            💾 Guardar Cambios
                          </Button>
                        </Form>
                      </Col>
                      <Col md={4} className="mt-4 mt-md-0">
                        <Card className="bg-light border-0">
                          <Card.Body className="text-center p-3">
                            <div className="bg-warning bg-opacity-10 rounded-circle p-3 p-md-4 d-inline-flex align-items-center justify-content-center mb-3">
                              <span className="text-warning fs-2">👤</span>
                            </div>
                            <h5 className="fw-bold small">{user?.name}</h5>
                            <p className="text-muted small">{user?.email}</p>
                            <Badge bg="secondary" className="fs-7">
                              Cliente
                            </Badge>
                            <div className="mt-3">
                              <small className="text-muted small">
                                Miembro desde: {new Date().toLocaleDateString()}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="orders" title="📝 Mis Pedidos" className="p-0">
                  <div className="p-3 p-md-4">
                    <h5 className="fw-bold mb-4 fs-6 fs-md-5">Historial de Pedidos</h5>
                    
                    {userOrders.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="fs-1 mb-3">📝</div>
                        <h5 className="h6 h5-md">No hay pedidos registrados</h5>
                        <p className="text-muted small">Realiza tu primer pedido para verlo aquí</p>
                        <Button as="a" href="/menu" variant="warning" size="sm">
                          Hacer mi Primer Pedido
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userOrders.slice().reverse().map(order => (
                          <Card key={order.id} className="border-0 shadow-sm">
                            <Card.Body className="p-3">
                              <Row className="align-items-center">
                                <Col md={4}>
                                  <div className="d-flex align-items-center">
                                    <span className="fs-4 me-3">
                                      {order.type === 'Delivery' ? '🚚' : 
                                       order.type === 'Mesa' ? '🍽️' : '🏃'}
                                    </span>
                                    <div>
                                      <h6 className="fw-bold mb-1 small">Orden #{order.id}</h6>
                                      <small className="text-muted small">
                                        {new Date(order.timestamp).toLocaleDateString()} - 
                                        {new Date(order.timestamp).toLocaleTimeString()}
                                      </small>
                                    </div>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div>
                                    <small className="text-muted small">Tipo</small>
                                    <div className="fw-medium small">{order.type}</div>
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div>
                                    <small className="text-muted small">Estado</small>
                                    <div>
                                      <span className={`badge bg-${
                                        order.status === 'PAGADO' ? 'success' :
                                        order.status === 'LISTO' ? 'primary' :
                                        order.status === 'CONFIRMADO' ? 'warning' : 'secondary'
                                      } fs-7`}>
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                </Col>
                                <Col md={2}>
                                  <Button variant="outline-primary" size="sm" className="fs-7">
                                    Ver Detalles
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;