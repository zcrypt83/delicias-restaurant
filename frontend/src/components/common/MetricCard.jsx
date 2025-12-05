// src/components/common/MetricCard.jsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  variant = 'primary', 
  icon, 
  trend,
  className = '',
  onClick 
}) {
  return (
    <Card 
      className={`border-0 text-center h-100 ${className} ${onClick ? 'cursor-pointer hover-scale' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card.Body className="p-3">
        <div className={`bg-${variant} bg-opacity-10 rounded-circle p-2 d-inline-flex align-items-center justify-content-center mb-2`}>
          <span className={`text-${variant} fs-4`}>{icon}</span>
        </div>
        <h4 className={`text-${variant} fw-bold mb-1`}>{value}</h4>
        <small className="text-muted">{title}</small>
        {subtitle && <small className="text-muted d-block">{subtitle}</small>}
        {trend && (
          <Badge bg={`${trend > 0 ? 'success' : 'danger'}-subtle`} text={trend > 0 ? 'success' : 'danger'} className="mt-1">
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
}

export default MetricCard;