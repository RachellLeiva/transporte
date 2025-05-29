// src/components/finance/FinanceDashboard.jsx
import React, { useState } from 'react';
import FinanceSidebar    from './FinanceSidebar';
import PaymentReview     from './sections/PaymentReview';
import '../../styles/FinanceDashboard.css';

const FinanceDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('payments');

  return (
    <div className="finance-dashboard">
      <FinanceSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}               {/* <-- pasa el logout */}
      />
      <div className="finance-main-content">
        {activeSection === 'payments' && <PaymentReview />}
      </div>
    </div>
  );
};

export default FinanceDashboard;
