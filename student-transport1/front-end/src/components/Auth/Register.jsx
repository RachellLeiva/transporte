import React, { useState } from 'react';
import { api } from '../../api';

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert('Las contraseñas no coinciden');
    }
    try {
      await api.post('/auth/register', formData);
      alert('Registro exitoso. Inicia sesión');
      onBackToLogin();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error al registrar');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-icon"><i className="fas fa-user-plus"></i></div>
      <h1>Crear cuenta</h1>
      <p className="subtitle">Regístrate para continuar</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input type="text" name="name" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" name="phone" placeholder="Tu número" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input type="email" name="email" placeholder="correo@ejemplo.com" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" placeholder="Crea una contraseña" value={formData.password} onChange={handleChange} required />
          <p className="password-hint">Al menos 8 caracteres</p>
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" name="confirmPassword" placeholder="Confirma contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="auth-button">Registrarse</button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onBackToLogin}>Inicia sesión</button>
      </p>
    </div>
  );
};

export default Register;