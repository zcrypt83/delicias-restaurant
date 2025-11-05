// src/pages/Reservations.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

function Reservations() {
  const { state, dispatch } = useRestaurant();
  const { isAuthenticated, user } = useAuth();
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!state.businessConfig.reservationsEnabled) {
      alert('El sistema de reservas no está disponible temporalmente');
      return;
    }

    const reservation = {
      ...reservationData,
      name: reservationData.name || (isAuthenticated ? user.name : ''),
      email: reservationData.email || (isAuthenticated ? user.email : ''),
      status: 'CONFIRMADA',
      timestamp: new Date().toISOString()
    };

    dispatch({ type: 'ADD_RESERVATION', payload: reservation });
    
    alert('¡Reserva confirmada! Te esperamos.');
    setReservationData({
      date: '',
      time: '',
      guests: 2,
      name: '',
      phone: '',
      email: '',
      specialRequests: ''
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (!state.businessConfig.reservationsEnabled) {
    return (
      <Container className="py-4 py-md-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="fs-1 mb-3">🚧</div>
            <h2 className="fw-bold mb-3 h3 h2-md">Reservas No Disponibles</h2>
            <p className="text-muted mb-4 small">
              El sistema de reservas online no está disponible temporalmente.
            </p>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3 p-md-4">
                <h5 className="fw-bold small">📞 Contáctanos</h5>
                <p className="mb-1 small"><strong>Teléfono:</strong> {state.businessConfig.phone}</p>
                <p className="mb-0 small"><strong>Dirección:</strong> {state.businessConfig.address}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-3 py-md-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-4">
            <h1 className="h3 h2-md mb-3">Reserva tu Mesa</h1>
            <p className="text-muted small">Asegura tu experiencia gastronómica</p>
          </div>

          <Row className="g-3 g-md-4">
            <Col md={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3 p-md-4">
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="small">Fecha *</Form.Label>
                          <Form.Control
                            type="date"
                            min={today}
                            value={reservationData.date}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              date: e.target.value
                            }))}
                            required
                            size="sm"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="small">Hora *</Form.Label>
                          <Form.Select
                            value={reservationData.time}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              time: e.target.value
                            }))}
                            required
                            size="sm"
                          >
                            <option value="">Selecciona hora</option>
                            {availableTimes.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="small">Personas *</Form.Label>
                          <Form.Select
                            value={reservationData.guests}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              guests: parseInt(e.target.value)
                            }))}
                            size="sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'persona' : 'personas'}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="small">Nombre *</Form.Label>
                          <Form.Control
                            type="text"
                            value={reservationData.name || (isAuthenticated ? user.name : '')}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                            required
                            size="sm"
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label className="small">Teléfono *</Form.Label>
                          <Form.Control
                            type="tel"
                            value={reservationData.phone}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))}
                            required
                            size="sm"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="small">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={reservationData.email || (isAuthenticated ? user.email : '')}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              email: e.target.value
                            }))}
                            size="sm"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="small">Solicitudes Especiales</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={reservationData.specialRequests}
                            onChange={(e) => setReservationData(prev => ({
                              ...prev,
                              specialRequests: e.target.value
                            }))}
                            size="sm"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12}>
                        <Button 
                          type="submit" 
                          variant="warning" 
                          size="lg" 
                          className="w-100 fw-bold py-2 py-md-3"
                          disabled={!reservationData.date || !reservationData.time || !reservationData.name || !reservationData.phone}
                        >
                          Confirmar Reserva
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="border-0 shadow-sm sticky-md-top" style={{top: '100px'}}>
                <Card.Body className="p-3 p-md-4">
                  <h5 className="fw-bold mb-3 small">ℹ️ Información</h5>
                  
                  <div className="mb-3">
                    <h6 className="fw-semibold small">📍 Ubicación</h6>
                    <p className="small text-muted mb-2">{state.businessConfig.address}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="fw-semibold small">⏰ Horario</h6>
                    <p className="small text-muted mb-2">{state.businessConfig.openingHours}</p>
                  </div>
                  
                  <Alert variant="info" className="small py-2">
                    <strong>Nota:</strong> Las reservas se mantienen por 15 minutos
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Reservations;