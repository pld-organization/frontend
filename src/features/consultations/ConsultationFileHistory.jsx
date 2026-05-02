import React, { useState, useRef } from 'react';
import { useMyFiles, useUpload } from './hooks';
import { STORAGE_BASE_URL } from './data/apiClient';

/**
 * ConsultationFileHistory Component
 * Refactored to automatically detect the logged-in user's role and ID.
 */
const ConsultationFileHistory = ({ targetId }) => {
  // --- State & Hooks ---
  const [fileType, setFileType] = useState('medical_report');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const { 
    files, 
    isLoading: isFilesLoading, 
    error: filesError, 
    refresh: refreshFiles 
  } = useMyFiles();

  const { 
    upload, 
    isUploading, 
    error: uploadError, 
    success: uploadSuccess,
    clearStatus: clearUploadStatus
  } = useUpload();

  // --- Handlers ---
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (uploadError || uploadSuccess) clearUploadStatus();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      // Automatically appends the current user's ID and role inside storageApi
      await upload(selectedFile, targetId, fileType);
      
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await refreshFiles();
    } catch (err) {
      console.error('[Upload Error]', err);
    }
  };


  // --- UI Fragments ---
  const renderStatus = () => {
    if (uploadError) return <div style={styles.errorBanner}>{uploadError}</div>;
    if (uploadSuccess) return <div style={styles.successBanner}>File uploaded successfully!</div>;
    return null;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Consultation Documents</h2>
        <p style={styles.subtitle}>Manage your medical records and diagnostic files</p>
      </header>

      {/* Upload Form */}
      <section style={styles.card}>
        <h3 style={styles.cardTitle}>Upload New Document</h3>
        {renderStatus()}
        
        <form onSubmit={handleUpload} style={styles.uploadForm}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Document Type</label>
            <select 
              value={fileType} 
              onChange={(e) => setFileType(e.target.value)}
              style={styles.select}
              disabled={isUploading}
            >
              <option value="medical_report">Medical Report</option>
              <option value="prescription">Prescription</option>
              <option value="lab_result">Lab Result</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select File</label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              style={styles.fileInput}
              disabled={isUploading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isUploading || !selectedFile}
            style={{
              ...styles.button,
              ...( (isUploading || !selectedFile) ? styles.buttonDisabled : {} )
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </section>

      {/* History List */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>File History</h3>
          <button 
            onClick={refreshFiles} 
            style={styles.refreshBtn}
            disabled={isFilesLoading}
          >
            {isFilesLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {filesError && <div style={styles.errorBanner}>{filesError}</div>}

        {isFilesLoading && files.length === 0 ? (
          <p style={styles.placeholder}>Loading your documents...</p>
        ) : files.length > 0 ? (
          <ul style={styles.list}>
            {files.map((file) => (
              <li key={file.id || file.filename} style={styles.listItem}>
                <div style={styles.fileMain}>
                  <span style={styles.fileName}>{file.filename}</span>
                  <span style={styles.fileMeta}>
                    {file.type.replace('_', ' ')} • {new Date(file.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => window.open(`${STORAGE_BASE_URL}/upload/filename/${file.filename}`, '_blank')}
                  style={styles.viewBtn}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.emptyState}>No documents found for this patient.</p>
        )}
      </section>
    </div>
  );
};

// Styles - Consistent and Premium
const styles = {
  container: { padding: '32px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 },
  subtitle: { color: '#6B7280', margin: '4px 0 0 0', fontSize: '14px' },
  card: { background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  cardTitle: { fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 },
  uploadForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
  select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' },
  fileInput: { fontSize: '14px' },
  button: { background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  buttonDisabled: { background: '#93C5FD', cursor: 'not-allowed' },
  refreshBtn: { background: 'none', border: '1px solid #E5E7EB', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#374151' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '12px 0', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  fileMain: { display: 'flex', flexDirection: 'column' },
  fileName: { fontSize: '14px', fontWeight: '500', color: '#111827' },
  fileMeta: { fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' },
  viewBtn: { background: 'none', border: 'none', color: '#2563EB', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  errorBanner: { background: '#FEF2F2', color: '#DC2626', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', border: '1px solid #FECACA' },
  successBanner: { background: '#F0FDF4', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', border: '1px solid #BBF7D0' },
  placeholder: { textAlign: 'center', color: '#9CA3AF', padding: '24px 0' },
  emptyState: { textAlign: 'center', color: '#6B7280', padding: '32px 0', fontSize: '14px' },
};

export default ConsultationFileHistory;
