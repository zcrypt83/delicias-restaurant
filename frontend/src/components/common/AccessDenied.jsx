// src/components/common/AccesDenied.jsx 
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function AccessDenied({ 
  title = "Acceso Denegado", 
  message, 
  icon = "🚫", 
  variant = "danger",
  showHomeButton = true,
  showStaffButton = false 
}) {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="p-5">
              <div className={`display-1 text-${variant} mb-4`}>{icon}</div>
              <h2 className="h3 mb-3">{title}</h2>
              <p className="text-muted mb-4">{message}</p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                {showHomeButton && (
                  <Button as="a" href="/" variant="warning">
                    <i className="bi bi-house me-2"></i>
                    Ir al Inicio
                  </Button>
                )}
                {showStaffButton && (
                  <Button as="a" href="/staff/dashboard" variant="outline-primary">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard Staff
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AccessDenied;