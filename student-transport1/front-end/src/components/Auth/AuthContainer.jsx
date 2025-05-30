import React, { useState } from 'react';
import Login          from './Login';
import Register       from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword  from './ResetPassword';

const AuthContainer = ({ onLogin }) => {
  const [activeForm, setActiveForm] = useState('login');

  return (
      <div className="auth-global-container">
      <div className="auth-content-wrapper"></div>
      {activeForm === 'login' && (
        <Login
          onLogin={onLogin}
          onShowRegister={() => setActiveForm('register')}
          onShowForgotPassword={() => setActiveForm('forgot')}
        />
      )}
      {activeForm === 'register' && <Register onBackToLogin={() => setActiveForm('login')} />}
      {activeForm === 'forgot' && <ForgotPassword onBackToLogin={() => setActiveForm('login')} />}
      {activeForm === 'reset' && <ResetPassword onBackToLogin={() => setActiveForm('login')} />}
    </div>
  );
};

export default AuthContainer;