// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Tab,
  Tabs,
  InputGroup,
  Badge,
  ProgressBar
} from 'react-bootstrap';

import LoadingButton from '../common/LoadingButton';

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerName: '',
    registerEmail: '',
    registerPhone: '',
    registerPassword: '',
    registerConfirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');

    if (name === 'registerPassword') {
      let strength = 0;
      if (value.length >= 6) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^A-Za-z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthVariant = () => {
    if (passwordStrength < 50) return 'danger';
    if (passwordStrength < 75) return 'warning';
    return 'success';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.loginEmail, formData.loginPassword);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.registerPassword !== formData.registerConfirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.registerName,
      email: formData.registerEmail,
      phone: formData.registerPhone,
      password: formData.registerPassword
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@delicias.com', password: 'admin123', color: 'danger' },
    { role: 'Cocinero', email: 'cocinero@delicias.com', password: 'cocinero123', color: 'warning' },
    { role: 'Mesero', email: 'mesero@delicias.com', password: 'mesero123', color: 'info' },
    { role: 'Cajero', email: 'cajero@delicias.com', password: 'cajero123', color: 'success' },
    { role: 'Cliente', email: 'cliente@delicias.com', password: 'cliente123', color: 'secondary' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData(prev => ({
      ...prev,
      loginEmail: email,
      loginPassword: password
    }));
    setActiveTab('login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <div className="text-center mb-5">
            <div className="display-1 text-warning mb-3 animate-bounce">🍽️</div>
            <h1 className="h1 fw-bold text-gradient mb-3">Bienvenido a Delicias</h1>
            <p className="text-muted lead">Inicia sesión o regístrate para una experiencia gastronómica completa</p>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <Card.Body className="p-0">
              <Row className="g-0">
                <Col md={5} className="d-none d-md-block bg-gradient-primary text-white p-5">
                  <div className="h-100 d-flex flex-column justify-content-center">
                    <h3 className="fw-bold mb-4">¡Descubre el Auténtico Sabor Peruano!</h3>
                    <ul className="list-unstyled mb-4">
                      <li className="mb-3">
                        <i className="bi bi-star-fill me-2 text-warning"></i>
                        Menú digital interactivo
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-lightning-fill me-2 text-warning"></i>
                        Self-ordering desde tu mesa
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-truck me-2 text-warning"></i>
                        Delivery express
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-calendar-check me-2 text-warning"></i>
                        Reservas online
                      </li>
                    </ul>
                    <div className="mt-auto">
                      <Badge bg="warning" text="dark" className="fs-6">
                        🚀 Sistema 100% Digital
                      </Badge>
                    </div>
                  </div>
                </Col>

                <Col md={7}>
                  <div className="p-4 p-md-5">
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(tab) => setActiveTab(tab)}
                      className="mb-4"
                      justify
                    >
                      <Tab eventKey="login" title={
                        <span className="d-flex align-items-center">
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Iniciar Sesión
                        </span>
                      }>
                        <Form onSubmit={handleLogin}>
                          {error && (
                            <Alert variant="danger" className="d-flex align-items-center">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              {error}
                            </Alert>
                          )}
                          
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-envelope me-2 text-warning"></i>
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="loginEmail"
                              value={formData.loginEmail}
                              onChange={handleInputChange}
                              placeholder="tu@email.com"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-lock me-2 text-warning"></i>
                              Contraseña
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="loginPassword"
                              value={formData.loginPassword}
                              onChange={handleInputChange}
                              placeholder="Tu contraseña"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                          </Form.Group>

                          <LoadingButton
                            type="submit"
                            loading={loading}
                            loadingText="Iniciando sesión..."
                          >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Iniciar Sesión
                          </LoadingButton>
                        </Form>
                      </Tab>

                      <Tab eventKey="register" title={
                        <span className="d-flex align-items-center">
                          <i className="bi bi-person-plus me-2"></i>
                          Crear Cuenta
                        </span>
                      }>
                        <Form onSubmit={handleRegister}>
                          {error && (
                            <Alert variant="danger" className="d-flex align-items-center">
                              <i className="bi bi-exclamation-triangle me-2"></i>
                              {error}
                            </Alert>
                          )}
                          
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-person me-2 text-warning"></i>
                              Nombre Completo
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="registerName"
                              value={formData.registerName}
                              onChange={handleInputChange}
                              placeholder="Tu nombre completo"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-envelope me-2 text-warning"></i>
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="registerEmail"
                              value={formData.registerEmail}
                              onChange={handleInputChange}
                              placeholder="tu@email.com"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-phone me-2 text-warning"></i>
                              Teléfono
                            </Form.Label>
                            <InputGroup>
                              <InputGroup.Text className="bg-light border-0">+51</InputGroup.Text>
                              <Form.Control
                                type="tel"
                                name="registerPhone"
                                value={formData.registerPhone}
                                onChange={handleInputChange}
                                placeholder="XXX XXX XXX"
                                size="lg"
                                className="shadow-sm border-0 bg-light"
                              />
                            </InputGroup>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-shield-lock me-2 text-warning"></i>
                              Contraseña
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="registerPassword"
                              value={formData.registerPassword}
                              onChange={handleInputChange}
                              placeholder="Mínimo 6 caracteres"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                            {formData.registerPassword && (
                              <div className="mt-2">
                                <ProgressBar 
                                  now={passwordStrength} 
                                  variant={getPasswordStrengthVariant()}
                                  className="mb-1"
                                />
                                <small className={`text-${getPasswordStrengthVariant()}`}>
                                  Fortaleza de la contraseña: {passwordStrength}%
                                </small>
                              </div>
                            )}
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-shield-check me-2 text-warning"></i>
                              Confirmar Contraseña
                            </Form.Label>
                            <Form.Control
                              type="password"
                              name="registerConfirmPassword"
                              value={formData.registerConfirmPassword}
                              onChange={handleInputChange}
                              placeholder="Repite tu contraseña"
                              required
                              size="lg"
                              className="shadow-sm border-0 bg-light"
                            />
                          </Form.Group>

                          <LoadingButton
                            type="submit"
                            loading={loading}
                            loadingText="Creando cuenta..."
                          >
                            <i className="bi bi-person-check me-2"></i>
                            Crear Cuenta
                          </LoadingButton>
                        </Form>
                      </Tab>
                    </Tabs>

                    <div className="mt-4">
                      <h6 className="text-center text-muted mb-3">
                        <i className="bi bi-rocket-takeoff me-2"></i>
                        Cuentas de Demo
                      </h6>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {demoAccounts.map((account, index) => (
                          <LoadingButton
                            key={index}
                            variant={`outline-${account.color}`}
                            size="sm"
                            onClick={() => fillDemoAccount(account.email, account.password)}
                            className="text-nowrap"
                            loading={false}
                          >
                            <i className={`bi bi-person-badge me-1 text-${account.color}`}></i>
                            {account.role}
                          </LoadingButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <LoadingButton
              as={Link}
              to="/"
              variant="outline-dark"
              className="d-flex align-items-center justify-content-center mx-auto"
              loading={false}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Continuar sin cuenta
            </LoadingButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;