import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useRestaurant } from '../context/RestaurantContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ClientsManager() {
  const { showNotification } = useRestaurant();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
  });

  // Fetch clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching clients');
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
      showNotification('Error al cargar clientes', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      role: client.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      try {
        const response = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar cliente');
        }

        setClients(clients.filter(c => c.id !== id));
        showNotification('Cliente eliminado exitosamente', 'success');
      } catch (err) {
        showNotification(err.message, 'danger');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      showNotification('Por favor complete los campos requeridos', 'warning');
      return;
    }

    try {
      const method = editingClient ? 'PUT' : 'POST';
      const url = editingClient ? `${API_URL}/users/${editingClient.id}` : `${API_URL}/users`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar cliente');
      }

      if (editingClient) {
        // Update existing client
        const updatedClient = await response.json();
        setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
        showNotification('Cliente actualizado exitosamente', 'success');
      } else {
        // Create new client
        fetchClients();
        showNotification('Cliente creado exitosamente', 'success');
      }

      setShowModal(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', role: 'customer' });
    } catch (err) {
      showNotification(err.message, 'danger');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', role: 'customer' });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role) => {
    const variants = {
      admin: 'danger',
      cajero: 'warning',
      cocinero: 'info',
      mesero: 'primary',
      customer: 'success',
    };
    return variants[role] || 'secondary';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fs-6 fs-md-5">Gestión de Clientes</h5>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          + Nuevo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3 p-md-4">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-sm"
            />
          </Form.Group>

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
                    <th className="small">Nombre</th>
                    <th className="small">Email</th>
                    <th className="small">Teléfono</th>
                    <th className="small">Rol</th>
                    <th className="small text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <tr key={client.id}>
                        <td className="small fw-medium">{client.name}</td>
                        <td className="small">{client.email}</td>
                        <td className="small">{client.phone || '-'}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(client.role)} className="small">
                            {client.role === 'customer' ? 'Cliente' : client.role}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(client)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            disabled={client.role === 'admin'}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted small">
                        No hay clientes para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Edición/Creación */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="small">
            {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
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
              <Form.Label className="small">Email *</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-control-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">Teléfono</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-control-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">Rol</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="form-control-sm"
              >
                <option value="customer">Cliente</option>
                <option value="mesero">Mesero</option>
                <option value="cocinero">Cocinero</option>
                <option value="cajero">Cajero</option>
                <option value="admin">Admin</option>
              </Form.Select>
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

export default ClientsManager;
