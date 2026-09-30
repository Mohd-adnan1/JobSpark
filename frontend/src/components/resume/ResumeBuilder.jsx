import React, { useState } from 'react';

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern', 'classic', 'executive'
  const [downloadFormat, setDownloadFormat] = useState('docx'); // 'docx' or 'pdf'
  const [isGenerating, setIsGenerating] = useState(false);

  // Resume Form State
  const [formData, setFormData] = useState({
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: '' },
    techStack: '',
    languages: '',
    education: [{ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' }],
    experience: [{ company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' }],
    internships: [{ company: '', role: '', duration: '', description: '' }],
    projects: [{ title: '', techUsed: '', link: '', description: '' }]
  });

  // Handlers for dynamic array fields
  const handleNestedChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const addArrayItem = (section, initialObject) => {
    setFormData({ ...formData, [section]: [...formData[section], initialObject] });
  };

  const removeArrayItem = (section, index) => {
    const updated = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  // Submit to Python Backend to generate document
  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_style: selectedTemplate,
          file_format: downloadFormat,
          resume_data: formData
        })
      });

      if (!response.ok) throw new Error('Failed to generate resume');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Error generating document. Ensure the Python backend endpoint is active.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
      
      {/* Wizard Header Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '2px solid #f3f4f6', paddingBottom: '16px' }}>
        {['1. Template Style', '2. Personal & Skills', '3. Education & Work', '4. Internships & Projects', '5. Export'].map((label, idx) => (
          <div key={idx} style={{ fontWeight: step === idx + 1 ? '700' : '400', color: step === idx + 1 ? '#2563eb' : '#6b7280', fontSize: '14px' }}>
            {label}
          </div>
        ))}
      </div>

      {/* STEP 1: TEMPLATE SELECTION */}
      {step === 1 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Select Word (.docx) Template Design</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>Choose a layout style for your resume document formatting:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { id: 'modern', name: 'Modern Minimalist', tag: 'Clean & Technical', border: '#2563eb', desc: 'Sleek dark blue accents, distinct section dividers, and bold technical headers.' },
              { id: 'classic', name: 'Classic Formal', tag: 'Traditional / Corporate', border: '#374151', desc: 'Standard serif fonts, centered titles, ideal for corporate and official roles.' },
              { id: 'executive', name: 'Tech Executive', tag: 'Modern Two-Column Feel', border: '#059669', desc: 'Highlighted skills block, emphasis on project impact and tech metrics.' }
            ].map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                style={{
                  padding: '20px',
                  borderRadius: '8px',
                  border: selectedTemplate === tmpl.id ? `2px solid ${tmpl.border}` : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === tmpl.id ? '#f0f7ff' : '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>{tmpl.tag}</span>
                <h4 style={{ margin: '12px 0 6px 0', fontSize: '16px' }}>{tmpl.name}</h4>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{tmpl.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setStep(2)} style={primaryBtnStyle}>Next: Personal & Skills →</button>
        </div>
      )}

      {/* STEP 2: PERSONAL & SKILLS */}
      {step === 2 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Personal Details & Technical Stack</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Full Name *" value={formData.personalInfo.fullName} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, fullName: e.target.value } })} style={inputStyle} />
            <input type="email" placeholder="Email Address *" value={formData.personalInfo.email} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })} style={inputStyle} />
            <input type="text" placeholder="Phone Number" value={formData.personalInfo.phone} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, phone: e.target.value } })} style={inputStyle} />
            <input type="text" placeholder="Location (e.g. New Delhi, India)" value={formData.personalInfo.location} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, location: e.target.value } })} style={inputStyle} />
            <input type="text" placeholder="LinkedIn Profile URL" value={formData.personalInfo.linkedin} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, linkedin: e.target.value } })} style={inputStyle} />
            <input type="text" placeholder="GitHub / Portfolio Link" value={formData.personalInfo.portfolio} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, portfolio: e.target.value } })} style={inputStyle} />
          </div>

          <textarea placeholder="Professional Summary / Profile Statement" value={formData.personalInfo.summary} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, summary: e.target.value } })} style={{ ...inputStyle, width: '100%', height: '80px', marginBottom: '16px' }} />

          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Tech Stack & Languages</h4>
          <input type="text" placeholder="Tech Stack (e.g., Python, C++, React.js, FastAPI, OpenCV, PostgreSQL)" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} style={{ ...inputStyle, marginBottom: '12px' }} />
          <input type="text" placeholder="Languages Spoken/Written (e.g., English, Hindi, German)" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} style={inputStyle} />

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} style={secondaryBtnStyle}>← Back</button>
            <button onClick={() => setStep(3)} style={primaryBtnStyle}>Next: Education & Work →</button>
          </div>
        </div>
      )}

      {/* STEP 3: EDUCATION & WORK EXPERIENCE */}
      {step === 3 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Education, Diplomas & Work Experience</h3>

          {/* Education Array */}
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#1e40af' }}>Schooling / Diplomas / Higher Education</h4>
          {formData.education.map((edu, idx) => (
            <div key={idx} style={cardBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Institution / Board Name" value={edu.institution} onChange={(e) => handleNestedChange('education', idx, 'institution', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Degree / Diploma / Class X/XII" value={edu.degree} onChange={(e) => handleNestedChange('education', idx, 'degree', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Field of Study / Stream" value={edu.fieldOfStudy} onChange={(e) => handleNestedChange('education', idx, 'fieldOfStudy', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Start Year" value={edu.startYear} onChange={(e) => handleNestedChange('education', idx, 'startYear', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="End Year / Passing" value={edu.endYear} onChange={(e) => handleNestedChange('education', idx, 'endYear', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Grade / CGPA / %" value={edu.grade} onChange={(e) => handleNestedChange('education', idx, 'grade', e.target.value)} style={inputStyle} />
              </div>
              {formData.education.length > 1 && <button onClick={() => removeArrayItem('education', idx)} style={deleteBtnStyle}>Remove Schooling</button>}
            </div>
          ))}
          <button onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '' })} style={{ ...secondaryBtnStyle, marginBottom: '24px' }}>+ Add More Education/Diploma</button>

          {/* Work Experience */}
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#1e40af' }}>Professional Experience</h4>
          {formData.experience.map((exp, idx) => (
            <div key={idx} style={cardBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Company / Organization" value={exp.company} onChange={(e) => handleNestedChange('experience', idx, 'company', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Job Role / Title" value={exp.role} onChange={(e) => handleNestedChange('experience', idx, 'role', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Start Date" value={exp.startDate} onChange={(e) => handleNestedChange('experience', idx, 'startDate', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="End Date (or Present)" value={exp.endDate} onChange={(e) => handleNestedChange('experience', idx, 'endDate', e.target.value)} style={inputStyle} />
              </div>
              <textarea placeholder="Key accomplishments and impact..." value={exp.description} onChange={(e) => handleNestedChange('experience', idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%', height: '60px' }} />
              {formData.experience.length > 1 && <button onClick={() => removeArrayItem('experience', idx)} style={deleteBtnStyle}>Remove Experience</button>}
            </div>
          ))}
          <button onClick={() => addArrayItem('experience', { company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' })} style={secondaryBtnStyle}>+ Add Work Experience</button>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(2)} style={secondaryBtnStyle}>← Back</button>
            <button onClick={() => setStep(4)} style={primaryBtnStyle}>Next: Internships & Projects →</button>
          </div>
        </div>
      )}

      {/* STEP 4: INTERNSHIPS & PROJECTS */}
      {step === 4 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Internships & Key Projects</h3>

          {/* Internships */}
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>Internships</h4>
          {formData.internships.map((intern, idx) => (
            <div key={idx} style={cardBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Company / Organization" value={intern.company} onChange={(e) => handleNestedChange('internships', idx, 'company', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Intern Role" value={intern.role} onChange={(e) => handleNestedChange('internships', idx, 'role', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Duration (e.g. 3 Months)" value={intern.duration} onChange={(e) => handleNestedChange('internships', idx, 'duration', e.target.value)} style={inputStyle} />
              </div>
              <textarea placeholder="Work description & learnings..." value={intern.description} onChange={(e) => handleNestedChange('internships', idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%', height: '60px' }} />
              {formData.internships.length > 1 && <button onClick={() => removeArrayItem('internships', idx)} style={deleteBtnStyle}>Remove Internship</button>}
            </div>
          ))}
          <button onClick={() => addArrayItem('internships', { company: '', role: '', duration: '', description: '' })} style={{ ...secondaryBtnStyle, marginBottom: '24px' }}>+ Add Internship</button>

          {/* Projects */}
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>Projects</h4>
          {formData.projects.map((proj, idx) => (
            <div key={idx} style={cardBoxStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => handleNestedChange('projects', idx, 'title', e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Tech Used (e.g. Python, OpenCV, Streamlit)" value={proj.techUsed} onChange={(e) => handleNestedChange('projects', idx, 'techUsed', e.target.value)} style={inputStyle} />
              </div>
              <textarea placeholder="Project features, deployment details, and metrics..." value={proj.description} onChange={(e) => handleNestedChange('projects', idx, 'description', e.target.value)} style={{ ...inputStyle, width: '100%', height: '60px' }} />
              {formData.projects.length > 1 && <button onClick={() => removeArrayItem('projects', idx)} style={deleteBtnStyle}>Remove Project</button>}
            </div>
          ))}
          <button onClick={() => addArrayItem('projects', { title: '', techUsed: '', link: '', description: '' })} style={secondaryBtnStyle}>+ Add Project</button>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(3)} style={secondaryBtnStyle}>← Back</button>
            <button onClick={() => setStep(5)} style={primaryBtnStyle}>Next: Review & Download →</button>
          </div>
        </div>
      )}

      {/* STEP 5: EXPORT & DOWNLOAD */}
      {step === 5 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>Your Resume is Ready to Build!</h3>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>Select your preferred file output format and click download to get your custom Word document locally.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
              <input type="radio" value="docx" checked={downloadFormat === 'docx'} onChange={() => setDownloadFormat('docx')} />
              Microsoft Word (.docx)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
              <input type="radio" value="pdf" checked={downloadFormat === 'pdf'} onChange={() => setDownloadFormat('pdf')} />
              PDF Document (.pdf)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => setStep(4)} style={secondaryBtnStyle}>← Back & Edit</button>
            <button onClick={handleGenerateDocument} disabled={isGenerating} style={{ ...primaryBtnStyle, backgroundColor: '#059669', padding: '12px 32px', fontSize: '16px' }}>
              {isGenerating ? 'Building Document...' : `Download Resume (${downloadFormat.toUpperCase()})`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline Style Objects
const inputStyle = { padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
const primaryBtnStyle = { padding: '10px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' };
const secondaryBtnStyle = { padding: '10px 20px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' };
const deleteBtnStyle = { marginTop: '6px', padding: '4px 8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' };
const cardBoxStyle = { backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '12px' };