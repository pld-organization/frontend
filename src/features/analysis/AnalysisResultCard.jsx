import { FiCheckCircle, FiAlertCircle, FiClock, FiFileText } from "react-icons/fi";

export default function AnalysisResultCard({ analysis }) {
  const { type, status, date, findings, confidence, recommendation } = analysis;
  
  const isCompleted = status?.toLowerCase() === "completed";
  const confidencePercent = confidence ? Math.round(confidence * 100) : null;

  return (
    <div className="analysis-result-card">
      <div className="analysis-header">
        <div className="analysis-title">
          <FiFileText className="title-icon" />
          <h4>{type || "Medical Analysis"}</h4>
        </div>
        <div className="analysis-meta">
          <span className="analysis-date"><FiClock /> {date}</span>
          <span className={`status-badge status-${isCompleted ? 'confirmed' : 'pending'}`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="analysis-body">
        {findings && (
          <div className="result-section">
            <span className="section-label">Findings</span>
            <p className="section-content">{findings}</p>
          </div>
        )}
        
        {recommendation && (
          <div className="result-section">
            <span className="section-label">Recommendation</span>
            <p className="section-content recommendation-text">{recommendation}</p>
          </div>
        )}
      </div>

      {isCompleted && confidencePercent && (
        <div className="analysis-footer">
          <div className="confidence-indicator">
            {confidencePercent >= 90 ? (
              <FiCheckCircle className="confidence-icon high" />
            ) : (
              <FiAlertCircle className="confidence-icon medium" />
            )}
            <span>AI Confidence Score: <strong>{confidencePercent}%</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
