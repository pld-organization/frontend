import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Calendar, BarChart3, Clock, Stethoscope, HelpCircle, Settings,
  ChevronLeft, CheckCircle2, ShieldCheck, AlertTriangle, Timer, FileText,
  Image as ImageIcon, BrainCircuit, Bell, AlertCircle, TrendingUp,
  Activity, Heart, Microscope, Zap, Award, Download, Share2, Star
} from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import '../../styles/MedicalAnalysisDashboard1.css';

const MedicalAnalysisDashboard1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  const { scanData, fileName, filePath } = location.state || {};

  useEffect(() => {
    // Simulate loading for smoother animation
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!scanData && !isLoading) {
    return (
      <div className="dashboard-root">
        <Sidebar />
        <main className="dashboard-main">
          <PageHeader />
          <div className="dashboard-inner">
            <div className="guard-center">
              <div className="guard-box">
                <div className="guard-icon-wrap">
                  <div className="guard-icon-bg">
                    <AlertCircle className="guard-icon" />
                  </div>
                </div>
                <p className="guard-title">No scan data available</p>
                <p className="guard-subtitle">Please go back and select a scan from the list.</p>
                <button onClick={() => navigate(-1)} className="guard-btn">
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const prediction = scanData?.prediction?.prediction
    ?? scanData?.prediction?.class_label
    ?? scanData?.prediction
    ?? 'N/A';

  const rawConfidence = scanData?.prediction?.confidence ?? scanData?.confidence ?? null;
  const confidence = rawConfidence !== null
    ? (rawConfidence <= 1 ? rawConfidence : rawConfidence / 100)
    : null;

  const executionTime = scanData?.executionTime ?? scanData?.processingTime ?? null;

  const originalImage = scanData?.prediction?.original_image
    ?? scanData?.original_image
    ?? scanData?.imageUrl
    ?? filePath
    ?? null;

  const resolvedFileName = fileName
    ?? scanData?.filename
    ?? scanData?.originalName
    ?? 'Unnamed Scan';

  const createdAt = scanData?.uploadedAt ?? scanData?.createdAt
    ? new Date(scanData.uploadedAt ?? scanData.createdAt).toLocaleString()
    : null;

  const scanType = scanData?._resolvedType ?? scanData?.prediction?.type ?? scanData?.type ?? 'Medical Imaging';
  const modelName = scanData?.modelName ?? 'Neural Diagnostic Network';

  const diagnostics = scanData?.prediction?.diagnostics ?? scanData?.diagnostics ?? null;
  const allProbs = diagnostics?.all_probabilities ?? null;
  const uncertaintyScore = diagnostics?.uncertainty_score ?? null;
  
  // Determine confidence level for styling
  const confidenceLevel = confidence ? 
    (confidence >= 0.9 ? 'high' : confidence >= 0.7 ? 'medium' : 'low') : null;
  
  const confidenceColors = {
    high: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    medium: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
    low: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />
      
      <main className="dashboard-main">
        <PageHeader />

        <div className="dashboard-inner">
          {/* Loading State */}
          {isLoading ? (
            <div className="skeleton-container">
              <div className="skeleton skeleton-title" style={{ height: 40, width: '60%', marginBottom: 20 }} />
              <div className="skeleton skeleton-tags" style={{ height: 40, width: '40%', marginBottom: 30 }} />
              <div className="cards-grid">
                <div className="skeleton skeleton-card" style={{ height: 450 }} />
                <div className="skeleton skeleton-card" style={{ height: 450 }} />
              </div>
            </div>
          ) : (
            <>
              {/* Breadcrumb & title */}
              <div className="breadcrumb-section">
                <div className="breadcrumb-row">
                  <button onClick={() => navigate(-1)} className="back-btn">
                    <ChevronLeft />
                  </button>
                  <h2 className="breadcrumb-title">{prediction}</h2>
                  <div className="confidence-badge" style={{ 
                    background: confidenceColors[confidenceLevel]?.bg || '#f1f5f9',
                    color: confidenceColors[confidenceLevel]?.text || '#475569'
                  }}>
                    <Award size={14} />
                    {confidenceLevel === 'high' ? 'High Confidence' : confidenceLevel === 'medium' ? 'Moderate Certainty' : 'Needs Review'}
                  </div>
                </div>
                <p className="breadcrumb-meta">
                  <span className="meta-label">Patient Scan:</span>
                  <span className="meta-value">{resolvedFileName}</span>
                  {modelName !== '—' && <><span className="meta-sep">•</span><span className="meta-label">Model:</span><span className="meta-value">{modelName}</span></>}
                  {createdAt && <><span className="meta-sep">•</span><span className="meta-label">Analyzed:</span><span className="meta-value">{createdAt}</span></>}
                </p>
              </div>

              {/* Status tags */}
              <div className="status-tags">
                <span className="tag tag--completed">
                  <CheckCircle2 size={14} /> Analysis Complete
                </span>
                {confidence !== null && (
                  <span className="tag tag--confidence">
                    <ShieldCheck size={14} /> {(confidence * 100).toFixed(1)}% Confidence
                  </span>
                )}
                {executionTime !== null && (
                  <span className="tag tag--timing">
                    <Timer size={14} /> {(executionTime * 1000).toFixed(0)}ms processing
                  </span>
                )}
                <span className="tag tag--ai">
                  <Zap size={14} /> AI v2.4.1
                </span>
              </div>

              {/* Images grid */}
              <div className="cards-grid">
                {/* Original image */}
                <div className="card">
                  <div className="card__header">
                    <div className="card__header-icon--blue">
                      <ImageIcon size={14} />
                    </div>
                    <h3 className="card__title">Source Medical Image</h3>
                  </div>
                  <div className="card__image-body">
                    {originalImage ? (
                      <img
                        src={originalImage}
                        alt="Medical Scan"
                        className="scan-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <ImageIcon size={48} />
                        <p>Preview not available</p>
                      </div>
                    )}
                  </div>
                  <div className="card__footer">
                    <button className="card-btn">
                      <Download size={14} />
                      Download
                    </button>
                    <button className="card-btn">
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>

                {/* Scan metadata */}
                <div className="card">
                  <div className="card__header">
                    <div className="card__header-icon--teal">
                      <BrainCircuit size={14} />
                    </div>
                    <h3 className="card__title">Diagnostic Report</h3>
                  </div>
                  <div className="card__meta-body">
                    {[
                      { label: 'Primary Finding', value: prediction, highlight: true },
                      { label: 'Scan Type', value: scanType },
                      { label: 'Analysis ID', value: scanData?._id?.slice(-8) ?? '—' },
                      { label: 'Confidence Score', value: confidence !== null ? `${(confidence * 100).toFixed(2)}%` : '—' },
                      { label: 'Processing Time', value: executionTime !== null ? `${(executionTime * 1000).toFixed(0)} ms` : '—' },
                      { label: 'Model Version', value: modelName !== '—' ? modelName : 'Neural v2.4' },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="meta-row">
                        <span className="meta-row__label">{label}</span>
                        <span className={`meta-row__value ${highlight ? 'highlight' : ''}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Probability distribution */}
              {allProbs && Object.keys(allProbs).length > 0 && (
                <div className="card prob-card">
                  <div className="card__header">
                    <div className="card__header-icon--blue">
                      <TrendingUp size={14} />
                    </div>
                    <h3 className="card__title">Class Probability Distribution</h3>
                  </div>
                  <div className="prob-card__body">
                    <div className="prob-list">
                      {Object.entries(allProbs)
                        .sort(([, a], [, b]) => b - a)
                        .map(([label, value]) => (
                          <div key={label}>
                            <div className="prob-item__header">
                              <span className="prob-item__label">{label.replace(/_/g, ' ')}</span>
                              <span className="prob-item__pct">{(value * 100).toFixed(1)}%</span>
                            </div>
                            <div className="prob-track">
                              <div
                                className="prob-fill"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>

                    {uncertaintyScore !== null && (
                      <div className="insight-box">
                        <AlertTriangle size={18} />
                        <p>
                          <strong>Clinical Insight:</strong> The model identified <strong>{prediction}</strong> with{' '}
                          {uncertaintyScore > 0.8 
                            ? 'moderate uncertainty. Manual review by a radiologist is recommended for confirmation.'
                            : 'high certainty. This aligns with expected diagnostic patterns.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="action-btn secondary">
                  <FileText size={16} />
                  Export Report
                </button>
                <button className="action-btn primary">
                  <Activity size={16} />
                  Request Consultation
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MedicalAnalysisDashboard1;