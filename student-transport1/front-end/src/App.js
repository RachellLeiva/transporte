import React, { useState } from 'react';
import { api }              from './api';
import AuthContainer        from './components/Auth/AuthContainer';
import ParentDashboard      from './components/parent/ParentDashboard';
import AdminDashboard       from './components/admin/AdminDashboard';
import FinanceDashboard     from './components/finance/FinanceDashboard';

function App() {
  const [user, setUser] = useState(null);

  // Se llama tras login exitoso en AuthContainer
  const handleLogin = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error obteniendo usuario:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app">
      {!user ? (
        <AuthContainer onLogin={handleLogin} />
      ) : user.role === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : user.role === 'finance' ? (
        <FinanceDashboard onLogout={handleLogout} />
      ) : (
        <ParentDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
