import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/auth/LandingPage';
import ResumeBuilder from './components/resume/ResumeBuilder';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';

export default function App() {
  const [user, setUser] = useState(null); // Auth State
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'candidate', 'builder', 'recruiter'
  const [authModalMode, setAuthModalMode] = useState(null); // null, 'login', 'signup'

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthModalMode(null);
    setActiveTab(userData.role === 'recruiter' ? 'recruiter' : 'candidate');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  const handleOpenAuth = (mode) => {
    setAuthModalMode(mode);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1329', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Container View */}
      <main style={{ padding: activeTab === 'landing' ? '0' : '32px 24px' }}>
        {activeTab === 'landing' || !user ? (
          <LandingPage
            onLoginSuccess={handleLoginSuccess}
            authModalMode={authModalMode}
            setAuthModalMode={setAuthModalMode}
          />
        ) : (
          <>
            {activeTab === 'candidate' && <CandidateDashboard />}
            {activeTab === 'builder' && <ResumeBuilder />}
            {activeTab === 'recruiter' && <RecruiterDashboard />}
          </>
        )}
      </main>

    </div>
  );
}