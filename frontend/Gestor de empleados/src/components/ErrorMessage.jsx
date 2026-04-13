import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Error al cargar datos</h2>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;