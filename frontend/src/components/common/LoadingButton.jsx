// src/components/common/LoadingButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

function LoadingButton({
  loading,
  children,
  loadingText = 'Cargando...',
  variant = 'warning',
  size = 'lg',
  className = '',
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={`w-100 fw-bold py-3 shadow-hover ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export default LoadingButton;