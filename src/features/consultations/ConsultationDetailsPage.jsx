import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardShell from "../../components/layout/DashboardShell";
import { FiArrowLeft, FiHeart, FiClock, FiInfo } from "react-icons/fi";
import consultationService from "./data/consultationService";
import userApi from "./data/userApi";
import "../../styles/patient-consultation.css";

export default function PatientConsultationDetailPage() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        let data = await consultationService.getConsultationById(consultationId);
        
        // Resolve doctor name if missing
        if (data && !data.name && data.doctorId) {
          try {
            const dData = await userApi.getDoctorById(data.doctorId);
            const fullName = dData.name || dData.fullName || 
                            (`${dData.firstName || ""} ${dData.lastName || ""}`.trim());
            data = { 
              ...data, 
              name: fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}` 
            };
          } catch (e) {
            data = { ...data, name: data.name || "Doctor" };
          }
        }
        
        setConsultation(data);
      } catch (err) {
        console.error("Failed to fetch consultation details", err);
        setError("Détails de la consultation introuvables.");
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) fetchDetail();
  }, [consultationId]);


  if (loading) {
    return (
      <DashboardShell title="Consultation detail" description="Loading...">
        <div style={{ padding: "40px", textAlign: "center" }}>Chargement...</div>
      </DashboardShell>
    );
  }

  if (error || !consultation) {
    return (
      <DashboardShell title="Consultation detail" description="Not found">
        <div className="patient-consultation-page">
          <div className="consultation-detail-card">
            <p>{error || "Consultation introuvable."}</p>
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