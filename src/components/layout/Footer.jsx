// src/components/layout/Footer.jsx
import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-5">
      {/* Sección principal del footer */}
      <Container className="py-4">
        <Row className="g-4">
          {/* Información del restaurante */}
          <Col lg={4} md={6}>   
            <div className="d-flex align-items-center mb-3">
              <div className="bg-transparent">
                <img 
                  src={logo} 
                  alt="Delicias Restaurant" 
                  style={{ 
                    width: '40px', 
                    height: '40px',
                  }}
                />
              </div>
              <h5 className="text-warning mb-0 fw-bold">Delicias Restaurant</h5>
            </div>
            <p className="text-light mb-3">
              Auténtica cocina peruana con los sabores tradicionales de nuestro país. 
              Frescura, calidad y sabor en cada plato.
            </p>
            <div className="d-flex gap-3">
              <Button 
                variant="outline-warning" 
                size="sm"
                href="https://facebook.com"
                target="_blank"
              >
                <i className="bi bi-facebook"></i>
              </Button>
              <Button 
                variant="outline-warning" 
                size="sm"
                href="https://instagram.com"
                target="_blank"
              >
                <i className="bi bi-instagram"></i>
              </Button>
              <Button 
                variant="outline-warning" 
                size="sm"
                href="https://whatsapp.com"
                target="_blank"
              >
                <i className="bi bi-whatsapp"></i>
              </Button>
            </div>
          </Col>

          {/* Enlaces rápidos */}
          <Col lg={2} md={6}>
            <h6 className="text-warning mb-3 fw-semibold">Navegación</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none hover-text-warning">
                  <i className="bi bi-house me-2"></i>Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/menu" className="text-light text-decoration-none hover-text-warning">
                  <i className="bi bi-menu-up me-2"></i>Menú
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/reservations" className="text-light text-decoration-none hover-text-warning">
                  <i className="bi bi-calendar me-2"></i>Reservas
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/delivery" className="text-light text-decoration-none hover-text-warning">
                  <i className="bi bi-bicycle me-2"></i>Delivery
                </Link>
              </li>
            </ul>
          </Col>

          {/* Información de contacto */}
          <Col lg={3} md={6}>
            <h6 className="text-warning mb-3 fw-semibold">Contacto</h6>
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-geo-alt text-warning me-2"></i>
                <span className="small">Av. Principal 123, Lima, Perú</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone text-warning me-2"></i>
                <span className="small">+51 987 654 321</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope text-warning me-2"></i>
                <span className="small">info@delicias.com</span>
              </div>
            </div>
            <Badge bg="success" className="mb-2">
              <i className="bi bi-clock me-1"></i>
              Abierto hoy: 12:00 - 23:00
            </Badge>
          </Col>

          {/* App móvil y newsletter */}
          <Col lg={3} md={6}>
            <h6 className="text-warning mb-3 fw-semibold">Descarga nuestra App</h6>
            <p className="small text-light mb-3">
              Ordena más rápido y recibe promociones exclusivas
            </p>
            <div className="d-grid gap-2">
              <Button variant="outline-light" size="sm" className="d-flex align-items-center justify-content-center">
                <i className="bi bi-google-play me-2"></i>
                Google Play
              </Button>
              <Button variant="outline-light" size="sm" className="d-flex align-items-center justify-content-center">
                <i className="bi bi-apple me-2"></i>
                App Store
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Línea separadora */}
      <div className="border-top border-secondary"></div>

      {/* Footer inferior */}
      <Container className="py-2">
        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 small text-light">
              © {currentYear} Delicias Restaurant. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex flex-wrap justify-content-md-end gap-3 small">
              <Link to="/privacy" className="text-light text-decoration-none">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="text-light text-decoration-none">
                Términos de Servicio
              </Link>
              <Link to="/about" className="text-light text-decoration-none">
                Nosotros
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;