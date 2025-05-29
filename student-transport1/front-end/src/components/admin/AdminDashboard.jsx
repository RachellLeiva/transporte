import React, { useState } from 'react';
import AdminSidebar     from './AdminSidebar';
import UserManagement   from './sections/UserManagement';
import RouteAssignment  from './sections/RouteAssignment';
import PaymentReview    from './sections/PaymentReview';
import '../../styles/AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('users');

  const renderSection = () => {
    switch (activeSection) {
      case 'users':    return <UserManagement />;
      case 'routes':   return <RouteAssignment />;
      case 'payments': return <PaymentReview />;
      default:         return <UserManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />
      <div className="admin-main-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;
