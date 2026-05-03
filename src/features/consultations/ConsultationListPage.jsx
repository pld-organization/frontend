import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import { FiHeart } from "react-icons/fi";
import consultationService from "./data/consultationService";
import userApi from "./data/userApi";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/patient-consultation.css";

export default function PatientConsultationPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await consultationService.getConsultations();
        
        // Resolve doctor names if missing
        const resolvedData = await Promise.all((data || []).map(async (item) => {
          if (!item.name && item.doctorId) {
            try {
              const dData = await userApi.getDoctorById(item.doctorId);
              const fullName = dData.name || dData.fullName || 
                              (`${dData.firstName || ""} ${dData.lastName || ""}`.trim());
              return { 
                ...item, 
                name: fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}` 
              };
            } catch (e) {
              return { ...item, name: "Doctor" };
            }
          }
          return item;
        }));

        setConsultations(resolvedData);
      } catch (err) {
        console.error("Failed to fetch consultations", err);
        setError("Impossible de charger les consultations.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

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
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Chargement...</div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error}</div>
          ) : (
            <div className="consultation-list">
              {consultations.length > 0 ? (
                consultations.map((item, index) => (
                  <motion.div
                    className="consultation-row"
                    key={item.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 + index * 0.06 }}
                  >
                    <div className="consultation-user">
                      <img
                        src={item.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (item.name || index)}
                        alt={item.name}
                        className="consultation-avatar"
                      />
                      <span className="consultation-name">{item.name || "Patient"}</span>
                    </div>

                    <div className="consultation-date-block">
                      <span className="consultation-label">Day and Hour of visit</span>
                      <span className="consultation-date">{item.date || "N/A"}</span>
                    </div>

                    <div className="consultation-result-block">
                      <span className="consultation-label">result</span>
                      <span className={`consultation-result ${item.statusClass || "pending"}`}>
                        {item.result || "Pending"}
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
                ))
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  Aucune consultation trouvée.
                </div>
              )}
            </div>
          )}
        </motion.section>

      </div>
    </DashboardShell>
  );
}