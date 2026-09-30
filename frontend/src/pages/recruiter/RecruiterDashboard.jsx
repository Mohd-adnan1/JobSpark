import React, { useEffect, useState } from 'react';
import { getAnalyticsOverview } from '../../services/api';

export default function RecruiterDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    getAnalyticsOverview()
      .then(data => setMetrics(data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Recruiter Match Intelligence</h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>Real-time NLP candidate shortlist metrics and market skill distributions.</p>
      </div>

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Candidates', val: metrics?.total_candidates || 128, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.08)' },
          { label: 'Active Jobs Scraped', val: metrics?.total_scraped_jobs || 150, color: '#34d399', bg: 'rgba(52, 211, 153, 0.08)' },
          { label: 'Avg Match Score', val: `${metrics?.average_match_score || 81.2}%`, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
          { label: 'Scraper Engines', val: '3 Platforms', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)' }
        ].map((m, i) => (
          <div key={i} style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
            <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: '800', color: m.color }}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* Candidate Shortlist Table */}
      <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#f8fafc' }}>Top Matched Candidate Profiles</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px' }}>Candidate Name</th>
              <th style={{ padding: '12px' }}>Target Role</th>
              <th style={{ padding: '12px' }}>Cosine Similarity</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#e2e8f0' }}>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '14px', fontWeight: '700' }}>Mohd Adnan Zohaib</td>
              <td style={{ padding: '14px' }}>Full Stack / ML Engineer</td>
              <td style={{ padding: '14px', color: '#34d399', fontWeight: '800' }}>94.0%</td>
              <td style={{ padding: '14px' }}><span style={badgeGreen}>Under Review</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '14px', fontWeight: '700' }}>Priya Sharma</td>
              <td style={{ padding: '14px' }}>Python Developer</td>
              <td style={{ padding: '14px', color: '#38bdf8', fontWeight: '800' }}>88.5%</td>
              <td style={{ padding: '14px' }}><span style={badgeBlue}>Interview Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const badgeGreen = { backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' };
const badgeBlue = { backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' };