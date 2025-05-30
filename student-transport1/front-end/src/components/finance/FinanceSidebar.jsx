import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const FinanceSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  return (
    <div className="finance-sidebar">
      <div className="sidebar-header">
        <h3>Panel de Finanzas</h3>
      </div>
      <nav className="sidebar-menu">
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

export default FinanceSidebar;
