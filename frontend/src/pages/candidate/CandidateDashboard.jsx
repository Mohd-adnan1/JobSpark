import React, { useState } from 'react';
import { parseResumePdf, triggerScrapers } from '../../services/api';

export default function CandidateDashboard() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('Software Engineer');
  const [scraping, setScraping] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParseResume = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file first.');
    setParsing(true);
    try {
      const res = await parseResumePdf(file);
      const extracted = res?.parsed_data || res?.data || res;
      setParsedData(extracted);
    } catch (err) {
      alert('Error parsing resume. Ensure backend server is running.');
    } finally {
      setParsing(false);
    }
  };

  const handleFetchJobs = async (e) => {
    e.preventDefault();
    setScraping(true);
    try {
      const res = await triggerScrapers(searchKeyword);
      setJobs(res.data || res.jobs || res || []);
    } catch (err) {
      alert('Error fetching live job postings.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Candidate Job Hub & Skill Extractor</h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>Upload your PDF resume for instant NLP skill matching or search active scraped postings.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        
        {/* Left Column: Resume Parser Card */}
        <div style={darkCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Resume Parser (PDF)</h3>
          </div>

          <form onSubmit={handleParseResume}>
            <div style={{ border: '2px dashed #334155', padding: '16px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#020617', marginBottom: '16px' }}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                style={{ fontSize: '12px', color: '#94a3b8', width: '100%' }} 
              />
            </div>
            <button
              type="submit"
              disabled={parsing}
              style={gradientBtnStyle}
            >
              {parsing ? 'Extracting NLP Entities...' : 'Parse Resume'}
            </button>
          </form>

          {parsedData && (
            <div style={{ marginTop: '20px', backgroundColor: '#020617', padding: '16px', borderRadius: '10px', border: '1px solid #1d4ed8' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 6px 0', color: '#f8fafc' }}>{parsedData.name || 'Candidate Profile'}</h4>
              <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: '#94a3b8' }}>{parsedData.email || 'No email found'} • {parsedData.phone || 'No phone found'}</p>
              
              <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Extracted Skill Entities:
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parsedData.skills && parsedData.skills.length > 0 ? (
                  parsedData.skills.map((skill, idx) => (
                    <span key={idx} style={skillChipStyle}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '12px', color: '#64748b' }}>No explicit skills matched.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Job Feed & Search */}
        <div>
          <div style={{ ...darkCardStyle, marginBottom: '20px', padding: '16px' }}>
            <form onSubmit={handleFetchJobs} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search job title or skill (e.g. Full Stack, Python, ML)..."
                style={searchInputStyle}
              />
              <button
                type="submit"
                disabled={scraping}
                style={{ ...gradientBtnStyle, width: 'auto', padding: '0 24px' }}
              >
                {scraping ? 'Scraping Live Feeds...' : 'Fetch Jobs'}
              </button>
            </form>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px', color: '#f8fafc' }}>
            Active Openings {jobs.length > 0 && `(${jobs.length})`}
          </h3>

          {jobs.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px dashed #334155' }}>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>No jobs loaded yet. Enter a role title and click <strong>Fetch Jobs</strong> to trigger live scrapers.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {jobs.map((job, idx) => (
                <div key={idx} style={jobCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', color: '#f8fafc', fontWeight: '700' }}>{job.title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>{job.company} • <span style={{ color: '#64748b' }}>{job.location}</span></p>
                    </div>
                    <span style={{ backgroundColor: job.source === 'LinkedIn' ? '#0284c7' : job.source === 'Naukri' ? '#ea580c' : '#0284c7', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                      {job.source}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                    {job.description}
                  </p>

                  {job.required_skills && job.required_skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Required:</span>
                      {job.required_skills.map((skill, sIdx) => (
                        <span key={sIdx} style={{ backgroundColor: '#1e293b', color: '#93c5fd', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', border: '1px solid #334155' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const darkCardStyle = { backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' };
const searchInputStyle = { flex: 1, padding: '12px 16px', borderRadius: '8px', backgroundColor: '#020617', border: '1px solid #334155', color: '#ffffff', fontSize: '14px' };
const gradientBtnStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' };
const skillChipStyle = { backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.3)' };
const jobCardStyle = { backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', transition: 'all 0.2s' };