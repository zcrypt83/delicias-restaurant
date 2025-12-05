// src/components/layout/Navigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Navbar, Nav, Container, Badge, Button, 
  Offcanvas, Tooltip, OverlayTrigger, Dropdown
} from 'react-bootstrap';

// Componentes y utilidades reutilizables
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import useResponsive from '../../hooks/UseResponsive';
import useCart from '../../hooks/UseCart';
import usePermissions from '../../hooks/UsePermissions';
import { getNavigationRoutes } from '../../utils/NavigationRoutes';
import PriceFormatter from '../common/PriceFormatter';
import BadgeRole from '../common/BadgeRole';
import logo from '../../img/logo.png';

function Navigation({ onToggleSidebar, sidebarCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const { state, dispatch } = useRestaurant();
  
  const { isMobile } = useResponsive(992);
  const { itemCount, total, items } = useCart();
  const { isAdmin, isStaff } = usePermissions();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [isCartPulsing, setIsCartPulsing] = useState(false);

  const cartItemCount = itemCount;
  const cartTotal = total;
  
  const prevCartItemCount = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCartItemCount.current) {
      setIsCartPulsing(true);
      const timer = setTimeout(() => {
        setIsCartPulsing(false);
      }, 500); // Duración de la animación
      return () => clearTimeout(timer);
    }
    prevCartItemCount.current = cartItemCount;
  }, [cartItemCount]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
  };

  const NavigationLink = ({ item, mobile = false }) => {
    const isActive = item.exact 
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

    const linkContent = (
      <div className={`d-flex align-items-center ${mobile ? 'py-3 px-3' : 'p-3'} ${
        isActive ? 'text-warning bg-warning bg-opacity-10 rounded' : 'text-dark hover-bg-light'
      } transition-all`}>
        <span className={`${sidebarCollapsed && !mobile ? 'mx-auto' : 'me-3'}`} style={{ width: '24px', textAlign: 'center' }}>
          {item.icon}
        </span>
        {(!sidebarCollapsed || mobile) && (
          <div className="d-flex align-items-center justify-content-between w-100">
            <span className="fw-medium">{item.label}</span>
            {item.staffOnly && (
              <Badge bg="warning" text="dark" className="ms-2 fs-7">Staff</Badge>
            )}
          </div>
        )}
      </div>
    );

    if (sidebarCollapsed && !mobile && !isMobile) {
      return (
        <OverlayTrigger placement="right" overlay={<Tooltip>{item.label}</Tooltip>}>
          <Nav.Link as={Link} to={item.path} className="p-0 mx-2 my-1 rounded">
            {linkContent}
          </Nav.Link>
        </OverlayTrigger>
      );
    }

    return (
      <Nav.Link as={Link} to={item.path} className="p-0 mx-2 my-1 rounded">
        {linkContent}
      </Nav.Link>
    );
  };

  const CartSidebarItem = () => (
    <div className="border-top pt-3 mt-3">
      <div 
        className="d-flex align-items-center p-3 bg-light rounded cursor-pointer hover-scale"
        onClick={() => {
          navigate('/cart');
          setMobileOpen(false);
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="position-relative">
          <i className="bi bi-cart3 fs-4 text-warning"></i>
          {cartItemCount > 0 && (
            <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
              {cartItemCount}
            </Badge>
          )}
        </div>
        {!sidebarCollapsed && (
          <div className="ms-3 flex-grow-1">
            <div className="fw-bold text-dark small">Mi Carrito</div>
            <small className="text-muted">
              {cartItemCount === 0 ? 'Carrito vacío' : `${cartItemCount} items - `}
              <PriceFormatter price={cartTotal} />
            </small>
          </div>
        )}
        {!sidebarCollapsed && cartItemCount > 0 && (
          <i className="bi bi-chevron-right text-muted"></i>
        )}
      </div>
      
      {!sidebarCollapsed && cartItemCount > 0 && (
        <div className="mt-2">
          <Button 
            as={Link} 
            to="/cart" 
            variant="warning" 
            size="sm" 
            className="w-100"
            onClick={() => setMobileOpen(false)}
          >
            Ver Carrito Completo
          </Button>
        </div>
      )}
    </div>
  );

  const CartDropdown = () => (
    <Dropdown 
      align="end" 
      onToggle={(isOpen) => setShowCartPreview(isOpen)}
      className="d-none d-lg-block"
    >
      <Dropdown.Toggle 
        variant="outline-warning" 
        className="position-relative border-0 bg-transparent"
        style={{ width: '45px', height: '45px' }}
      >
        <i className="bi bi-cart3"></i>
        {cartItemCount > 0 && (
          <Badge 
            bg="danger" 
            className={`position-absolute top-0 start-100 ${isCartPulsing ? 'pulse-badge' : ''}`}
            style={{ fontSize: '0.6rem' }}
          >
            {cartItemCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-3" style={{ minWidth: '320px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 fw-bold">🛒 Mi Carrito</h6>
          <Badge bg="warning" text="dark">
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-3">
            <i className="bi bi-cart-x fs-1 text-muted"></i>
            <p className="text-muted mb-0 small">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="mb-3">
              {items.slice(0, 3).map(item => (
                <div key={item.cartId} className="d-flex align-items-center py-2 border-bottom">
                  <div className="flex-grow-1">
                    <div className="fw-medium small">{item.name}</div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="outline-secondary" className="text-dark fs-7">
                        x{item.quantity || 1}
                      </Badge>
                      <small className="text-warning fw-semibold">
                        <PriceFormatter price={item.price * (item.quantity || 1)} />
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFromCart(item.cartId, item.name)}
                    className="ms-2"
                    style={{ width: '28px', height: '28px', padding: 0 }}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
              {items.length > 3 && (
                <div className="text-center py-2">
                  <small className="text-muted">
                    +{items.length - 3} más items...
                  </small>
                </div>
              )}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Total:</span>
                <span className="h5 mb-0 text-warning">
                  <PriceFormatter price={cartTotal} />
                </span>
              </div>
              
              <div className="d-grid gap-2">
                <Button 
                  variant="warning" 
                  onClick={() => {
                    navigate('/cart');
                    setShowCartPreview(false);
                  }}
                  className="w-100"
                >
                  <i className="bi bi-cart-check me-2"></i>
                  Ver Carrito Completo
                </Button>
                <Button 
                  variant="outline-success"
                  onClick={() => {
                    navigate('/delivery');
                    setShowCartPreview(false);
                  }}
                  className="w-100"
                >
                  <i className="bi bi-bag-check me-2"></i>
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  const DesktopSidebar = () => (
    <div 
      className={`sidebar bg-white shadow-sm border-end vh-100 position-fixed d-flex flex-column ${
        sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
      style={{
        width: sidebarCollapsed ? '80px' : '260px',
        zIndex: 1030,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div className="sidebar-header border-bottom p-2">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <div className="bg-transparent rounded-circle d-flex align-items-center justify-content-center">
              <img 
                src={logo} 
                alt="Delicias Restaurant" 
                style={{ 
                  width: '50px', 
                  height: '50px',
                  objectFit: 'contain'
                }}
              />
            </div>
            {!sidebarCollapsed && (
              <div className="ms-3">
                <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Delicias Restaurant</div>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>Cocina Peruana</small>
              </div>
            )}
          </div>
          
          <Button
            variant="outline-secondary"
            className="toggle-sidebar-btn rounded-circle d-flex align-items-center justify-content-center border-0"
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent'
            }}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'} text-muted`}></i>
          </Button>
        </div>
      </div>

      <div className="sidebar-content flex-grow-1 px-2 py-3" style={{ overflowY: 'auto' }}>
        <Nav className="flex-column gap-1">
          {getNavigationRoutes(user, isAuthenticated, hasRole).map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
          
          <CartSidebarItem />
        </Nav>
      </div>

      <div className="sidebar-footer border-top p-3">
        {isAuthenticated ? (
          <div className={`d-flex align-items-center ${sidebarCollapsed ? 'justify-content-center' : ''}`}>
            <div className="position-relative">
              <i className="bi bi-person-circle fs-4 text-warning"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="ms-3 flex-grow-1 text-center">
                <div className="fw-bold text-dark small">{user.name.split(' ')[0]}</div>
                <small className="text-muted d-block">{user.email}</small>
                <BadgeRole role={user.role} />
              </div>
            )}
          </div>
        ) : (
          !sidebarCollapsed && (
            <div className="text-center">
              <Button as={Link} to="/login" variant="warning" size="sm" className="w-75 mb-2">
                Iniciar Sesión
              </Button>
              <Button as={Link} to="/login" variant="outline-warning" size="sm" className="w-75">
                Registrarse
              </Button>
            </div>
          )
        )}
        
        {isAuthenticated && !sidebarCollapsed && (
          <div className="text-center mt-3">
            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="w-75">
              Cerrar Sesión
            </Button>
          </div>
        )}
        
        {isAuthenticated && sidebarCollapsed && !isMobile && (
          <div className="text-center">
            <OverlayTrigger placement="right" overlay={<Tooltip>Cerrar Sesión</Tooltip>}>
              <Button variant="outline-danger" size="sm" onClick={handleLogout} className="rounded-circle p-2">
                <i className="bi bi-box-arrow-right"></i>
              </Button>
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );

  const MobileHeader = () => (
    <Navbar expand="lg" className="bg-white shadow-sm border-bottom d-lg-none" variant="light" fixed="top">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold">
          <div className="bg-transparent rounded-circle p-2 me-2 d-flex align-items-center justify-content-center">
            <img 
              src={logo} 
              alt="Delicias Restaurant" 
              style={{ 
                width: '20px', 
                height: '20px',
              }}
            />
          </div>
          <span className="text-dark">Delicias</span>
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-2">
          <Button 
            as={Link} 
            to="/cart" 
            variant="outline-warning" 
            size="sm" 
            className="position-relative"
          >
            <i className="bi bi-cart3"></i>
            {cartItemCount > 0 && (
              <Badge 
                bg="danger" 
                className="position-absolute top-0 start-100 translate-middle" 
                style={{ fontSize: '0.6rem' }}
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
          
          {isAuthenticated && (
            <Badge bg="secondary" className="d-none d-sm-block">
              {user.name.split(' ')[0]}
            </Badge>
          )}

          <Button variant="outline-dark" size="sm" onClick={() => setMobileOpen(true)} style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-list"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <DesktopSidebar />
        <div 
          className="position-fixed top-0 end-0 m-3" 
          style={{ zIndex: 1040 }}
        >
          <CartDropdown />
        </div>
      </div>

      <MobileHeader />

      <Offcanvas show={mobileOpen} onHide={() => setMobileOpen(false)} placement="start" className="mobile-sidebar">
        <Offcanvas.Header closeButton className="bg-warning text-dark border-bottom">
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <div className="bg-transparent text-warning rounded-circle p-2 me-3 d-flex align-items-center justify-content-center">
                <img 
                  src={logo} 
                  alt="Delicias Restaurant" 
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div>
                <div className="fw-bold">Delicias Restaurant</div>
                <small className="opacity-75">Cocina Peruana</small>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0 d-flex flex-column">
          <div className="flex-grow-1">
            <Nav className="flex-column">
              {getNavigationRoutes(user, isAuthenticated, hasRole).map((item) => (
                <NavigationLink key={item.path} item={item} mobile={true} />
              ))}
            </Nav>
          </div>

          <div className="border-top bg-light p-3">
            <div 
              className="d-flex align-items-center justify-content-between p-3 bg-white rounded cursor-pointer hover-scale"
              onClick={() => {
                navigate('/cart');
                setMobileOpen(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                <div className="position-relative">
                  <i className="bi bi-cart3 fs-4 text-warning"></i>
                  {cartItemCount > 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                      {cartItemCount}
                    </Badge>
                  )}
                </div>
                <div className="ms-3">
                  <div className="fw-bold">Mi Carrito</div>
                  <small className="text-muted">
                    {cartItemCount === 0 ? 'Carrito vacío' : `${cartItemCount} items - `}
                    <PriceFormatter price={cartTotal} />
                  </small>
                </div>
              </div>
              {cartItemCount > 0 && <i className="bi bi-chevron-right text-muted"></i>}
            </div>

            {cartItemCount > 0 && (
              <div className="mt-3">
                <Button 
                  as={Link} 
                  to="/cart" 
                  variant="warning" 
                  className="w-100 mb-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <i className="bi bi-cart-check me-2"></i>
                  Ver Carrito Completo
                </Button>
                <Button 
                  as={Link} 
                  to="/delivery" 
                  variant="outline-success" 
                  className="w-100"
                  onClick={() => setMobileOpen(false)}
                >
                  <i className="bi bi-bag-check me-2"></i>
                  Finalizar Pedido
                </Button>
              </div>
            )}
          </div>

          <div className="border-top bg-light">
            {isAuthenticated ? (
              <div className="p-3 text-center">
                <div className="d-flex align-items-center mb-3 justify-content-center">
                  <i className="bi bi-person-circle fs-2 text-warning me-3"></i>
                  <div>
                    <div className="fw-bold">{user.name}</div>
                    <small className="text-muted d-block">{user.email}</small>
                    <BadgeRole role={user.role} />
                  </div>
                </div>
                
                <Button variant="outline-danger" onClick={handleLogout} className="w-100">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="p-3 text-center">
                <Button as={Link} to="/login" variant="warning" className="w-100 mb-2" onClick={() => setMobileOpen(false)}>
                  Iniciar Sesión
                </Button>
                <Button as={Link} to="/login" variant="outline-warning" className="w-100" onClick={() => setMobileOpen(false)}>
                  Crear Cuenta
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-lg-none" style={{ height: '76px' }}></div>
    </>
  );
}

export default Navigation;