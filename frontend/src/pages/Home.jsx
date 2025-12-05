  // src/pages/Home.jsx
  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { useRestaurant } from '../context/RestaurantContext';
  import { 
    Container, Row, Col, Card, Button, Carousel, 
    Badge, Alert, Fade
  } from 'react-bootstrap';

  function Home() {
    const { state } = useRestaurant();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showFeatures, setShowFeatures] = useState(false);

    useEffect(() => {
      setShowFeatures(true);
    }, []);

    const featuredItems = state.menu.slice(0, 6);
    const promotions = [
      {
        title: "🎉 20% OFF en Ceviches",
        description: "Todos los miércoles y viernes",
        image: "🐟",
        bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        buttonText: "Ordenar Ceviche",
        buttonLink: "/menu"
      },
      {
        title: "🍸 2x1 en Pisco Sour",
        description: "De 6pm a 8pm - Happy Hour",
        image: "🍸",
        bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        buttonText: "Ver Bebidas",
        buttonLink: "/menu"
      },
      {
        title: "👨‍👩‍👧‍👦 Menú Familiar",
        description: "Para 4 personas + postre gratis",
        image: "🍽️",
        bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        buttonText: "Ver Menú Familiar",
        buttonLink: "/menu"
      }
    ];

    const stats = [
      { number: '500+', label: 'Clientes Satisfechos', icon: '😊' },
      { number: '50+', label: 'Platos Tradicionales', icon: '🍛' },
      { number: '15+', label: 'Años de Experiencia', icon: '⭐' },
      { number: '98%', label: 'Recomendación', icon: '💖' }
    ];

    const quickActions = [
      {
        icon: '📱',
        title: 'Menú Digital',
        description: 'Explora y personaliza',
        link: '/menu',
        color: 'primary',
        action: () => navigate('/menu')
      },
      {
        icon: '🔄',
        title: 'Auto-Ordenar',
        description: 'Ordena desde tu mesa',
        link: '/self-ordering',
        color: 'success',
        action: () => navigate('/self-ordering')
      },
      {
        icon: '🚚',
        title: 'Delivery',
        description: 'Envío a domicilio',
        link: '/delivery',
        color: 'info',
        action: () => navigate('/delivery')
      },
      {
        icon: '📅',
        title: 'Reservas',
        description: 'Reserva tu mesa',
        link: '/reservations',
        color: 'warning',
        action: () => navigate('/reservations')
      }
    ];

    return (
      <div className="min-vh-100">
        {/* Hero Section */}
        <section className="hero-section position-relative overflow-hidden">
          <Carousel 
            controls={true} 
            indicators={true} 
            interval={5000}
            onSelect={(index) => setCurrentSlide(index)}
            fade
          >
            {promotions.map((promo, index) => (
              <Carousel.Item key={index} className="min-vh-100">
                <div 
                  className="d-flex align-items-center min-vh-100 text-white position-relative"
                  style={{ 
                    background: promo.bg
                  }}
                >
                  <Container className="position-relative">
                    <Row className="justify-content-center text-center align-items-center py-5">
                      <Col lg={8} xl={6}>
                        <div className="display-4 mb-4">
                          {promo.image}
                        </div>
                        <h1 className="display-5 fw-bold mb-4">
                          {promo.title}
                        </h1>
                        <p className="lead mb-5 opacity-90">
                          {promo.description}
                        </p>
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                          <Button 
                            as={Link}
                            to={promo.buttonLink}
                            size="lg" 
                            variant="light"
                            className="px-4 py-3 fw-semibold shadow-hover"
                          >
                            <i className="bi bi-lightning me-2"></i>
                            {promo.buttonText}
                          </Button>
                          <Button 
                            as={Link}
                            to="/menu"
                            variant="outline-light" 
                            size="lg"
                            className="px-4 py-3 fw-semibold hover-scale"
                          >
                            <i className="bi bi-menu-up me-2"></i>
                            Ver Menú Completo
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </section>

        {/* Quick Actions Section */}
        <section className="py-5 bg-white position-relative">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <Badge bg="warning" className="mb-3 px-3 py-2">
                  ⚡ Acciones Rápidas
                </Badge>
                <h2 className="display-5 fw-bold text-dark mb-3">
                  ¿Qué te gustaría hacer?
                </h2>
                <p className="lead text-muted">
                  Elige la forma que prefieras para disfrutar de Delicias
                </p>
              </Col>
            </Row>
            
            <Fade in={showFeatures}>
              <Row className="g-4 justify-content-center">
                {quickActions.map((action, index) => (
                  <Col key={index} xs={12} sm={6} lg={3}>
                    <Card 
                      className="h-100 border-0 shadow-sm hover-scale animated-card"
                      onClick={action.action}
                      style={{ cursor: 'pointer' }}
                    >
                      <Card.Body className="p-4 text-center d-flex flex-column">
                        <div className={`display-4 text-${action.color} mb-3`}>
                          {action.icon}
                        </div>
                        <Card.Title className="h4 mb-3">{action.title}</Card.Title>
                        <Card.Text className="text-muted mb-4 flex-grow-1">
                          {action.description}
                        </Card.Text>
                        
                        <Button 
                          variant={action.color} 
                          className="mt-auto"
                        >
                          Comenzar
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Fade>
          </Container>
        </section>

        {/* Specialties Section */}
        <section className="py-5 bg-light">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <Badge bg="primary" className="mb-3 px-3 py-2">
                  🏆 Especialidades
                </Badge>
                <h2 className="display-5 fw-bold text-dark mb-3">
                  Los Favoritos de la Casa
                </h2>
                <p className="lead text-muted">
                  Los platos más emblemáticos que definen nuestra cocina peruana
                </p>
              </Col>
            </Row>
            
            <Row className="g-4 justify-content-center">
              {featuredItems.map((item, index) => (
                <Col key={item.id} xs={12} sm={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm position-relative hover-scale animated-card">
                    {index < 3 && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <Badge bg="danger" className="pulse-badge">
                          <i className="bi bi-star-fill me-1"></i>
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <Card.Body className="p-4 text-center d-flex flex-column">
                      <div className="display-2 text-warning mb-3">{item.image}</div>
                      
                      <Card.Title className="h4 fw-bold mb-3">{item.name}</Card.Title>
                      
                      <Card.Text className="text-muted mb-4 flex-grow-1">
                        {item.description}
                      </Card.Text>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="h4 text-warning fw-bold mb-0">
                            S/ {item.price.toFixed(2)}
                          </span>
                          <div className="d-flex align-items-center text-muted">
                            <i className="bi bi-clock me-1"></i>
                            <small>{item.preparation_time} min</small>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="outline-secondary" className="text-dark">
                            {item.category}
                          </Badge>
                          {(item.modifiers && Array.isArray(item.modifiers.obligatorios) && item.modifiers.obligatorios.length > 0) && (
                            <Badge bg="info">
                              Personalizable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                    
                    <Card.Footer className="bg-transparent border-0 pt-0">
                      <div className="d-grid gap-2">
                        <Button 
                          variant="warning" 
                          className="w-100"
                          onClick={() => navigate('/menu')}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Agregar al Pedido
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          className="w-100"
                          onClick={() => navigate(`/menu#${item.category}`)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Ver Similar
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            
            <Row className="mt-5">
              <Col className="text-center">
                <Button 
                  onClick={() => navigate('/menu')}
                  variant="warning" 
                  size="lg"
                  className="px-5 py-3 fw-bold pulse-on-hover"
                >
                  <i className="bi bi-menu-button-wide me-2"></i>
                  Ver Menú Completo
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  export default Home;