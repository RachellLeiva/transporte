import React, { useState } from 'react';
import { api } from '../../api';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      alert(`Enlace enviado a ${email}`);
      onBackToLogin();
    } catch {
      alert('Error al enviar enlace');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-icon"><i className="fas fa-key"></i></div>
      <h1>Recuperar contraseña</h1>
      <p className="subtitle">Envía un enlace a tu correo</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button">Enviar enlace</button>
      </form>
      <p className="auth-switch"><button onClick={onBackToLogin}>Volver al login</button></p>
    </div>
  );
};

export default ForgotPassword;