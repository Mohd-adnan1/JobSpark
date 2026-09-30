import React, { useState } from 'react';

export default function LandingPage({ onLoginSuccess, authModalMode, setAuthModalMode }) {
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return alert('Please enter all required fields.');
    
    // Simulate Authentication Login
    const userProfile = {
      name: formData.fullName || (formData.email.split('@')[0]),
      email: formData.email,
      role: role
    };
    onLoginSuccess(userProfile);
  };

  return (
    <div style={{ backgroundColor: '#0b1329', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif', overflowX: 'hidden' }}>
      
      {/* Hero Section with Dark Aesthetic Workspace Visual */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 40px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
        
        {/* Left Call to Action */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.05em' }}>NEXT-GEN NLP MATCHING & RESUME BUILDER</span>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Land Your Dream Role with <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Precision</span>.
          </h1>

          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
            JobSpark parses candidate resumes, extracts core skill entities, scrapes live jobs across LinkedIn, Naukri, and Unstop, and generates ATS-tailored Word (.docx) resumes in seconds.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setAuthModalMode('signup')} style={heroPrimaryBtn}>Get Started Free →</button>
            <button onClick={() => setAuthModalMode('login')} style={heroSecondaryBtn}>Recruiter Portal</button>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '48px', borderTop: '1px solid #1e293b', paddingTop: '24px' }}>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8', margin: 0 }}>94%</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Match Accuracy</p>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: '#818cf8', margin: 0 }}>3+ Platforms</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Live Scraping</p>
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: '#34d399', margin: 0 }}>.DOCX / .PDF</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>Instant Export</p>
            </div>
          </div>
        </div>

        {/* Right Visual Frame: Workspace Setup with Colorful Arc Screen */}
        <div style={{ position: 'relative' }}>
          <div style={workspaceFrameStyle}>
            {/* Mock Screen with Rainbow Spectral Canvas */}
            <div style={mockLaptopScreenStyle}>
              <div style={screenTopBar}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                <span style={{ fontSize: '10px', color: '#64748b', marginLeft: 'auto' }}>jobspark.ai/dashboard</span>
              </div>
              <div style={mockScreenContentStyle}>
                <div style={sparkLogoOverlay}>⚡ JobSpark Engine Active</div>
                <div style={{ height: '140px', background: 'radial-gradient(circle at 100% 100%, #f97316 0%, #ec4899 35%, #8b5cf6 65%, #0284c7 100%)', borderRadius: '8px', opacity: '0.85', border: '1px solid rgba(255,255,255,0.2)' }}></div>
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ height: '36px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px' }}></div>
                  <div style={{ height: '36px', backgroundColor: 'rgba(56, 189, 248, 0.2)', borderRadius: '6px', border: '1px solid #38bdf8' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Grid Section */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 80px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: '800', marginBottom: '36px' }}>Powerful Tools Engineered for Candidates & Recruiters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            { icon: '📄', title: 'Smart PDF Parser', desc: 'Instant NLP entity extraction pulls contact details and skills from candidate resumes.' },
            { icon: '🔍', title: 'Multi-Source Job Scraper', desc: 'Aggregates active postings from LinkedIn, Naukri, and Unstop in real-time.' },
            { icon: '📝', title: 'Multi-Step Resume Builder', desc: 'Generates polished, formatted Word (.docx) resumes with tailored STAR accomplishments.' }
          ].map((f, i) => (
            <div key={i} style={featureCardStyle}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AUTHENTICATION MODAL (LOGIN / SIGNUP) */}
      {authModalMode && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <button onClick={() => setAuthModalMode(null)} style={closeBtnStyle}>✕</button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#ffffff' }}>
                {authModalMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                {authModalMode === 'login' ? 'Access your AI Dashboard & Saved Resumes' : 'Join JobSpark as a Candidate or Recruiter'}
              </p>
            </div>

            {/* Role Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #334155' }}>
              <button
                type="button"
                onClick={() => setRole('candidate')}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', backgroundColor: role === 'candidate' ? '#2563eb' : 'transparent', color: role === 'candidate' ? '#fff' : '#94a3b8' }}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', backgroundColor: role === 'recruiter' ? '#2563eb' : 'transparent', color: role === 'recruiter' ? '#fff' : '#94a3b8' }}
              >
                Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {authModalMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={modalInputStyle}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={modalInputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={modalInputStyle}
              />

              <button type="submit" style={modalSubmitBtn}>
                {authModalMode === 'login' ? 'Log In to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {authModalMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setAuthModalMode(authModalMode === 'login' ? 'signup' : 'login')}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#38bdf8', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
              >
                {authModalMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Styles
const heroPrimaryBtn = { background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)' };
const heroSecondaryBtn = { backgroundColor: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', padding: '14px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' };

const workspaceFrameStyle = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '16px',
  border: '1px solid #1e293b',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.1)'
};

const mockLaptopScreenStyle = {
  backgroundColor: '#020617',
  borderRadius: '10px',
  border: '1px solid #334155',
  overflow: 'hidden'
};

const screenTopBar = {
  backgroundColor: '#0f172a',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  borderBottom: '1px solid #1e293b'
};

const mockScreenContentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const sparkLogoOverlay = { fontSize: '12px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.05em' };

const featureCardStyle = {
  backgroundColor: '#0f172a',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #1e293b',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(2, 6, 23, 0.8)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalCardStyle = {
  backgroundColor: '#0f172a',
  padding: '32px',
  borderRadius: '16px',
  border: '1px solid #334155',
  width: '100%',
  maxWidth: '400px',
  position: 'relative',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
};

const closeBtnStyle = { position: 'absolute', top: '16px', right: '16px', backgroundColor: 'transparent', border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer' };
const modalInputStyle = { padding: '12px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: '#ffffff', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const modalSubmitBtn = { padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop: '6px' };