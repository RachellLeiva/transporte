// src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { api } from '../../api';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setTempPassword('');
    try {
      // Asumimos que tu endpoint devuelve { tempPassword: '...' }
      const { data } = await api.post('/auth/forgot-password', { email });
      setTempPassword(data.tempPassword);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al generar contraseña');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <FontAwesomeIcon icon={faEnvelope} size="3x" className="auth-icon" />
          <h1>Recuperar contraseña</h1>
          <p className="subtitle">Se generará una contraseña temporal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Generar contraseña temporal
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {tempPassword && (
          <div className="temp-password">
            <p>
              Tu contraseña temporal es: <strong>{tempPassword}</strong>
            </p>
          </div>
        )}

        <p className="auth-switch">
          <button onClick={onBackToLogin}>Volver al login</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
