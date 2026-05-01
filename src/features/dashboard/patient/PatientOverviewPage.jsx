import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../../components/layout/DashboardShell";
import logoSahtekonline from "../../../assets/logoSahtekonline.png";
import {
  FiCalendar,
  FiFileText,
  FiShield,
  FiUpload,
} from "react-icons/fi";
import { RiAiGenerate } from "react-icons/ri";
import { FaStethoscope } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import "../../../styles/patient-overview.css";

const MotionSection = motion.section;
const MotionButton = motion.button;
const MotionDiv = motion.div;

const services = [
  {
    icon: <RiAiGenerate />,
    title: "Advanced AI Analysis",
    description:
      "Our AI analyzes your medical images with cutting-edge precision to detect anomalies.",
  },
  {
    icon: <FiCalendar />,
    title: "Booking Appointments",
    description:
      "Choose the best time for an in-person visit with our easy-to-use scheduling system.",
  },
  {
    icon: <FiShield />,
    title: "Early Detection",
    description:
      "Identify diseases at an early stage with our deep learning algorithms.",
  },
  {
    icon: <FiFileText />,
    title: "Prescriptions",
    description:
      "Receive and renew prescriptions digitally after your consultation with our specialists.",
  },
  {
    icon: <FiFileText />,
    title: "Medical Reports",
    description:
      "Receive comprehensive and easy-to-understand reports for every analysis.",
  },
  {
    icon: <FiShield />,
    title: "Secure Data",
    description:
      "Your medical data is encrypted and protected according to the strictest standards.",
  },
];

const steps = [
  {
    number: "1",
    title: "Upload",
    description: "Import your medical image (X-ray, CT scan, MRI...).",
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Our AI analyzes the image in seconds.",
  },
  {
    number: "3",
    title: "Results",
    description: "Receive a detailed report with the diagnosis.",
  },
  {
    number: "4",
    title: "Consultation",
    description: "Consult a doctor to validate the results.",
  },
];

export default function PatientOverviewPage() {
  const navigate = useNavigate();

  const handleConsultDoctor = () => {
    navigate("/appointments");
  };

  const handleStartAnalysis = () => {
    navigate("/analysis");
  };

  return (
    <DashboardShell title="Dashboard" description="Overview">
      <div className="patient-overview-page">
        <MotionSection
          className="patient-hero-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="patient-hero-logo-wrap">
            <img
              src={logoSahtekonline}
              alt="Sahtek Online"
              className="patient-hero-logo"
            />
          </div>

          <p className="patient-hero-platform-text">
            At Our Platform <span>Sahtek Online</span>
          </p>

          <h2 className="patient-hero-title">
            We combine innovative <span className="blue-word">AI</span>{" "}
            technologies with a human approach to make every patient feel
            reassured and calm.
          </h2>

          <p className="patient-hero-subtitle">
            An intelligent platform that uses AI to analyze medical images and
            enable fast and reliable diagnosis.
          </p>

          <div className="patient-hero-actions">
            <MotionButton
              className="consult-btn"
              onClick={handleConsultDoctor}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaStethoscope />
              Consult a Doctor
            </MotionButton>

            <MotionButton
              className="analysis-btn"
              onClick={handleStartAnalysis}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BsStars />
              Start Analysis
            </MotionButton>
          </div>

          <p className="patient-hero-note">
            The AI provides guidance and analysis only; it does not replace your
            doctor&apos;s professional decision.
          </p>
        </MotionSection>

        <MotionSection
          className="patient-stats-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className="patient-stat-item">
            <h3>10,000+</h3>
            <p>Successful Consultations</p>
          </div>

          <div className="patient-stat-item">
            <h3>30 s</h3>
            <p>Avg. Analysis Time</p>
          </div>

          <div className="patient-stat-item">
            <h3>98%</h3>
            <p>AI Accuracy</p>
          </div>

          <div className="patient-stat-item">
            <h3>50+</h3>
            <p>Partner Doctors</p>
          </div>
        </MotionSection>

        <MotionSection
          className="patient-services-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="patient-section-header">
            <h3>
              Top <span>services</span> we offer
            </h3>
            <p>
              In today&apos;s fast-paced world, your health deserves the utmost
              attention and convenience. That&apos;s why Sahtek Online offers a
              suite of integrated services designed to support your healthcare
              journey digitally.
            </p>
          </div>

          <div className="patient-services-grid">
            {services.map((service, index) => (
              <MotionDiv
                className="patient-service-card"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8, boxShadow: "0 16px 32px rgba(45, 158, 241, 0.15)" }}
              >
                <div className="patient-service-icon">{service.icon}</div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="patient-steps-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <div className="patient-section-header">
            <h3>
              How <span>our platform</span> works
            </h3>
            <p>
              Navigating your healthcare journey with Sahtek Online is seamless.
              Just follow these steps to proceed with your selected services.
            </p>
          </div>

          <div className="patient-steps-grid">
            {steps.map((step, index) => (
              <MotionDiv
                className="patient-step-item"
                key={step.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <MotionDiv
                  className="patient-step-number"
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

        <footer className="patient-overview-footer">
          <span>© 2026 Sahtek Online. All rights reserved.</span>

          <div className="patient-footer-socials">
            <span>◎</span>
            <span>f</span>
            <span>𝕏</span>
            <span>in</span>
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}
