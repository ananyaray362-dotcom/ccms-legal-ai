import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      // Create Object URL for viewing the PDF locally in the next step
      const pdfUrl = URL.createObjectURL(file);
      
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Navigate to verify page and pass data in state
        navigate('/verify', { 
          state: { 
            fileName: file.name,
            pdfUrl,
            extractedData: response.data.data,
            fullText: response.data.fullText
          } 
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload and process document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Upload Court Judgment</h1>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div 
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            style={{ display: 'none' }} 
          />
          
          <UploadCloud className="upload-icon" size={48} />
          
          {file ? (
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <FileText size={20} />
                {file.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <h3>Click or drag PDF here to upload</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Only PDF documents are supported. Max size 10MB.
              </p>
            </>
          )}
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius)' }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Extracting...
              </>
            ) : (
              'Process with AI'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
