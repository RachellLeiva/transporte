import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Logo } from '../../../assets/logo.svg';

const ParentSidebar = ({ activeSection, setActiveSection, onLogout }) => (
  <div className="parent-sidebar">
    <div className="sidebar-header">
      <Logo className="logo" />
      <h2>Transporte de estudiantes Mautick</h2>
    </div>
    <nav className="sidebar-menu">
      <button className={`menu-item ${activeSection==='welcome'?'active':''}`} onClick={()=>setActiveSection('welcome')}><i className="fas fa-home"></i><span>Bienvenida</span></button>
      <button className={`menu-item ${activeSection==='parent'?'active':''}`} onClick={()=>setActiveSection('parent')}><i className="fas fa-user"></i><span>Información del padre</span></button>
      <button className={`menu-item ${activeSection==='student'?'active':''}`} onClick={()=>setActiveSection('student')}><i className="fas fa-user-graduate"></i><span>Estudiantes</span></button>
      <button className={`menu-item ${activeSection==='payment'?'active':''}`} onClick={()=>setActiveSection('payment')}><i className="fas fa-receipt"></i><span>Comprobantes</span></button>
    </nav>
    <div className="sidebar-footer">
      <button className="logout-btn" onClick={onLogout}><i className="fas fa-sign-out-alt"></i><span>Cerrar sesión</span></button>
    </div>
  </div>
);

ParentSidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default ParentSidebar;
