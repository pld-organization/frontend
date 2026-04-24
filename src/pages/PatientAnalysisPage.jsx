import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import {
  FiUpload,
  FiImage,
  FiCheckCircle,
  FiLoader,
  FiTrendingUp,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import "../styles/patient-analysis.css";

const MotionDiv = motion.div;
const MotionButton = motion.button;
const MotionSection = motion.section;

export default function PatientAnalysisPage() {
  const navigate = useNavigate();

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log("File selected:", file.name);
      }
    };
    input.click();
  };

  const handleAnalyze = () => {
    navigate("/consultation");
  };

  return (
    <DashboardShell title="Analysis" description="AI Medical Image Analysis">
      <div className="patient-analysis-page">
        <MotionSection
          className="analysis-hero-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="analysis-hero-content">
            <h2 className="analysis-title">
              <BsStars /> AI Medical Image Analysis
            </h2>
            <p className="analysis-subtitle">
              Upload your medical images (X-ray, CT scan, MRI) for advanced AI analysis
            </p>
          </div>
        </MotionSection>

        <MotionSection
          className="analysis-upload-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="upload-card">
            <div className="upload-icon">
              <FiUpload />
            </div>
            <h3>Upload Medical Image</h3>
            <p>Drag and drop or click to select your image file</p>
            <MotionButton
              className="upload-btn"
              onClick={handleUploadImage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiImage /> Select Image
            </MotionButton>
          </div>
        </MotionSection>

        <MotionSection
          className="analysis-steps-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <h3>How It Works</h3>
          <div className="steps-grid">
            <MotionDiv
              className="step-card"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <div className="step-number">1</div>
              <FiUpload className="step-icon" />
              <h4>Upload</h4>
              <p>Select and upload your medical image</p>
            </MotionDiv>

            <MotionDiv
              className="step-card"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <div className="step-number">2</div>
              <FiLoader className="step-icon" />
              <h4>Processing</h4>
              <p>Our AI analyzes your image in seconds</p>
            </MotionDiv>

            <MotionDiv
              className="step-card"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.35 }}
            >
              <div className="step-number">3</div>
              <FiTrendingUp className="step-icon" />
              <h4>Results</h4>
              <p>Get detailed analysis and recommendations</p>
            </MotionDiv>

            <MotionDiv
              className="step-card"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
            >
              <div className="step-number">4</div>
              <FiCheckCircle className="step-icon" />
              <h4>Consultation</h4>
              <p>Consult with our doctors for validation</p>
            </MotionDiv>
          </div>
        </MotionSection>

        <MotionSection
          className="analysis-action-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <MotionButton
            className="analyze-btn"
            onClick={handleAnalyze}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Previous Analysis
          </MotionButton>
        </MotionSection>
      </div>
    </DashboardShell>
  );
}
