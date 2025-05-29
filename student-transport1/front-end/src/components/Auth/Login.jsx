import React, { useState } from 'react';
import { api } from '../../api';

const Login = ({ onLogin, onShowRegister, onShowForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      onLogin();
    } catch {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-icon"><i className="fas fa-bus"></i></div>
      <h1>Transporte Escolar</h1>
      <p className="subtitle">Inicia sesión para continuar</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-forgot">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            /> Recordarme
          </label>
          <button
            type="button"
            className="forgot-password"
            onClick={onShowForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button type="submit" className="auth-button">
          Iniciar sesión
        </button>
      </form>
      <p className="auth-switch">
        ¿No tienes una cuenta?{' '}
        <button type="button" onClick={onShowRegister}>
          Regístrate
        </button>
      </p>
    </div>
  );
};

export default Login;