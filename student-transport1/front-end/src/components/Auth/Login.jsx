import React, { useState } from 'react';
import { api } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';


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
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
        <FontAwesomeIcon icon={faBus} size="sm" className="auth-icon" />
      <h1>Transporte Escolar</h1>
      <p className="subtitle">Inicia sesión para continuar</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-with-icon">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon"/>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-with-icon">
          <FontAwesomeIcon icon={faLock} className="input-icon"/>
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
    </div>
  );
};

export default Login;