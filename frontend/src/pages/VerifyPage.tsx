import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { fileName, pdfUrl, extractedData, fullText } = location.state || {};

  const [formData, setFormData] = useState({
    caseDetails: extractedData?.caseDetails || {},
    actionPlan: extractedData?.actionPlan || {}
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!extractedData) {
    return <div>No data to verify. Please upload a judgment first.</div>;
  }

  const handleCaseChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      caseDetails: { ...prev.caseDetails, [field]: value }
    }));
  };

  const handleActionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      actionPlan: { ...prev.actionPlan, [field]: value }
    }));
  };

  const handleApprove = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/api/cases/verify', {
        fileName,
        pdfText: fullText,
        caseDetails: formData.caseDetails,
        actionPlan: formData.actionPlan
      });

      if (response.data.success) {
        navigate('/'); // Go back to dashboard on success
      }
    } catch (error) {
      console.error('Failed to verify case', error);
      alert('Failed to save verified case.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Verify Extracted Data</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and edit AI-extracted information before final approval.</p>
        </div>
        <button 
          className="btn btn-success" 
          onClick={handleApprove}
          disabled={isSaving}
        >
          <CheckCircle size={18} />
          {isSaving ? 'Saving...' : 'Approve & Save'}
        </button>
      </div>

      <div className="split-view">
        {/* Left Side: Original PDF */}
        <div className="pdf-viewer" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f8fafc', fontWeight: 600 }}>
            Source Document: {fileName}
          </div>
          <div style={{ flex: 1 }}>
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
          </div>
        </div>

        {/* Right Side: Editable Form */}
        <div className="verification-form">
          <div className="card">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <AlertTriangle size={20} />
              AI Extraction Review
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Confidence levels may vary. Please ensure all key directives and timelines are accurate.
            </p>

            <h3 style={{ fontSize: '1.1rem', marginTop: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Case Details
            </h3>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Case Number</label>
              <input 
                className="form-input" 
                value={formData.caseDetails.caseNumber || ''} 
                onChange={(e) => handleCaseChange('caseNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Order</label>
              <input 
                className="form-input" 
                type="date"
                value={formData.caseDetails.dateOfOrder || ''} 
                onChange={(e) => handleCaseChange('dateOfOrder', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parties Involved</label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={formData.caseDetails.partiesInvolved || ''} 
                onChange={(e) => handleCaseChange('partiesInvolved', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Directions / Orders</label>
              <textarea 
                className="form-textarea" 
                rows={4}
                value={formData.caseDetails.keyDirections || ''} 
                onChange={(e) => handleCaseChange('keyDirections', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relevant Timelines</label>
              <input 
                className="form-input" 
                value={formData.caseDetails.relevantTimelines || ''} 
                onChange={(e) => handleCaseChange('relevantTimelines', e.target.value)}
              />
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Action Plan
            </h3>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Responsible Department</label>
              <input 
                className="form-input" 
                value={formData.actionPlan.responsibleDepartment || ''} 
                onChange={(e) => handleActionChange('responsibleDepartment', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nature of Action Required</label>
              <input 
                className="form-input" 
                value={formData.actionPlan.natureOfAction || ''} 
                onChange={(e) => handleActionChange('natureOfAction', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Compliance Requirements</label>
              <textarea 
                className="form-textarea" 
                rows={3}
                value={formData.actionPlan.complianceRequirements || ''} 
                onChange={(e) => handleActionChange('complianceRequirements', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consideration for Appeal</label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={formData.actionPlan.appealConsideration || ''} 
                onChange={(e) => handleActionChange('appealConsideration', e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
