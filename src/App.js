// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Páginas públicas
import Home from './pages/Home';
import MenuDigital from './pages/MenuDigital';
import Reservations from './pages/Reservations';
import Cart from './pages/Cart';
import Delivery from './pages/Delivery';
import SelfOrdering from './pages/SelfOrdering';
import Orders from './pages/Orders';
import Login from './components/auth/Login';
import Profile from './pages/Profile';

// Páginas de admin/staff
import AdminPanel from './admin/AdminPanel';
import StaffDashboard from './staff/StaffDashboard';
import CocineroPanel from './staff/CocineroPanel';
import MeseroPanel from './staff/MeseroPanel';
import CajeroPanel from './staff/CajeroPanel';


// importación de styles
import './styles/animations.css';
import './styles/Layout.css';
import './styles/navigations.css';

function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuDigital />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/self-ordering" element={<SelfOrdering />} />
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas - Cliente */}
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Rutas protegidas - Staff Dashboard */}
                <Route 
                  path="/staff/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'mesero', 'cocinero', 'cajero']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Rutas protegidas - Admin */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />

                {/* Rutas protegidas - Staff */}
                <Route 
                  path="/staff/orders" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'mesero']}>
                      <MeseroPanel />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/staff/kitchen" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'cocinero']}>
                      <CocineroPanel />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/staff/cashier" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'cajero']}>
                      <CajeroPanel />
                    </ProtectedRoute>
                  } 
                />

                {/* Rutas legacy */}
                <Route 
                  path="/cocina" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'cocinero']}>
                      <CocineroPanel />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/mesero" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'mesero']}>
                      <MeseroPanel />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/caja" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'cajero']}>
                      <CajeroPanel />
                    </ProtectedRoute>
                  } 
                />

                {/* Ruta 404 */}
                <Route path="*" element={
                  <Container className="py-5">
                    <Row className="justify-content-center text-center">
                      <Col md={6}>
                        <div className="display-1 text-muted mb-4">🔍</div>
                        <h1 className="h2 mb-4">Página No Encontrada</h1>
                        <p className="text-muted mb-4">
                          La página que estás buscando no existe.
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
                } />
              </Routes>
            </Layout>
          </div>
        </Router>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;