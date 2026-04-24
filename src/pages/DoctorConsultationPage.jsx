import { motion } from "framer-motion";
import DashboardShell from "../components/DashboardShell";
import {
  FiUser,
  FiHeart,
  FiCalendar,
  FiClock,
  FiPhone,
  FiMail,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "../styles/doctor-consultation.css";

export default function DoctorConsultationPage() {
  const consultation = {
    patientName: "Nabil Haddad",
    patientAge: "40",
    patientGender: "Male",
    doctorName: "Dr. Dehmani Youcef",
    visitDate: "19/06/2026, 09:00 AM",
    type: "Online",
    patientId: "2104532",
    doctorSpeciality: "Urologist",
    doctorAddress: "Zone urbaine section 11, Boumerdés",
    doctorPhone: "+2137777777",
    prescriptionDate: "19/06/2026",
  };

  return (
    <DashboardShell title="Dashboard" description="Consultation">
      <div className="doctor-consultation-page">
        <motion.section
          className="consultation-info-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="consultation-section-title">Patient Information</h2>

          <div className="consultation-top-grid">
            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiUser />
                <span>Patient Name</span>
              </div>
              <div className="consultation-meta-value">{consultation.patientName}</div>
              <div className="consultation-meta-sub">
                {consultation.patientAge}/ {consultation.patientGender}
              </div>
            </div>

            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiHeart />
                <span>Doctor Name</span>
              </div>
              <div className="consultation-meta-value">{consultation.doctorName}</div>
            </div>

            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiCalendar />
                <span>Visite Date</span>
              </div>
              <div className="consultation-meta-value">{consultation.visitDate}</div>
            </div>

            <div className="consultation-meta-item">
              <div className="consultation-meta-label">
                <FiClock />
                <span>Type</span>
              </div>
              <div className="consultation-meta-value">{consultation.type}</div>
            </div>
          </div>

          <div className="consultation-divider" />

          <div className="consultation-bottom-row">
            <div className="consultation-patient-id">
              <span>Patient ID :</span>
              <strong>{consultation.patientId}</strong>
            </div>

            <div className="consultation-contact-actions">
              <button type="button" className="icon-action-btn call-btn">
                <FiPhone />
              </button>
              <button type="button" className="icon-action-btn mail-btn">
                <FiMail />
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="prescription-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
        >
          <div className="prescription-header">
            <h2 className="consultation-section-title">Perscription Preview</h2>

            <div className="prescription-header-actions">
              <button type="button" className="icon-action-btn neutral-btn">
                <FiEdit2 />
              </button>
              <button type="button" className="icon-action-btn delete-btn">
                <FiTrash2 />
              </button>
            </div>
          </div>

          <div className="prescription-preview-box">
            <div className="prescription-doctor-head">
              <h3>{consultation.doctorName}</h3>
              <p>{consultation.doctorSpeciality}</p>
              <p>{consultation.doctorAddress}</p>
              <p>
                <strong>Phone :</strong> {consultation.doctorPhone}
              </p>
            </div>

            <div className="prescription-inner-divider" />

            <div className="prescription-main-content">
              <div className="prescription-patient-block">
                <h4>Patient Information</h4>
                <p>
                  <strong>Name :</strong> {consultation.patientName}
                </p>
                <p>
                  <strong>Age:</strong> {consultation.patientAge}
                </p>
                <p>
                  <strong>Gender:</strong> {consultation.patientGender}
                </p>
              </div>

              <div className="prescription-date-block">
                <p>
                  <strong>Date :</strong> {consultation.prescriptionDate}
                </p>
              </div>
            </div>

            <div className="prescription-medication-block">
              <h4>Prescribed Medications</h4>
              <p>No medicines prescribed</p>
            </div>

            <div className="prescription-note">
              <p>
                This prescription is computer generated and does not require
                signature
              </p>
              <p>For any queries, please contact: [Contact Information]</p>
            </div>
          </div>

          <div className="prescription-send-row">
            <button type="button" className="send-btn">
              Send Prescription to Patient
            </button>
          </div>
        </motion.section>

        <motion.div
          className="consultation-footer-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <button type="button" className="end-consultation-btn">
            End Consultation
          </button>
          <button type="button" className="save-consultation-btn">
            Save Consultation
          </button>
        </motion.div>
      </div>
    </DashboardShell>
  );
}