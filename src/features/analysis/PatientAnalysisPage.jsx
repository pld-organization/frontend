import { useState, useEffect } from "react";

import AnalysisUploadBox from "./AnalysisUploadBox";
import AnalysisResultCard from "./AnalysisResultCard";
import Spinner from "../../components/shared/Spinner";
import EmptyState from "../../components/shared/EmptyState";
import { getMyAnalyses, predict } from "./data/analysisService";
import { FiActivity } from "react-icons/fi";
import "../../styles/patient-analysis.css";

export default function PatientAnalysisPage() {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setLoadingHistory(true);
      const data = await getMyAnalyses();
      setHistory(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError("Failed to load analysis history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  const handleStartAnalysis = async (file, type) => {
    try {
      setIsAnalyzing(true);
      setCurrentResult(null);
      setError(null);
      
      const result = await predict(file, type);
      setCurrentResult(result);
      
      // Optionally add to history (or re-fetch)
      setHistory(prev => [result, ...prev]);
      
      // scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="patient-analysis-page">
        
        <div className="analysis-top-section">
          <AnalysisUploadBox 
            onStartAnalysis={handleStartAnalysis} 
            loading={isAnalyzing} 
          />
          
          {isAnalyzing ? (
            <div className="analyzing-state">
              <Spinner size="lg" message="Analyzing your document... This may take a few moments." />
            </div>
          ) : currentResult ? (
            <div className="current-result-container">
              <h3>Latest Result</h3>
              <AnalysisResultCard analysis={currentResult} />
            </div>
          ) : (
            <div className="analysis-instructions">
              <div className="instruction-card">
                <h4>How it works</h4>
                <ul>
                  <li>1. Select the type of scan or document.</li>
                  <li>2. Upload a clear, legible file (JPG, PNG, PDF).</li>
                  <li>3. Click "Start Analysis" to process.</li>
                  <li>4. Review findings and recommendations.</li>
                </ul>
                <p className="disclaimer">
                  <strong>Disclaimer:</strong> This AI tool provides preliminary insights and does not replace professional medical advice. Always consult your doctor.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="analysis-history-section">
          <h3 className="section-title">History</h3>
          
          {loadingHistory ? (
            <Spinner message="Loading history..." />
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchHistory}>Retry</button>
            </div>
          ) : history.length === 0 ? (
            <EmptyState 
              icon={<FiActivity size={48} />}
              title="No previous analyses"
              description="Your analysis history will appear here once you upload and process a document."
            />
          ) : (
            <div className="history-grid">
              {history.map(item => (
                <AnalysisResultCard key={item.id} analysis={item} />
              ))}
            </div>
          )}
        </div>
        
      </div>
  );
}
