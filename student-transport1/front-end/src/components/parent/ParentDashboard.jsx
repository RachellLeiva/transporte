// src/components/parent/ParentDashboard.jsx
import React, { useState } from 'react';
import ParentSidebar    from './sections/ParentSidebar';
import WelcomeSection   from './sections/WelcomeSection';
import ParentInfo       from './sections/ParentInfo';
import StudentInfo      from './sections/StudentInfo';
import PaymentInfo      from './sections/PaymentInfo';
import '../../styles/ParentDashboard.css';

const ParentDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('welcome');

  const renderSection = () => {
    switch (activeSection) {
      case 'welcome': return <WelcomeSection />;
      case 'parent':  return <ParentInfo />;
      case 'student': return <StudentInfo />;
      case 'payment': return <PaymentInfo />;
      default:        return <WelcomeSection />;
    }
  };

  return (
    <div className="parent-dashboard">
      <ParentSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default ParentDashboard;
