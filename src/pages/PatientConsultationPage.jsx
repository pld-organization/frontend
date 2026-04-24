import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { FiHeart } from "react-icons/fi";
import "../styles/patient-consultation.css";

const consultations = [
  {
    id: 1,
    name: "Dehmani mohamed",
    date: "13/04/2026--12:30 PM to 13:20 PM",
    result: "ready",
    statusClass: "ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Dehmani mohamed",
    date: "13/04/2026--12:30 PM to 13:20 PM",
    result: "not ready",
    statusClass: "not-ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Dehmani mohamed",
    date: "13/04/2026--12:30 PM to 13:20 PM",
    result: "ready",
    statusClass: "ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Dehmani mohamed",
    date: "13/04/2026--12:30 PM to 13:20 PM",
    result: "not ready",
    statusClass: "not-ready",
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
];

export default function PatientConsultationPage() {
  const navigate = useNavigate();

  const handleDetailsClick = (id) => {
    navigate(`/consultation/${id}`);
  };

  return (
    <DashboardShell title="Dashboard" description="Overview">
      <div className="patient-consultation-page">
        <motion.div
          className="consultation-title-row"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <FiHeart className="consultation-title-icon" />
          <h2>Consultation</h2>
        </motion.div>

        <motion.section
          className="consultation-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="consultation-list">
            {consultations.map((item, index) => (
              <motion.div
                className="consultation-row"
                key={item.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + index * 0.06 }}
              >
                <div className="consultation-user">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="consultation-avatar"
                  />
                  <span className="consultation-name">{item.name}</span>
                </div>

                <div className="consultation-date-block">
                  <span className="consultation-label">Day and Hour of visit</span>
                  <span className="consultation-date">{item.date}</span>
                </div>

                <div className="consultation-result-block">
                  <span className="consultation-label">result</span>
                  <span className={`consultation-result ${item.statusClass}`}>
                    {item.result}
                  </span>
                </div>

                <div className="consultation-action">
                  <button
                    type="button"
                    className="details-btn"
                    onClick={() => handleDetailsClick(item.id)}
                  >
                    more details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </DashboardShell>
  );
}