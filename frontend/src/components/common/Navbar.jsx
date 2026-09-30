import React from 'react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, onOpenAuth }) {
  return (
    <header style={navStyle}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('landing')}>
        <div style={logoIconStyle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#sparkGrad)" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="sparkGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8"/>
                <stop offset="1" stopColor="#6366f1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <span style={{ fontSize: '22px', fontWeight: '800', tracking: '-0.02em', background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            JobSpark
          </span>
          <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-2px' }}>
            AI Matching & Engine
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      {user ? (
        <nav style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '12px', border: '1px solid #334155' }}>
          {[
            { id: 'candidate', label: 'Candidate Feed' },
            { id: 'builder', label: 'AI Resume Studio' },
            { id: 'recruiter', label: 'Recruiter Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      ) : null}

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{user.name}</p>
              <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'capitalize', fontWeight: '600' }}>{user.role}</span>
            </div>
            <button onClick={onLogout} style={logoutBtnStyle}>Sign Out</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onOpenAuth('login')} style={loginBtnStyle}>Log In</button>
            <button onClick={() => onOpenAuth('signup')} style={signupBtnStyle}>Get Started</button>
          </div>
        )}
      </div>
    </header>
  );
}

const navStyle = {
  backgroundColor: 'rgba(11, 19, 41, 0.85)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid #1e293b',
  padding: '0 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '72px',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const logoIconStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  border: '1px solid #3b82f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)'
};

const loginBtnStyle = { backgroundColor: 'transparent', color: '#e2e8f0', border: '1px solid #334155', padding: '8px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' };
const signupBtnStyle = { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' };
const logoutBtnStyle = { backgroundColor: '#1e293b', color: '#f87171', border: '1px solid #7f1d1d', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' };