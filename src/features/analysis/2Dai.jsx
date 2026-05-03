import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Download, Share2,
  CheckCircle2, ShieldCheck, AlertTriangle,
  FileText, Image as ImageIcon, BrainCircuit, AlertCircle,
  Info, TrendingDown, Activity, Heart
} from 'lucide-react';
import '../../styles/MedicalAnalysisDashboard.css';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';

const MedicalAnalysisDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { scanData, fileName, filePath } = location.state || {};

  useEffect(() => {
    if (!scanData) navigate('/');
  }, [scanData, navigate]);

  // Function to determine danger level based on prediction and confidence
  const getDangerLevel = (prediction, confidence) => {
    const predLower = prediction?.toLowerCase() || '';
    
    // High danger conditions
    if (predLower.includes('malignant') || predLower.includes('cancer') || 
        predLower.includes('tumor') || predLower.includes('abnormal')) {
      return { level: 'High', color: '#ef4444', bgColor: '#fee2e2', icon: '🔴' };
    }
    // Medium-high danger
    if (predLower.includes('potential') || predLower.includes('suspicious')) {
      return { level: 'Medium-High', color: '#f97316', bgColor: '#ffedd5', icon: '🟠' };
    }
    // Medium danger
    if (predLower.includes('uncertain') || (confidence && confidence < 70)) {
      return { level: 'Medium', color: '#eab308', bgColor: '#fef9c3', icon: '🟡' };
    }
    // Low-medium danger
    if (predLower.includes('benign') || (confidence && confidence < 85)) {
      return { level: 'Low-Medium', color: '#84cc16', bgColor: '#ecfccb', icon: '🟢' };
    }
    // Low danger
    if (predLower.includes('normal') || predLower.includes('healthy')) {
      return { level: 'Low', color: '#10b981', bgColor: '#d1fae5', icon: '✅' };
    }
    // Default
    return { level: 'no danger at all', color: '#8b5cf6', bgColor: '#ede9fe', icon: '🟣' };
  };

  const prediction = scanData.prediction?.prediction || 'Pending review';
  const rawConf = scanData.prediction?.confidence ?? null;
  const confidence = rawConf !== null
    ? (rawConf <= 1 ? (rawConf * 100).toFixed(2) : rawConf.toFixed(2))
    : null;
  
  const dangerInfo = getDangerLevel(prediction, confidence);

  const scanType = scanData.prediction?.type || '—';
  const modelName = scanData.modelName || '—';

  const originalImage = scanData.prediction?.original_image || filePath;
  const visualResult = scanData.prediction?.visual_result;

  const displayName = fileName || scanData.originalName || 'Unnamed Scan';
  const uploadDate = scanData.uploadedAt
    ? new Date(scanData.uploadedAt).toLocaleDateString()
    : '—';

  if (!scanData) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <PageHeader />
          <div className="container">
            <div className="center-screen">
              <div className="empty-box">
                <AlertCircle size={40} className="icon-red" />
                <p className="title">No scan data available</p>
                <p className="subtitle">Please go back and select a scan.</p>
                <button className="btn primary" onClick={() => navigate(-1)}>Go Back</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <PageHeader />

        <div className="container">
          {/* HEADER with back button */}
          <div className="top-section">
            <div>
              <div className="title-row">
                <button className="icon-btn back-btn" onClick={() => navigate(-1)}>
                  <ChevronLeft />
                </button>
                <div className="icon-box">
                  <BrainCircuit />
                </div>
                <h1>{scanType} Analysis</h1>
              </div>
              <p className="subtitle">
                File: {displayName} • Model: {modelName} • Date: {uploadDate}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button className="btn">
                <Download size={16}/> Export
              </button>
              <button className="btn outline">
                <Share2 size={16}/> Share
              </button>
            </div>
          </div>

          {/* DANGER LEVEL INDICATOR */}
          <div className="danger-indicator" style={{ borderColor: dangerInfo.color }}>
            <div className="danger-header">
              <AlertTriangle size={20} style={{ color: dangerInfo.color }} />
              <span className="danger-level">Danger Level: {dangerInfo.level}</span>
              <span className="danger-icon">{dangerInfo.icon}</span>
            </div>
            <div className="danger-bar-container">
              <div 
                className="danger-bar" 
                style={{ 
                  width: dangerInfo.level === 'High' ? '100%' :
                         dangerInfo.level === 'Medium-High' ? '80%' :
                         dangerInfo.level === 'Medium' ? '60%' :
                         dangerInfo.level === 'Low-Medium' ? '40%' :
                         dangerInfo.level === 'Low' ? '20%' : '50%',
                  background: `linear-gradient(90deg, ${dangerInfo.color}, ${dangerInfo.color}88)`
                }}
              />
            </div>
            <p className="danger-description">
              {dangerInfo.level === 'High' && '⚠️ Critical findings detected. Immediate clinical review recommended.'}
              {dangerInfo.level === 'Medium-High' && '⚠️ Suspicious findings. Urgent specialist consultation advised.'}
              {dangerInfo.level === 'Medium' && '⚡ Uncertain results. Further testing recommended.'}
              {dangerInfo.level === 'Low-Medium' && 'ℹ️ Minor abnormalities detected. Monitor closely.'}
              {dangerInfo.level === 'Low' && '✅ Normal findings. Routine follow-up suggested.'}
              {dangerInfo.level === 'Review Needed' && '📋 Manual review required for accurate assessment.'}
            </p>
          </div>

          {/* STATUS BADGES */}
          <div className="status">
            <span className="badge success">
              <CheckCircle2 size={14}/> Completed
            </span>
            {confidence && (
              <span className="badge info">
                <ShieldCheck size={14}/> {confidence}% Confidence
              </span>
            )}
            <span className="badge" style={{ 
              background: dangerInfo.bgColor, 
              color: dangerInfo.color,
              border: `1px solid ${dangerInfo.color}40`
            }}>
              <Activity size={14}/> {dangerInfo.level} Risk
            </span>
          </div>

          {/* COLOR MEANING LEGEND */}
          <div className="legend-section">
            <div className="legend-header">
              <Info size={18} />
              <h3>Understanding Color Codes & Risk Levels</h3>
            </div>
            
            <div className="legend-grid">
              <div className="legend-item critical">
                <div className="legend-color" style={{ background: '#ef4444' }}></div>
                <div className="legend-content">
                  <strong>🔴 Red / High Danger</strong>
                  <p>Critical findings detected. Immediate action required. Indicates malignant tumors, cancerous growths, or severe abnormalities.</p>
                  <span className="legend-tag">Emergency Consultation Needed</span>
                </div>
              </div>

              <div className="legend-item high">
                <div className="legend-color" style={{ background: '#f97316' }}></div>
                <div className="legend-content">
                  <strong>🟠 Orange / Medium-High Danger</strong>
                  <p>Suspicious findings that require urgent attention. Potential early-stage abnormalities or high-risk indicators present.</p>
                  <span className="legend-tag">Specialist Referral Recommended</span>
                </div>
              </div>

              <div className="legend-item medium">
                <div className="legend-color" style={{ background: '#eab308' }}></div>
                <div className="legend-content">
                  <strong>🟡 Yellow / Medium Danger</strong>
                  <p>Uncertain or ambiguous results. Further testing and clinical correlation needed. Monitor closely for changes.</p>
                  <span className="legend-tag">Follow-up Required</span>
                </div>
              </div>

              <div className="legend-item low-medium">
                <div className="legend-color" style={{ background: '#84cc16' }}></div>
                <div className="legend-content">
                  <strong>🟢 Light Green / Low-Medium Danger</strong>
                  <p>Minor abnormalities detected but generally benign. Low risk factors present. Routine monitoring suggested.</p>
                  <span className="legend-tag">Standard Follow-up</span>
                </div>
              </div>

              <div className="legend-item low">
                <div className="legend-color" style={{ background: '#10b981' }}></div>
                <div className="legend-content">
                  <strong>✅ Green / Low Danger</strong>
                  <p>Normal or healthy findings. No immediate concerns. Standard preventive care recommended.</p>
                  <span className="legend-tag">Routine Check-up</span>
                </div>
              </div>

              <div className="legend-item purple">
                <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
                <div className="legend-content">
                  <strong>🟣 Purple / Review Needed</strong>
                  <p>no danger at all the ai didnt detect anything wierd.</p>
                  <span className="legend-tag">no need for review</span>
                </div>
              </div>
            </div>

            <div className="legend-note">
              <TrendingDown size={16} />
              <span>
                <strong>Risk Gradient:</strong> Colors transition from <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Red (Highest Risk)</span> → 
                <span style={{ color: '#f97316', fontWeight: 'bold' }}> Orange</span> → 
                <span style={{ color: '#eab308', fontWeight: 'bold' }}> Yellow</span> → 
                <span style={{ color: '#84cc16', fontWeight: 'bold' }}> Light Green</span> → 
                <span style={{ color: '#10b981', fontWeight: 'bold' }}> Green (Lowest Risk)</span> → 
                <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}> Purple (No Risk)</span>
              </span>
            </div>
          </div>

          {/* IMAGES GRID */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <h3><ImageIcon size={18}/> Original Image</h3>
                {originalImage ? (
                  <img src={originalImage} alt="original" className="analysis-image"/>
                ) : <p>No image</p>}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <h3><BrainCircuit size={18}/> AI Segmentation</h3>
                {visualResult ? (
                  <img src={visualResult} alt="result" className="analysis-image"/>
                ) : <p>No result</p>}
              </div>
            </div>
          </div>

          {/* REPORT */}
          <div className="list">
            <div className="list-header">
              <h3><FileText size={18}/> AI Report</h3>
            </div>

            <div className="report-grid">
              <div style={{ borderLeftColor: dangerInfo.color }}>
                <strong>Prediction:</strong> 
                <span style={{ color: dangerInfo.color, fontWeight: 'bold' }}> {prediction}</span>
              </div>
              <div><strong>Scan Type:</strong> {scanType}</div>
              <div><strong>Model:</strong> {modelName}</div>
              <div><strong>Confidence:</strong> {confidence || '—'}%</div>
              <div><strong>Risk Level:</strong> 
                <span style={{ color: dangerInfo.color, fontWeight: 'bold' }}> {dangerInfo.level}</span>
              </div>
              <div><strong>Recommendation:</strong> 
                <span> {dangerInfo.level === 'High' ? 'Immediate clinical intervention required' :
                         dangerInfo.level === 'Medium-High' ? 'Urgent specialist consultation' :
                         dangerInfo.level === 'Medium' ? 'Further diagnostic testing' :
                         dangerInfo.level === 'Low-Medium' ? 'Routine monitoring' :
                         dangerInfo.level === 'Low' ? 'Standard preventive care' : 'Manual review needed'}</span>
              </div>
            </div>

            <p className="report-text">
              AI analyzed <b>{displayName}</b> using <b>{modelName}</b> and predicted <b style={{ color: dangerInfo.color }}>{prediction}</b>.
              This falls under <b>{dangerInfo.level}</b> risk category.
              {dangerInfo.level === 'High' && ' Immediate medical attention is strongly recommended.'}
              {dangerInfo.level === 'Medium-High' && ' Urgent specialist consultation advised.'}
              {dangerInfo.level === 'Medium' && ' Additional testing recommended for confirmation.'}
            </p>

            <div className="recommendation" style={{ 
              background: dangerInfo.bgColor,
              borderLeftColor: dangerInfo.color,
              color: dangerInfo.color
            }}>
              {dangerInfo.level === 'High' && '🚨 CRITICAL: Seek immediate medical attention'}
              {dangerInfo.level === 'Medium-High' && '⚠️ URGENT: Schedule specialist appointment within 48 hours'}
              {dangerInfo.level === 'Medium' && '📋 ACTION REQUIRED: Follow up with additional tests'}
              {dangerInfo.level === 'Low-Medium' && 'ℹ️ MONITOR: Regular check-ups recommended'}
              {dangerInfo.level === 'Low' && '✅ NORMAL: Continue routine health maintenance'}
              {dangerInfo.level === 'Review Needed' && '🔍 REVIEW: Manual clinical assessment required'}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalAnalysisDashboard;