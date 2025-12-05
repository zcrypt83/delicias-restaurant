import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useRestaurant } from '../context/RestaurantContext';
import PriceFormatter from '../components/common/PriceFormatter';
import StatusBadge from '../components/common/StatusBadge';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProductsManager() {
  const { showNotification, state, dispatch } = useRestaurant();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'list'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'platos',
    image: '🍽️',
    is_available: true,
  });

  // Fetch products
  useEffect(() => {
    // Carga inicial
    fetchProducts();
    // Ahora confiamos en las actualizaciones del contexto vía WebSocket
  }, []);

  // Mantener sincronizado el estado local con el menú del contexto (actualizaciones en tiempo real)
  useEffect(() => {
    if (state && Array.isArray(state.menu)) {
      setProducts(state.menu);
    }
  }, [state.menu]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching products');
      }

      const data = await response.json();
      setProducts(data);
      // Sincronizar con el contexto
      if (dispatch) {
        dispatch({ type: 'SET_MENU', payload: data });
      }
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar productos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '🍽️',
      is_available: product.is_available,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar producto');
        }

        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        // Sincronizar con contexto
        if (dispatch) {
          dispatch({ type: 'SET_MENU', payload: updated });
        }
        showNotification('Producto eliminado exitosamente', 'success');
      } catch (err) {
        showNotification(err.message, 'danger');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      showNotification('Por favor complete los campos requeridos', 'warning');
      return;
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          is_available: formData.is_available === true || formData.is_available === 'true',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar producto');
      }

      if (editingProduct) {
        // Update existing product
        const updatedProduct = await response.json();
        const updated = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
        setProducts(updated);
        // Sincronizar con contexto
        if (dispatch) {
          dispatch({ type: 'SET_MENU', payload: updated });
        }
        showNotification('Producto actualizado exitosamente', 'success');
      } else {
        // Create new product
        showNotification('Producto creado exitosamente', 'success');
        fetchProducts(); // Recarga la lista completa
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'platos',
        image: '🍽️',
        is_available: true,
      });
    } catch (err) {
      showNotification(err.message, 'danger');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'platos',
      image: '🍽️',
      is_available: true,
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fs-6 fs-md-5">🍽️ Gestión Completa de Menú</h5>
        <div className="d-flex gap-2">
          <Button 
            variant={viewMode === 'table' ? 'primary' : 'outline-primary'} 
            size="sm" 
            onClick={() => setViewMode('table')}
          >
            📋 Tabla
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
            size="sm" 
            onClick={() => setViewMode('list')}
          >
            👁️ Vista Previa
          </Button>
          <Button variant="success" size="sm" onClick={() => setShowModal(true)}>
            + Nuevo
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Vista Tabla */}
      {viewMode === 'table' && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-3 p-md-4">
            <Row className="g-2 mb-3">
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-sm"
                />
              </Col>
            </Row>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover size="sm" className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="small">Imagen</th>
                      <th className="small">Nombre</th>
                      <th className="small">Categoría</th>
                      <th className="small text-end">Precio</th>
                      <th className="small">Estado</th>
                      <th className="small text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td className="fs-5">{product.image}</td>
                          <td className="small fw-medium">{product.name}</td>
                          <td className="small">{product.category}</td>
                          <td className="text-end small fw-semibold">
                            <PriceFormatter price={product.price} />
                          </td>
                          <td>
                            <Badge bg={product.is_available ? 'success' : 'danger'} className="small">
                              {product.is_available ? 'Disponible' : 'Agotado'}
                            </Badge>
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted small">
                          No hay productos para mostrar
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Vista Previa - Menú en Vivo */}
      {viewMode === 'list' && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fs-6 fs-md-5">👁️ Vista Previa del Menú (Como aparecerá en la app)</h5>
              <small className="text-muted">Se recarga automáticamente cada 5 segundos</small>
            </div>
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="d-flex align-items-center justify-content-between p-3 border rounded mb-3"
                      style={{ opacity: product.is_available ? 1 : 0.5 }}
                    >
                      <div className="d-flex align-items-center flex-grow-1">
                        <span className="fs-3 me-3">{product.image}</span>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{product.name}</div>
                          <div className="text-muted small">{product.description}</div>
                          <div className="text-warning fw-semibold"><PriceFormatter price={product.price} /></div>
                          <div className="text-muted small">{product.category}</div>
                        </div>
                      </div>
                      <div className="ms-3 text-end">
                        <div className="mb-2">
                          <StatusBadge 
                            status={product.is_available ? 'disponible' : 'agotado'} 
                            type="item" 
                          />
                        </div>
                        <Button
                          variant={product.is_available ? 'outline-danger' : 'outline-success'}
                          size="sm"
                          onClick={() => {
                            const updated = products.map(p => 
                              p.id === product.id ? { ...p, is_available: !p.is_available } : p
                            );
                            setProducts(updated);
                            if (dispatch) {
                              dispatch({ type: 'SET_MENU', payload: updated });
                            }
                          }}
                          className="fs-7"
                        >
                          {product.is_available ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    No hay productos para mostrar
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal de Edición/Creación */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="small">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small">Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control-sm"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Precio *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-control-sm"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Categoría</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control-sm"
                  >
                    <option value="platos">Platos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="postres">Postres</option>
                    <option value="entradas">Entradas</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small">Emoji/Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="form-control-sm"
                maxLength="2"
              />
              <small className="text-muted">Usa emojis (ej: 🍕, 🍜, 🍰)</small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Disponible"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductsManager;
