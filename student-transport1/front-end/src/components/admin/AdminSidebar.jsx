import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faRoute,
  faReceipt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Panel de Administración</h3>
      </div>
      <nav className="sidebar-menu">
        <button
          className={`menu-item ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          <FontAwesomeIcon icon={faUsers} className="icon" />
          <span>Gestión de Usuarios</span>
        </button>
        <button
          className={`menu-item ${activeSection === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveSection('routes')}
        >
          <FontAwesomeIcon icon={faRoute} className="icon" />
          <span>Asignación de Rutas</span>
        </button>
        <button
          className={`menu-item ${activeSection === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveSection('payments')}
        >
          <FontAwesomeIcon icon={faReceipt} className="icon" />
          <span>Revisión de Pagos</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
