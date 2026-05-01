import { useState, useRef } from "react";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";

export default function AnalysisUploadBox({ onStartAnalysis, loading }) {
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState("X-Ray");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onStartAnalysis(file, analysisType);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="analysis-upload-box">
      <div className="upload-header">
        <h3>New Analysis</h3>
        <p>Upload a medical scan or document for AI-assisted analysis</p>
      </div>

      <div className="upload-controls">
        <label className="input-label">Analysis Type</label>
        <select 
          className="analysis-type-select" 
          value={analysisType} 
          onChange={(e) => setAnalysisType(e.target.value)}
          disabled={loading}
        >
          <option value="X-Ray">X-Ray (Chest/Bone)</option>
          <option value="MRI">MRI Scan</option>
          <option value="Blood Test">Blood Test Results</option>
          <option value="Dermatology">Skin Lesion Image</option>
        </select>
      </div>

      {!file ? (
        <div 
          className="upload-dropzone" 
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUploadCloud size={48} className="upload-icon" />
          <p className="upload-text">Click or drag file to upload</p>
          <p className="upload-subtext">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,.pdf" 
            style={{ display: "none" }} 
            disabled={loading}
          />
        </div>
      ) : (
        <div className="selected-file-area">
          <div className="file-info">
            <FiFileText size={24} className="file-icon" />
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button className="remove-file-btn" onClick={clearFile} disabled={loading} title="Remove file">
              <FiX />
            </button>
          </div>
          <button 
            className="btn btn-primary full-width mt-3" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Start Analysis"}
          </button>
        </div>
      )}
    </div>
  );
}
