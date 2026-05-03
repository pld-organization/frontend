"use client";

/**
 * MedicalDashboard4.tsx
 * * ──────────────────────────────────────────────────────────────────────────────
 * Enhanced Visual Dashboard with Premium UI/UX
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  BarChart2,
  Clock,
  UserCircle,
  UploadCloud,
  Settings,
  HelpCircle,
  Bell,
  CheckCircle2,
  Search,
  ChevronRight,
  Sparkles,
  Activity,
  HeartPulse,
  Microscope,
  Stethoscope,
  Zap,
  Info,
  ArrowRight,
  Plus,
  X,
  File,
  ImageIcon,
  Trash2,
  RefreshCw,
  Shield,
  Cpu,
  Brain,
  Eye,
  CloudUpload,
  Check,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import "../../styles/MedicalDashboard4.css";
import { BASE_URL, SCAN_TYPES, getPatientId } from './datahandling/constants';
// ── Service imports ────────────────────────────────────────────────────────────
import { saveFiles, loadFiles, deleteFile, clearAllFiles } from "./datahandling/Filestorage.js";
import { runAnalysis } from "./datahandling/Apiservice.js";

// ── Model definitions with enhanced metadata ──────────────────────────────────────────
const MODELS = [
  {
    name: "Breast Cancer Predict",
    desc: "Breast Analysis",
    icon: Activity,
    accuracy: "98.2%",
    endpoint: "http://127.0.0.1:8100/api/v2/breast-predict-stores",
    color: "from-pink-500 to-rose-500",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
  },
  {
    name: "Lung Segment Store",
    desc: "Lung Segmentation V2",
    icon: Microscope,
    accuracy: "98.0%",
    endpoint: "http://127.0.0.1:8100/api/v2/lung-segment-store",
    color: "from-cyan-500 to-blue-500",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
  },
  {
    name: "Skin Classification",
    desc: "Dermatology AI",
    icon: Activity,
    accuracy: "96.5%",
    endpoint: "http://127.0.0.1:8100/api/v2/skin-classification-store",
    color: "from-amber-500 to-orange-500",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
  {
    name: "Blood Classification",
    desc: "Hematology Classifier",
    icon: HeartPulse,
    accuracy: "95.8%",
    endpoint: "http://127.0.0.1:8100/api/v2/blood-classify-store",
    color: "from-red-500 to-rose-500",
    gradient: "linear-gradient(135deg, #ef4444, #e11d48)",
  },
  {
    name: "Blood Analysis",
    desc: "Comprehensive Blood AI",
    icon: HeartPulse,
    accuracy: "99.1%",
    endpoint: "http://127.0.0.1:8100/api/v2/bloodanalysis",
    color: "from-emerald-500 to-teal-500",
    gradient: "linear-gradient(135deg, #10b981, #14b8a6)",
  },
  {
    name: "Bone Cancer Detect",
    desc: "Osteology AI",
    icon: Activity,
    accuracy: "94.2%",
    endpoint: "http://127.0.0.1:8100/api/v2/bone-segment-store",
    color: "from-stone-500 to-neutral-500",
    gradient: "linear-gradient(135deg, #78716c, #737373)",
  },
  {
    name: "Bone Fracture Detect",
    desc: "Fracture Identification",
    icon: Activity,
    accuracy: "97.1%",
    endpoint: "http://127.0.0.1:8100/api/v2/bone-classification-store",
    color: "from-slate-500 to-gray-500",
    gradient: "linear-gradient(135deg, #64748b, #6b7280)",
  },
  {
    name: "Liver Predict",
    desc: "Hepatic Analysis",
    icon: Activity,
    accuracy: "93.9%",
    endpoint: "http://127.0.0.1:8100/api/v2/liver-segment-store",
    color: "from-purple-500 to-indigo-500",
    gradient: "linear-gradient(135deg, #a855f7, #6366f1)",
  },
  {
    name: "Colon Cell Detect",
    desc: "Colonography AI",
    icon: Microscope,
    accuracy: "96.1%",
    endpoint: "http://127.0.0.1:8100/api/v2/colon-classification-store",
    color: "from-green-500 to-emerald-500",
    gradient: "linear-gradient(135deg, #22c55e, #10b981)",
  },
  {
    name: "Lung Cell Detect",
    desc: "Cellular Lung AI",
    icon: Stethoscope,
    accuracy: "96.8%",
    endpoint: "http://127.0.0.1:8100/api/v2/lung-classify-store",
    color: "from-sky-500 to-blue-500",
    gradient: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
  },
  {
    name: "Brain Predict",
    desc: "Neurology AI",
    icon: Activity,
    accuracy: "98.5%",
    endpoint: "http://127.0.0.1:8100/api/v2/brain-segment-store",
    color: "from-violet-500 to-purple-500",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeIcon(type) {
  if (type?.startsWith("image/")) return ImageIcon;
  return File;
}

// ── Component ──────────────────────────────────────────────────────────────────
const MedicalDashboard4 = () => {
  const [selectedModels, setSelectedModels] = useState([0, 1]);
  const [mode, setMode] = useState("auto");
  const [isDragging, setIsDragging] = useState(false);
  const [storedFiles, setStoredFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [statusMessage, setStatusMessage] = useState("");
  const [hoveredModel, setHoveredModel] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const patientId = getPatientId();
  const fileInputRef = useRef(null);

  // ── Load persisted files on mount ────────────────────────────────────────────
  useEffect(() => {
    loadFiles()
      .then((files) => setStoredFiles(files))
      .catch((err) => console.error("[Dashboard] Failed to load stored files:", err));
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ── File handling ─────────────────────────────────────────────────────────────
  const handleFiles = async (fileList) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    try {
      const saved = await saveFiles(newFiles);
      setStoredFiles((prev) => [...prev, ...saved]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      setToastMessage({ type: "success", text: `Added ${saved.length} file(s)` });
    } catch (err) {
      console.error("[Dashboard] Failed to save files:", err);
      setToastMessage({ type: "error", text: "Failed to upload files" });
    }
  };

  const handleRemoveFile = async (storedFileId) => {
    try {
      await deleteFile(storedFileId);
      setStoredFiles((prev) => prev.filter((f) => f.id !== storedFileId));
      setToastMessage({ type: "info", text: "File removed" });
    } catch (err) {
      console.error("[Dashboard] Failed to delete file:", err);
      setToastMessage({ type: "error", text: "Failed to remove file" });
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllFiles();
      setStoredFiles([]);
      setAnalysisResults([]);
      setToastMessage({ type: "info", text: "All files cleared" });
    } catch (err) {
      console.error("[Dashboard] Failed to clear files:", err);
      setToastMessage({ type: "error", text: "Failed to clear files" });
    }
  };

  // ── Analysis ──────────────────────────────────────────────────────────────────
  const handleRunAnalysis = async () => {
    if (storedFiles.length === 0) {
      setToastMessage({ type: "warning", text: "Please upload at least one file" });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults([]);

    // ── Auto-Dispatch Logic ──
    if (mode === "auto") {
      setStatusMessage("🚀 Routing to Smart AI Router...");
      try {
        const allResults = [];

        for (const sf of storedFiles) {
          const formData = new FormData();
          formData.append("file", sf.blob, sf.name);
          formData.append("patientId", patientId);
          formData.append("fileType", "3D");

          const response = await fetch("http://127.0.0.1:8100/api/v1/auto-dispatch-store", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const err = await response.text();
            throw new Error(`Server responded with ${response.status}: ${err}`);
          }

          const data = await response.json();
          allResults.push(data);
        }

        setAnalysisResults(
          allResults.map((res) => ({
            modelName: res.modelName || "Auto Router",
            prediction: res.prediction,
            fileName: res.originalName || "file",
            error: null,
          }))
        );

        setStatusMessage("✨ Auto-dispatch complete!");
        setToastMessage({ type: "success", text: "Analysis completed successfully" });
      } catch (err) {
        console.error("[Dashboard] Auto-dispatch failed:", err);
        setStatusMessage(`❌ Auto-dispatch failed: ${err.message}`);
        setToastMessage({ type: "error", text: `Analysis failed: ${err.message}` });
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }
    // ── Manual Selection Logic ──
    if (selectedModels.length === 0) {
      setToastMessage({ type: "warning", text: "Please select at least one AI model" });
      setIsAnalyzing(false);
      return;
    }

    setProgress({ done: 0, total: selectedModels.length });
    setStatusMessage("🧠 Analyzing with selected AI models...");

    try {
      const results = await runAnalysis(storedFiles, selectedModels, MODELS, {
        allFilesAllModels: false,
        onProgress: (result, done, total) => {
          setProgress({ done, total });
          setStatusMessage(
            result.error
              ? `⚠ ${result.modelName} encountered an issue — continuing...`
              : `✓ ${result.modelName} complete (${done}/${total})`
          );
        },
      });

      setAnalysisResults(results);
      const successCount = results.filter((r) => !r.error).length;
      setStatusMessage(`✅ Analysis complete — ${successCount}/${results.length} models succeeded.`);
      setToastMessage({ type: "success", text: `Analysis complete! ${successCount} successful` });
    } catch (err) {
      console.error("[Dashboard] runAnalysis threw:", err);
      setStatusMessage(`❌ Analysis failed: ${err.message}`);
      setToastMessage({ type: "error", text: `Analysis failed: ${err.message}` });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleModel = (id) => {
    setSelectedModels((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast toast-${toastMessage.type}`}>
          {toastMessage.type === "success" && <Check className="toast-icon" />}
          {toastMessage.type === "error" && <AlertCircle className="toast-icon" />}
          {toastMessage.type === "warning" && <AlertCircle className="toast-icon" />}
          {toastMessage.type === "info" && <Info className="toast-icon" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <main className="main-content">
        <header className="header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Sangar</span>
            <ChevronRight className="chevron-icon" />
            <span className="breadcrumb-item">Analysis</span>
            <ChevronRight className="chevron-icon" />
            <span className="breadcrumb-current">Diagnostic Suite</span>
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <div className="user-section">
              <div className="user-info">
                <p className="user-name">Dr. Dehmani Mohamed</p>
                <p className="user-role">Radiology · Lead AI Specialist</p>
              </div>
              <div className="user-avatar">
                <div className="avatar-circle">DM</div>
                <div className="status-dot" />
              </div>
            </div>
          </div>
        </header>

        <div className="scroll-area">
          <div className="content-wrapper">
            {/* ── Upload Area ─────────────────────────────────────────────────── */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-area ${isDragging ? "dragging" : ""} ${uploadSuccess ? "success" : ""}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                multiple
                accept=".dicom,.pdf,.jpg,.png,.jpeg"
              />

              <div className="upload-bg-gradient" />

              <div className="upload-icon-wrapper">
                <div className="upload-icon-circle">
                  {uploadSuccess ? <Check size={36} /> : <UploadCloud className="upload-icon" />}
                </div>
                <div className="upload-icon-glow" />
              </div>

              <p className="upload-title">
                {uploadSuccess ? "Upload Successful!" : "Drop your medical images here"}
              </p>
              <p className="upload-subtitle">
                or <span className="upload-link">click to browse</span> from your device
              </p>

              <div className="file-types">
                <span className="file-types-label">Supported formats:</span>
                {["DICOM", "NIfTI", "JPEG", "PNG", "PDF"].map((type) => (
                  <span key={type} className="file-type-badge">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Stored Files List ────────────────────────────────────────────── */}
            {storedFiles.length > 0 && (
              <div className="files-section">
                <div className="files-header">
                  <p className="files-count">
                    <File size={12} />
                    {storedFiles.length} file{storedFiles.length !== 1 ? "s" : ""} ready for analysis
                  </p>
                  <button onClick={handleClearAll} className="clear-all-btn">
                    <Trash2 size={12} />
                    Clear all
                  </button>
                </div>

                <div className="files-list">
                  {storedFiles.map((sf, idx) => {
                    const isImage = sf.type?.startsWith("image/");
                    const FileIcon = isImage ? ImageIcon : File;
                    const previewUrl = sf.blob ? URL.createObjectURL(sf.blob) : null;

                    return (
                      <div key={sf.id} className="file-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                        {isImage && previewUrl ? (
                          <div className="file-preview">
                            <img src={previewUrl} alt={sf.name} className="file-preview-img" />
                          </div>
                        ) : (
                          <div className="file-icon">
                            <FileIcon className="file-icon-svg" />
                          </div>
                        )}

                        <div className="file-info">
                          <p className="file-name">{sf.name}</p>
                          <p className="file-meta">
                            {formatFileSize(sf.size)}
                            {sf.savedAt && <> · uploaded {new Date(sf.savedAt).toLocaleTimeString()}</>}
                          </p>
                        </div>

                        <div className="file-actions">
                          <span className="file-status">
                            <CheckCircle2 size={10} />
                            Ready
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(sf.id);
                            }}
                            className="remove-file-btn"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Mode Toggle ──────────────────────────────────────────────────── */}
            <div className="mode-toggle">
              <div className="toggle-group">
                {[
                  { key: "auto", icon: Zap, label: "Smart Auto-Route", desc: "AI-powered routing" },
                  { key: "manual", icon: Settings, label: "Manual Selection", desc: "Choose specific models" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`toggle-btn ${mode === key ? "active" : ""}`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Auto-Dispatch Notice ──────────────────────────────────── */}
            {mode === "auto" && (
              <div className="auto-notice">
                <div className="auto-icon">
                  <Brain size={24} />
                </div>
                <div className="auto-content">
                  <p className="auto-title">Neural Routing Engine Active</p>
                  <p className="auto-description">
                    Our AI router intelligently analyzes each scan and automatically selects the optimal specialist
                    model for accurate diagnosis.
                  </p>
                </div>
              </div>
            )}

            {/* ── Model Selection ──────────────────────────────────────── */}
            {mode === "manual" && (
              <div className="model-selection">
                <div className="model-header">
                  <div>
                    <div className="model-title-section">
                      <h3 className="model-title">Diagnostic AI Models</h3>
                      <span className="model-badge">{selectedModels.length} Selected</span>
                    </div>
                    <p className="model-subtitle">Choose specialized neural networks for your analysis</p>
                  </div>
                  <button className="add-model-btn">
                    <Plus size={14} />
                    Explore Models
                  </button>
                </div>

                <div className="model-grid">
                  {MODELS.map((model, i) => {
                    const Icon = model.icon;
                    const isSelected = selectedModels.includes(i);
                    const isHovered = hoveredModel === i;
                    return (
                      <button
                        key={i}
                        onClick={() => toggleModel(i)}
                        onMouseEnter={() => setHoveredModel(i)}
                        onMouseLeave={() => setHoveredModel(null)}
                        className={`model-card ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
                      >
                        {isSelected && <div className="model-glow" />}

                        <div className="model-card-header">
                          <div
                            className={`model-icon ${isSelected ? "selected" : ""}`}
                            style={isSelected ? { background: model.gradient } : {}}
                          >
                            <Icon size={20} strokeWidth={1.8} />
                          </div>
                          <div className={`model-check ${isSelected ? "selected" : ""}`}>
                            <CheckCircle2 size={20} />
                          </div>
                        </div>

                        <div className="model-content">
                          <p className="model-name">{model.name}</p>
                          <p className="model-desc">{model.desc}</p>

                          <div className="model-accuracy">
                            <div className="accuracy-dot" />
                            <span className="accuracy-text">
                              Accuracy <span className="accuracy-value">{model.accuracy}</span>
                            </span>
                            <TrendingUp size={12} className="accuracy-trend" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="info-box">
                  <div className="info-icon">
                    <Shield size={16} />
                  </div>
                  <div className="info-content">
                    <p className="info-title">Clinical Validation</p>
                    <p className="info-text">
                      All models are FDA-cleared and validated on multi-center clinical datasets with 95%+ sensitivity.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Analysis Results ─────────────────────────────────────────────── */}
            {analysisResults.length > 0 && (
              <div className="results-section">
                <h3 className="results-title">
                  <Sparkles size={18} />
                  Diagnostic Results
                </h3>
                <div className="results-list">
                  {analysisResults.map((r, idx) => (
                    <div key={idx} className={`result-item ${r.error ? "error" : "success"}`}>
                      <div className="result-header">
                        <p className="result-model">
                          <Cpu size={14} />
                          {r.modelName}
                        </p>
                        {r.error ? (
                          <span className="result-badge error">Failed</span>
                        ) : (
                          <span className="result-badge success">
                            <Check size={10} />
                            Analyzed
                          </span>
                        )}
                      </div>
                      {r.error ? (
                        <p className="result-error">{r.error}</p>
                      ) : (
                        <>
                          <p className="result-file">
                            Source: <span className="result-file-name">{r.fileName}</span>
                          </p>
                          {r.mongoId && (
                            <p className="result-mongo">
                              Record ID: <span className="mongo-id">{r.mongoId}</span>
                            </p>
                          )}
                          <details className="result-details">
                            <summary className="result-summary">View detailed analysis</summary>
                            <pre className="result-pre">{JSON.stringify(r.prediction, null, 2)}</pre>
                          </details>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Footer Action ────────────────────────────────────────────────── */}
            <div className="footer-actions">
              <div className="action-info">
                <div className="model-avatars">
                  {selectedModels.slice(0, 3).map((modelIdx, idx) => (
                    <div key={idx} className="model-avatar" style={{ background: MODELS[modelIdx]?.gradient }}>
                      {MODELS[modelIdx]?.name?.[0] ?? "AI"}
                    </div>
                  ))}
                  {selectedModels.length > 3 && (
                    <div className="model-avatar">+{selectedModels.length - 3}</div>
                  )}
                </div>
                <span>
                  {mode === "auto" ? (
                    <>
                      <Brain size={14} />
                      <span className="action-status">Neural Router</span> standby
                    </>
                  ) : (
                    <>
                      <span className="action-status">{selectedModels.length} models</span> ready for deployment
                    </>
                  )}
                </span>
                {isAnalyzing && (
                  <div className="analyzing-indicator">
                    <Loader2 size={14} className="spin-icon" />
                    {progress.total > 0 && <span>{progress.done}/{progress.total}</span>}
                  </div>
                )}
                {statusMessage && <span className="status-message">{statusMessage}</span>}
              </div>

              <div className="action-buttons">
                <button className="draft-btn">Save Report</button>
                <button
                  onClick={handleRunAnalysis}
                  disabled={
                    isAnalyzing || storedFiles.length === 0 || (mode === "manual" && selectedModels.length === 0)
                  }
                  className={`analyze-btn ${
                    isAnalyzing || storedFiles.length === 0 || (mode === "manual" && selectedModels.length === 0)
                      ? "disabled"
                      : "active"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      {mode === "manual" && progress.total > 0
                        ? `Processing (${progress.done}/${progress.total})`
                        : "Analyzing..."}
                    </>
                  ) : (
                    <>
                      Run Diagnosis
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalDashboard4;