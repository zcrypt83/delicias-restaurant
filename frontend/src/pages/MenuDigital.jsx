// src/pages/MenuDigital.jsx
import React, { useState, useCallback } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, InputGroup } from 'react-bootstrap';
import MenuItem from '../components/ui/MenuItem';

function MenuDigital() {
  const { state, dispatch, showNotification } = useRestaurant();
  const [selectedItem, setSelectedItem] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todos', ...new Set(state.menu.map(item => item.category))];

  const filteredItems = state.menu.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  const handleAddToCart = useCallback((item) => {
    if (item.modifiers && Array.isArray(item.modifiers.obligatorios) && item.modifiers.obligatorios.length > 0) {
      setSelectedItem(item);
      setCustomizations({});
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          ...item,
          customizations: {},
          cartId: Date.now()
        }
      });
      showNotification(`${item.name} agregado al carrito`, 'success');
    }
  }, [dispatch, showNotification]);

  const handleCustomizeAndAdd = () => {
    const missingObligatorios = (selectedItem.modifiers && Array.isArray(selectedItem.modifiers.obligatorios) ? selectedItem.modifiers.obligatorios : []).filter(
        modifier => !customizations[modifier.name]
      );


    if (missingObligatorios.length > 0) {
      showNotification('Por favor completa todas las opciones obligatorias', 'error');
      return;
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...selectedItem,
        customizations,
        cartId: Date.now()
      }
    });
    
    showNotification(`${selectedItem.name} agregado al carrito`, 'success');
    setSelectedItem(null);
    setCustomizations({});
  };

  const calculateCustomizedPrice = (item, customizations) => {
    let total = item.price;
    Object.values(customizations).forEach(value => {
      if (typeof value === 'number') {
        total += value;
      }
    });
    return total;
  };

  const formatPrice = (price) => {
    return `S/ ${price.toFixed(2)}`;
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-5 fw-bold text-dark mb-3">Menú Digital</h1>
          <p className="lead text-muted">
            Descubre nuestros auténticos sabores peruanos. Personaliza cada plato a tu gusto.
          </p>
        </Col>
      </Row>

      {/* Filtros y Búsqueda */}
      <Card className="border-0 shadow-sm mb-4 sticky-top bg-white" style={{ top: '76px', zIndex: 1020 }}>
        <Card.Body className="p-4">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                />
              </InputGroup>
            </Col>
            <Col md={6} lg={8}>
              <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'warning' : 'outline-warning'}
                    onClick={() => setActiveCategory(category)}
                    className="text-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Menú */}
      {categories
        .filter(cat => cat !== 'Todos')
        .map(category => {
          const categoryItems = filteredItems.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="mb-5">
              <Row className="mb-4">
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded me-3" style={{ width: '4px', height: '40px' }}></div>
                    <h2 className="h3 fw-bold text-dark mb-0">{category}</h2>
                    <Badge bg="light" text="dark" className="ms-3">
                      {categoryItems.length} items
                    </Badge>
                  </div>
                </Col>
              </Row>

              <Row className="g-4">
                {categoryItems.map((item, index) => (
                  <MenuItem key={item.id} item={item} onAddToCart={handleAddToCart} index={index} />
                ))}
              </Row>
            </div>
          );
        })}

      {/* Modal de Personalización */}
      <Modal show={selectedItem !== null} onHide={() => setSelectedItem(null)} size="lg" centered>
        {selectedItem && (
          <>
            <Modal.Header closeButton className="border-0 p-4">
              <Modal.Title className="w-100">
                <div className="d-flex align-items-center">
                  <span className="fs-2 me-3">{selectedItem.image}</span>
                  <div>
                    <h4 className="mb-1">{selectedItem.name}</h4>
                    <p className="text-muted mb-0">{selectedItem.description}</p>
                  </div>
                </div>
              </Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="p-4">
              {/* Precio Base */}
              <Card className="bg-warning bg-opacity-10 border-warning mb-4">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Precio base:</span>
                    <span className="h5 text-warning fw-bold mb-0">
                      {formatPrice(selectedItem.price)}
                    </span>
                  </div>
                </Card.Body>
              </Card>

              {/* Modificadores Obligatorios */}
              {(selectedItem.modifiers && Array.isArray(selectedItem.modifiers.obligatorios) ? selectedItem.modifiers.obligatorios : []).map(modifier => (
                <div key={modifier.name} className="mb-4">
                  <h6 className="fw-semibold mb-3">
                    {modifier.name} <span className="text-danger">*</span>
                  </h6>
                  <div className="row g-2">
                    {modifier.options.map(option => (
                      <div key={option.name} className="col-12">
                        <Form.Check
                          type="radio"
                          name={modifier.name}
                          id={`${modifier.name}-${option.name}`}
                          label={
                            <div className="d-flex justify-content-between w-100">
                              <span>{option.name}</span>
                              {option.price > 0 && (
                                <span className="text-warning fw-semibold">
                                  +{formatPrice(option.price)}
                                </span>
                              )}
                            </div>
                          }
                          onChange={(e) => setCustomizations({
                            ...customizations,
                            [modifier.name]: {
                              option: option.name,
                              price: option.price
                            }
                          })}
                          className="p-3 border rounded hover-bg-light"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Adiciones Opcionales */}
              {(selectedItem.modifiers && Array.isArray(selectedItem.modifiers.opcionales) && selectedItem.modifiers.opcionales.length > 0) && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Adiciones Opcionales</h6>
                  <div className="row g-2">
                    {(selectedItem.modifiers && Array.isArray(selectedItem.modifiers.opcionales) ? selectedItem.modifiers.opcionales : []).map(modifier => (
                      <div key={modifier.name} className="col-12">
                        <Form.Check
                          type="checkbox"
                          id={`optional-${modifier.name}`}
                          label={
                            <div className="d-flex justify-content-between w-100">
                              <span>{modifier.name}</span>
                              <span className="text-warning fw-semibold">
                                +{formatPrice(modifier.price)}
                              </span>
                            </div>
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCustomizations({
                                ...customizations,
                                [modifier.name]: modifier.price
                              });
                            } else {
                              const newCustomizations = { ...customizations };
                              delete newCustomizations[modifier.name];
                              setCustomizations(newCustomizations);
                            }
                          }}
                          className="p-3 border rounded hover-bg-light"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total y Acciones */}
              <Card className="bg-light border-0">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 mb-0">Total:</span>
                    <span className="h4 text-warning fw-bold">
                      {formatPrice(calculateCustomizedPrice(selectedItem, customizations))}
                    </span>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSelectedItem(null)}
                      size="lg"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="warning"
                      onClick={handleCustomizeAndAdd}
                      size="lg"
                    >
                      <i className="bi bi-cart-check me-2"></i>
                      Agregar al Pedido
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
}

export default MenuDigital;