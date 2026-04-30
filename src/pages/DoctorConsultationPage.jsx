import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "../components/DashboardShell";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiGlobe,
  FiSend,
  FiSave,
  FiFileText,
  FiClipboard,
  FiCheckCircle
} from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa";
import "../styles/doctor-consultation.css";

export default function DoctorConsultationPage() {
  const [medications, setMedications] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const consultation = {
    patientName: "Nabil Haddad",
    patientAge: "40",
    patientGender: "Male",
    doctorName: "Dr. Dehmani Youcef",
    visitDate: "19/06/2026, 09:00 AM",
    type: "Online",
    patientId: "2104532",
    doctorSpeciality: "Urologist",
    prescriptionDate: "19/06/2026",
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete medications?")) {
      setMedications("");
      setIsEditing(false);
    }
  };

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardShell title="Consultation" description="Dashboard > Consultation">
      <div className="doctor-consultation-page">
        {/* PATIENT INFORMATION CARD */}
        <motion.section
          className="consultation-info-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="consultation-card-header">
            <div className="title-icon-wrapper">
              <FiUser />
            </div>
            <h2>Patient Information</h2>
          </div>

          <div className="consultation-top-grid">
            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiUser className="meta-icon" />
                <span>Patient</span>
              </div>
              <div className="consultation-meta-value">{consultation.patientName}</div>
              <div className="consultation-meta-sub">
                {consultation.patientAge} / {consultation.patientGender}
              </div>
            </div>

            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FaStethoscope className="meta-icon" />
                <span>Doctor</span>
              </div>
              <div className="consultation-meta-value">{consultation.doctorName}</div>
              <div className="consultation-meta-sub">{consultation.doctorSpeciality}</div>
            </div>

            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiCalendar className="meta-icon" />
                <span>Visit Date</span>
              </div>
              <div className="consultation-meta-value">{consultation.visitDate}</div>
            </div>

            <div className="consultation-meta-item no-border">
              <div className="consultation-meta-label">
                <FiGlobe className="meta-icon" />
                <span>Type</span>
              </div>
              <div className="consultation-meta-value">{consultation.type}</div>
              <div>
                <span className="active-badge">Active</span>
              </div>
            </div>
          </div>

          <div className="consultation-divider" />

          <div className="consultation-bottom-row">
            <div className="consultation-patient-id">
              <span>Patient ID :</span>
              <strong>{consultation.patientId}</strong>
            </div>

            <div className="consultation-contact-actions">
              <button type="button" className="contact-action-btn">
                <FiPhone />
              </button>
              <button type="button" className="contact-action-btn">
                <FiMail />
              </button>
            </div>
          </div>
        </motion.section>

        {/* PRESCRIPTION PREVIEW CARD */}
        <motion.section
          className="prescription-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <div className="prescription-card-header">
            <div className="title-left">
              <div className="title-icon-wrapper">
                <FiFileText />
              </div>
              <h2>Prescription Preview</h2>
            </div>

            <div className="prescription-header-actions">
              <button type="button" className="edit-btn" onClick={handleEdit}>
                <FiEdit2 />
                {isEditing ? "Done" : "Edit"}
              </button>
              <button type="button" className="delete-btn" onClick={handleDelete}>
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>

          <div className="prescription-preview-box">
            <div className="prescription-doctor-head">
              <h3>{consultation.doctorName}</h3>
              <p>{consultation.doctorSpeciality}</p>
            </div>

            <div className="prescription-dashed-divider" />

            <div className="prescription-date-row">
              <strong>Date:</strong> {consultation.prescriptionDate}
            </div>

            <div className="prescription-main-content">
              <div className="prescription-patient-block">
                <h4 className="blue-title">Patient Information</h4>
                <div className="info-line">
                  <span className="info-label">Name</span>
                  <span className="info-separator">:</span>
                  <span className="info-value">{consultation.patientName}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Age</span>
                  <span className="info-separator">:</span>
                  <span className="info-value">{consultation.patientAge}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Gender</span>
                  <span className="info-separator">:</span>
                  <span className="info-value">{consultation.patientGender}</span>
                </div>
              </div>

              <div className="prescription-vertical-divider" />

              <div className="prescription-medication-block">
                <h4 className="blue-title">Prescribed Medications</h4>
                
                {isEditing ? (
                  <textarea 
                    className="medications-input"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="Type medications here..."
                    autoFocus
                  />
                ) : medications.trim() !== "" ? (
                  <div className="medications-display">
                    {medications.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="empty-medications">
                    <div className="empty-icon">
                      <FiClipboard />
                    </div>
                    <div>
                      <h5>No medicines prescribed</h5>
                      <p>You can add medications to this prescription.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="prescription-dashed-divider" />

            <div className="prescription-note">
              <p>This prescription is computer generated and does not require signature.</p>
              <p>For any queries, please contact: [Contact Information]</p>
            </div>
          </div>
        </motion.section>

        {/* BOTTOM ACTIONS */}
        <motion.div
          className="consultation-footer-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <button 
            type="button" 
            className={`send-prescription-btn ${isSent ? "success" : ""}`}
            onClick={handleSend}
            disabled={isSent}
          >
            {isSent ? <FiCheckCircle /> : <FiSend />}
            {isSent ? "Sent Successfully!" : "Send Prescription to Patient"}
          </button>

          <button 
            type="button" 
            className={`save-consultation-btn ${isSaved ? "success" : ""}`}
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? <FiCheckCircle /> : <FiSave />}
            {isSaved ? "Saved!" : "Save Consultation"}
          </button>
        </motion.div>
      </div>
    </DashboardShell>
  );
}