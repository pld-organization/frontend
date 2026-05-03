"use client";

import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, TYPE_ROUTE_MAP, TYPE_LABEL_MAP } from './datahandling/constants';
import { 
  getConfidenceValue, 
  getConfidenceBg, 
  getConfidenceColor, 
  getConfidenceRing 
} from './datahandling/utils';
import '../../styles/AnalysisCard.css';

export default function AnalysisCard({ analysis }) {
  const navigate = useNavigate();
  
  const confidence = getConfidenceValue(analysis);
  const scanType = analysis._resolvedType || analysis.prediction?.type || 'N/A';
  const scanName = analysis.filename || analysis.originalName || 'Unnamed Scan';
  const date = analysis.uploadedAt
    ? new Date(analysis.uploadedAt).toLocaleDateString('en-GB').replace(/\//g, '-')
    : '—';
  const modelName = analysis.modelName || '—';

  const predictionText =
    analysis.prediction?.prediction || analysis.prediction?.diagnostics
      ? analysis.prediction?.prediction || analysis.prediction?.class_index != null
        ? analysis.prediction?.prediction
        : 'Pending review'
      : 'Pending review';

  // Get confidence level class
  const getConfidenceLevel = (confidenceValue) => {
    if (confidenceValue < 70) return 'low';
    if (confidenceValue < 85) return 'medium';
    return 'high';
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  const handleDetails = () => {
    const route = TYPE_ROUTE_MAP[scanType] || TYPE_ROUTE_MAP[analysis.prediction?.type];
    const fullFilePath = `${BASE_URL}/uploads/${scanName}`;

    if (route) {
      navigate(route, { 
        state: { 
          scanData: analysis,
          fileName: scanName,
          filePath: fullFilePath
        } 
      });
    }
  };

  return (
    <div className="analysis-card">
      <div className={`card-gradient-overlay gradient-${confidenceLevel}`} />
      
      <div className="card-content">
        {/* Left Section - Type and Date */}
        <div className="card-left-section">
          <div className="scan-type-wrapper">
            <span className="scan-type-badge">
              {TYPE_LABEL_MAP[scanType] || scanType}
            </span>
            <div className="date-info">
              <span className="date-label">Date</span>
              <span className="date-value">{date}</span>
            </div>
          </div>
        </div>

        {/* Middle Section - Model Info */}
        <div className="card-middle-section">
          <span className="model-label">Model</span>
          <p className="model-name">{modelName}</p>
        </div>

        {/* Confidence Section */}
        <div className="card-confidence-section">
          <div className={`confidence-box ${confidenceLevel}`}>
            <div className="confidence-content">
              <p className="confidence-label">Confidence</p>
              <div className="confidence-value-wrapper">
                <TrendingUp className={`confidence-icon ${confidenceLevel}`} />
                <span className={`confidence-percentage ${confidenceLevel}`}>
                  {confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Prediction and Button */}
        <div className="card-right-section">
          <div className="prediction-info">
            <p className="prediction-label">Prediction</p>
            <p className="prediction-text">{predictionText}</p>
          </div>

          <button
            onClick={handleDetails}
            className="details-button"
          >
            Details
            <ChevronRight className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}