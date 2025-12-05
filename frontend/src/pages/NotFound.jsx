// src/pages/NotFound.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={6}>
          <div className="display-1 text-muted mb-4">🔍</div>
          <h1 className="h2 mb-4">Página No Encontrada</h1>
          <p className="text-muted mb-4">
            La página que estás buscando no existe o fue movida a otro lugar.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Button as="a" href="/" variant="warning">
              <i className="bi bi-house me-2"></i>
              Volver al Inicio
            </Button>
            <Button as="a" href="/menu" variant="outline-warning">
              <i className="bi bi-menu-up me-2"></i>
              Ver Menú
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
