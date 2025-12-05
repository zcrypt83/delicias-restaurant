import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/api';

function Reservations() {
  const { state: restaurantState } = useRestaurant();
  const { isAuthenticated, user } = useAuth();
  
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: user ? user.name : '',
    phone: '',
    email: user ? user.email : '',
  });
  
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: '' });

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.getMyReservations()
        .then(res => {
          setMyReservations(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError('No se pudieron cargar tus reservas.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const availableTimes = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: '' });

    if (!restaurantState.businessConfig.reservationsEnabled) {
      setSubmitStatus({ error: 'El sistema de reservas no está disponible temporalmente' });
      return;
    }

    const reservation_date = `${reservationData.date} ${reservationData.time}:00`;

    const payload = {
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      reservation_date,
      number_of_guests: reservationData.guests,
    };

    setLoading(true);
    try {
      await apiClient.createReservation(payload);
      setSubmitStatus({ success: true, error: '' });
      // Refresh reservations
      if (isAuthenticated) {
        const res = await apiClient.getMyReservations();
        setMyReservations(res.data);
      }
      // Reset form
      setReservationData({
        date: '', time: '', guests: 2, name: user ? user.name : '', 
        phone: '', email: user ? user.email : ''
      });
    } catch (err) {
      setSubmitStatus({ success: false, error: err.response?.data?.error || 'Error al crear la reserva.' });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  if (!restaurantState.businessConfig.reservationsEnabled) {
    return (
      <Container className="py-5 text-center">
        <div className="fs-1 mb-3">🚧</div>
        <h2>Reservas No Disponibles</h2>
        <p className="text-muted">Por favor, contacta directamente al restaurante.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="text-center mb-4">
            <h1>Reserva tu Mesa</h1>
            <p className="text-muted">Asegura tu experiencia gastronómica</p>
          </div>

          <Row className="g-4">
            <Col md={7}>
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="mb-3">Completa tus datos</h5>
                  <Form onSubmit={handleSubmit}>
                     {submitStatus.error && <Alert variant="danger">{submitStatus.error}</Alert>}
                     {submitStatus.success && <Alert variant="success">¡Reserva creada con éxito!</Alert>}
                    <Row className="g-3">
                      {/* Form fields remain the same, just ensure they update state correctly */}
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Fecha</Form.Label>
                          <Form.Control type="date" min={today} value={reservationData.date} onChange={e => setReservationData({...reservationData, date: e.target.value})} required />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Hora</Form.Label>
                          <Form.Select value={reservationData.time} onChange={e => setReservationData({...reservationData, time: e.target.value})} required>
                            <option value="">Selecciona hora</option>
                            {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Personas</Form.Label>
                          <Form.Select value={reservationData.guests} onChange={e => setReservationData({...reservationData, guests: parseInt(e.target.value)})}>
                             {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>)}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control type="text" value={reservationData.name} onChange={e => setReservationData({...reservationData, name: e.target.value})} required />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group>
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control type="tel" value={reservationData.phone} onChange={e => setReservationData({...reservationData, phone: e.target.value})} required />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control type="email" value={reservationData.email} onChange={e => setReservationData({...reservationData, email: e.target.value})} required />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Button type="submit" variant="warning" size="lg" className="w-100 fw-bold" disabled={loading}>
                          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Confirmar Reserva'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>
              {isAuthenticated && (
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Mis Reservas</h5>
                    {loading && <div className="text-center"><Spinner animation="border" /></div>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {!loading && !error && myReservations.length === 0 && <p className="text-muted">No tienes reservas activas.</p>}
                    {!loading && !error && myReservations.length > 0 && (
                      <ListGroup variant="flush">
                        {myReservations.map(res => (
                          <ListGroup.Item key={res.id} className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{new Date(res.reservation_date).toLocaleDateString()}</strong> - {new Date(res.reservation_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              <br />
                              <small>{res.number_of_guests} personas</small>
                            </div>
                            <Badge bg={getStatusBadge(res.status)} pill>{res.status}</Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              )}
               {!isAuthenticated && (
                 <Alert variant="info">
                    <Alert.Heading>¡Inicia Sesión!</Alert.Heading>
                    <p>
                       <Link to="/login">Inicia sesión</Link> o <Link to="/login" state={{ from: { pathname: "/reservations" }}}>regístrate</Link> para ver y gestionar tus reservas fácilmente.
                    </p>
                 </Alert>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Reservations;