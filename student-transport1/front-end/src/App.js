import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { api }           from './api';
import AuthContainer     from './components/Auth/AuthContainer';
import ForgotPassword    from './components/Auth/ForgotPassword';
import ResetPassword     from './components/Auth/ResetPassword';
import ParentDashboard   from './components/parent/ParentDashboard';
import AdminDashboard    from './components/admin/AdminDashboard';
import FinanceDashboard  from './components/finance/FinanceDashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const res = await api.get('/auth/me');
    setUser(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/" element={<AuthContainer onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={()=>{}} />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        </>
      ) : user.role === 'admin' ? (
        <Route path="/*" element={<AdminDashboard onLogout={handleLogout} />} />
      ) : user.role === 'finance' ? (
        <Route path="/*" element={<FinanceDashboard onLogout={handleLogout} />} />
      ) : (
        <Route path="/*" element={<ParentDashboard onLogout={handleLogout} />} />
      )}
    </Routes>
  );
}

export default App;
