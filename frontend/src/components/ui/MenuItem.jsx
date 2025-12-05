// src/components/ui/MenuItem.jsx
import React from 'react';
import { Card, Button, Badge, Col } from 'react-bootstrap';

const formatPrice = (price) => {
  return `S/ ${price.toFixed(2)}`;
};

const MenuItem = ({ item, onAddToCart, index }) => {
  return (
    <Col 
      xs={12} 
      md={6} 
      lg={4} 
      className="fade-in-up" 
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="h-100 border-0 shadow-sm hover-lift">
        <Card.Body className="p-4 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#fff3cd', borderRadius: '8px', flexShrink: 0 }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <Badge bg="success">
              {item.preparation_time} min
            </Badge>
          </div>
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <Card.Title className="h5 fw-bold mb-0">{item.name}</Card.Title>
              <span className="h5 text-warning fw-bold mb-0">
                {formatPrice(item.price)}
              </span>
            </div>
            
            <Card.Text className="text-muted mb-3">
              {item.description}
            </Card.Text>
            
            <div className="d-flex flex-wrap gap-2 mb-3">
              {(item.modifiers && Array.isArray(item.modifiers.obligatorios) && item.modifiers.obligatorios.length > 0) && (
                <Badge bg="primary">
                  Personalizable
                </Badge>
              )}
              {(item.modifiers && Array.isArray(item.modifiers.opcionales) && item.modifiers.opcionales.length > 0) && (
                <Badge bg="info">
                  Adiciones disponibles
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="warning"
            className="w-100 fw-semibold"
            onClick={() => onAddToCart(item)}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Agregar al Pedido
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default React.memo(MenuItem);
