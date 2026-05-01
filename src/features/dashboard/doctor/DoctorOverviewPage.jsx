import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../../components/layout/DashboardShell";
import logoSahtekonline from "../../../assets/logoSahtekonline.png";
import {
  FiCalendar,
  FiFileText,
  FiLock,
  FiMessageSquare,
  FiShield,
  FiUpload,
  FiUsers,
} from "react-icons/fi";
import { RiAiGenerate } from "react-icons/ri";
import { FaStethoscope } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import "../../../styles/doctor-overview.css";

const MotionSection = motion.section;
const MotionButton = motion.button;
const MotionDiv = motion.div;

const services = [
  {
    icon: <RiAiGenerate />,
    title: "AI Clinical Support",
    description:
      "Review AI-supported image analysis to help prioritize and validate clinical decisions.",
  },
  {
    icon: <FiCalendar />,
    title: "Appointment Management",
    description:
      "Organize your daily schedule, online consultations and in-person visits with ease.",
  },
  {
    icon: <FiUsers />,
    title: "Patient Follow-up",
    description:
      "Access patient files, consultation history and follow-up notes from one workspace.",
  },
  {
    icon: <FiFileText />,
    title: "Medical Reports",
    description:
      "Prepare structured reports and prescriptions after each consultation.",
  },
  {
    icon: <FiMessageSquare />,
    title: "Secure Consultation",
    description:
      "Communicate with patients through a protected workflow designed for healthcare.",
  },
  {
    icon: <FiLock />,
    title: "Protected Data",
    description:
      "Keep sensitive medical data organized with secure access across the doctor dashboard.",
  },
];

const steps = [
  {
    number: "1",
    title: "Review",
    description: "Open new appointments, consultation requests and patient files.",
  },
  {
    number: "2",
    title: "Analyze",
    description: "Use AI support to inspect medical images and detect key signals.",
  },
  {
    number: "3",
    title: "Validate",
    description: "Confirm the diagnosis with your clinical judgement.",
  },
  {
    number: "4",
    title: "Follow up",
    description: "Share reports, prescriptions and next steps with the patient.",
  },
];

export default function DoctorOverviewPage() {
  const navigate = useNavigate();

  const handleManageAppointments = () => {
    navigate("/doctor/appointments");
  };

  const handleOpenPatients = () => {
    navigate("/patients");
  };

  return (
    <DashboardShell title="Dashboard" description="Overview">
      <div className="doctor-overview-page">
        <MotionSection
          className="doctor-hero-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="doctor-hero-logo-wrap">
            <img
              src={logoSahtekonline}
              alt="Sahtek Online"
              className="doctor-hero-logo"
            />
          </div>

          <p className="doctor-hero-platform-text">
            At Our Doctor Platform <span>Sahtek Online</span>
          </p>

          <h2 className="doctor-hero-title">
            We combine innovative <span className="blue-word">AI</span>{" "}
            technologies with clinical workflows to help doctors manage care
            faster and with more confidence.
          </h2>

          <p className="doctor-hero-subtitle">
            An intelligent medical workspace for appointments, patient follow-up,
            image analysis review and secure consultation management.
          </p>

          <div className="doctor-hero-actions">
            <MotionButton
              className="doctor-consult-btn"
              onClick={handleManageAppointments}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaStethoscope />
              Manage Appointments
            </MotionButton>

            <MotionButton
              className="doctor-analysis-btn"
              onClick={handleOpenPatients}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BsStars />
              Patient Files
            </MotionButton>
          </div>

          <p className="doctor-hero-note">
            The AI provides clinical assistance only; final diagnosis and
            treatment remain under the doctor&apos;s professional responsibility.
          </p>
        </MotionSection>

        <MotionSection
          className="doctor-stats-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="doctor-stat-item">
            <h3>5,000+</h3>
            <p>Patients Managed</p>
          </div>

          <div className="doctor-stat-item">
            <h3>20 s</h3>
            <p>Avg. AI Review Time</p>
          </div>

          <div className="doctor-stat-item">
            <h3>98%</h3>
            <p>AI Support Accuracy</p>
          </div>

          <div className="doctor-stat-item">
            <h3>24/7</h3>
            <p>Secure Access</p>
          </div>
        </MotionSection>

        <MotionSection
          className="doctor-services-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="doctor-section-header">
            <h3>
              Top <span>services</span> for doctors
            </h3>
            <p>
              Sahtek Online gives doctors a connected digital workspace for
              consultations, patient records, AI-supported analysis and secure
              follow-up.
            </p>
          </div>

          <div className="doctor-services-grid">
            {services.map((service, index) => (
              <MotionDiv
                className="doctor-service-card"
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 16px 32px rgba(45, 158, 241, 0.15)",
                }}
              >
                <div className="doctor-service-icon">{service.icon}</div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="doctor-steps-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <div className="doctor-section-header">
            <h3>
              How <span>doctor workflow</span> works
            </h3>
            <p>
              Move through the full consultation journey from request review to
              validated care plan.
            </p>
          </div>

          <div className="doctor-steps-grid">
            {steps.map((step, index) => (
              <MotionDiv
                className="doctor-step-item"
                key={step.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <MotionDiv
                  className="doctor-step-number"
                  whileInView={{ rotate: 360 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {step.number}
                </MotionDiv>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <footer className="doctor-overview-footer">
          <span>© 2026 Sahtek Online. All rights reserved.</span>

          <div className="doctor-footer-socials">
            <FiShield />
            <FiUpload />
            <FiMessageSquare />
            <FiFileText />
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}
