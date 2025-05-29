import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) return alert('No coinciden');
    try {
      await api.post(`/auth/reset-password/${resetToken}`, { password });
      alert('Contraseña actualizada');
      navigate('/');
    } catch {
      alert('Token inválido');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-icon"><i className="fas fa-key"></i></div>
      <h1>Nuevo password</h1>
      <p className="subtitle">Ingresa tu nueva contraseña</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input type="password" placeholder="Nueva contraseña" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" placeholder="Confirma la contraseña" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button">Cambiar contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;