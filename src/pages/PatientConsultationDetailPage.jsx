import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardShell from "../components/DashboardShell";
import { FiArrowLeft, FiHeart, FiClock, FiInfo } from "react-icons/fi";
import "../styles/patient-consultation.css";

const consultations = [
  {
    id: 1,
    name: "Dehmani mohamed",
    date: "13/04/2026 -- 12:30 PM to 13:20 PM",
    result: "ready",
    statusClass: "ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
    details:
      "Your consultation is complete and the results are ready. Review the diagnosis and schedule a follow-up if needed.",
  },
  {
    id: 2,
    name: "Dehmani mohamed",
    date: "13/04/2026 -- 12:30 PM to 13:20 PM",
    result: "not ready",
    statusClass: "not-ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
    details:
      "The consultation is still being processed. You will receive the final report once the doctor completes the review.",
  },
  {
    id: 3,
    name: "Dehmani mohamed",
    date: "13/04/2026 -- 12:30 PM to 13:20 PM",
    result: "ready",
    statusClass: "ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
    details:
      "Your consultation report is ready. Check the results and follow the recommendations for your care plan.",
  },
  {
    id: 4,
    name: "Dehmani mohamed",
    date: "13/04/2026 -- 12:30 PM to 13:20 PM",
    result: "not ready",
    statusClass: "not-ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
    details:
      "We are still finalizing your consultation review. Please check again soon for the completed report.",
  },
];

export default function PatientConsultationDetailPage() {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  const consultation = useMemo(
    () => consultations.find((item) => item.id === Number(consultationId)),
    [consultationId]
  );

  if (!consultation) {
    return (
      <DashboardShell title="Consultation detail" description="Not found">
        <div className="patient-consultation-page">
          <div className="consultation-detail-card">
            <p>Consultation introuvable.</p>
            <button
              type="button"
              className="details-btn"
              onClick={() => navigate("/consultation")}
            >
              Retour à la consultation
            </button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Consultation detail" description="Overview">
      <div className="patient-consultation-page">
        <motion.section
          className="consultation-detail-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            className="details-btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> Retour
          </button>

          <div className="consultation-detail-header">
            <img
              src={consultation.avatar}
              alt={consultation.name}
              className="consultation-avatar"
            />
            <div>
              <h2>{consultation.name}</h2>
              <p>{consultation.date}</p>
              <div className="consultation-status-row">
                <FiHeart />
                <span className={`consultation-result ${consultation.statusClass}`}>
                  {consultation.result}
                </span>
              </div>
            </div>
          </div>

          <div className="consultation-detail-info">
            <h3>
              <FiInfo /> Informations de consultation
            </h3>
            <p>{consultation.details}</p>
          </div>
        </motion.section>
      </div>
    </DashboardShell>
  );
}
