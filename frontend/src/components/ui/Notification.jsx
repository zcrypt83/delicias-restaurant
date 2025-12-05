// src/components/ui/Notification.jsx
import React, { useEffect } from 'react';
import { Toast } from 'react-bootstrap';

function Notification({ id, message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getVariant = () => {
    const variants = {
      'success': 'success',
      'error': 'danger', 
      'warning': 'warning',
      'info': 'info'
    };
    return variants[type] || 'info';
  };

  const getIcon = () => {
    const icons = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️', 
      'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  return (
    <Toast 
      bg={getVariant()} 
      className="text-white border-0 shadow-lg animate-fade-in-up"
      onClose={() => onClose(id)}
      delay={5000}
      autohide
    >
      <Toast.Header className={`bg-${getVariant()} text-white border-0`}>
        <strong className="me-auto d-flex align-items-center">
          <span className="me-2">{getIcon()}</span>
          Notificación
        </strong>
        <small>ahora</small>
      </Toast.Header>
      <Toast.Body className="fw-medium">{message}</Toast.Body>
    </Toast>
  );
}

export default Notification;