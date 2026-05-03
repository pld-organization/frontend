import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../../components/layout/DashboardShell";
import {
  FiUsers,
  FiFileText,
  FiHome,
  FiPlus,
  FiArrowRight,
  FiActivity,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import userApi from "../../consultations/data/userApi";
import { getStoredUser } from "../../../services/authStorage";
import "../../../styles/doctor-overview.css";

export default function DoctorOverviewPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile and patient IDs in parallel
        const [profileData, idsResponse] = await Promise.all([
          userApi.getProfile(),
          userApi.getPatientIds()
        ]);

        setProfile(profileData);

        const ids = Array.isArray(idsResponse) ? idsResponse : (idsResponse?.ids || []);
        
        // Fetch details for all patients to calculate pending consultations and get recent ones
        // Note: For a real app, we'd want a more optimized way to get "pending" count,
        // but following the pattern from DoctorPatientsPage.jsx.
        const patientDetails = await Promise.all(
          (ids || []).map(id => userApi.getPatientById(id).catch(err => {
            console.error(`Failed to fetch patient ${id}`, err);
            return null;
          }))
        );

        const formattedPatients = patientDetails
          .filter(p => p !== null)
          .map(p => ({
            id: p.id || p.userId || p._id,
            name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Patient",
            meetingResult: p.meetingResult,
            avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id || p.firstName}`,
          }));

        setPatients(formattedPatients);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const doctorData = useMemo(() => {
    if (!profile) return { 
      name: authUser?.name ? (authUser.name.startsWith("Dr.") ? authUser.name : `Dr. ${authUser.name}`) : "", 
      speciality: "", 
      establishment: "" 
    };
    
    const fullName = profile.name || profile.fullName || 
                    (`${profile.firstName || ""} ${profile.lastName || ""}`.trim()) || authUser?.name || "";
    
    return {
      name: fullName ? (fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}`) : "",
      speciality: profile.doctor?.speciality || profile.speciality || "",
      establishment: profile.doctor?.establishment || profile.establishment || ""
    };
  }, [profile, authUser]);

  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const pendingConsultations = patients.filter(p => !p.meetingResult || p.meetingResult === "—").length;
    const establishment = doctorData.establishment;

    return [
      { label: "Total Patients", value: totalPatients, icon: <FiUsers /> },
      { label: "Pending Consultations", value: pendingConsultations, icon: <FiFileText /> },
      { label: "Establishment", value: establishment, icon: <FiHome />, isText: true },
    ];
  }, [patients, doctorData]);

  const recentPatients = useMemo(() => {
    return patients.slice(-5).reverse(); // Last 5 patients
  }, [patients]);

  if (loading) {
    return (
      <DashboardShell title="Dashboard" description="Overview">
        <div className="loading-container" style={{ padding: "80px", textAlign: "center" }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ display: "inline-block" }}
          >
            <FiActivity size={40} color="#3b82f6" />
          </motion.div>
          <p style={{ marginTop: "20px", color: "#64748b", fontWeight: "600" }}>Chargement du tableau de bord...</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Dashboard" description="Overview">
      <div className="doctor-overview-page">
        <header className="overview-welcome">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="welcome-card"
          >
            <div className="welcome-text">
              <h2>Welcome back, {doctorData.name}</h2>
              <p>{doctorData.speciality} • {doctorData.establishment}</p>
            </div>
            <div className="welcome-action">
              <button className="start-consultation-btn" onClick={() => navigate("/patients")}>
                <FiPlus /> Start Consultation
              </button>
            </div>
          </motion.div>
        </header>

        <section className="stats-grid-custom">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-info">
                <span className={stat.isText ? "stat-value-text" : "stat-value"}>{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-icon-box">{stat.icon}</div>
            </motion.div>
          ))}
        </section>

        <div className="dashboard-content-grid">
          <section className="recent-patients-section">
            <div className="section-header">
              <h3>Recent Patients</h3>
              <button className="view-all-link" onClick={() => navigate("/patients")}>
                View All <FiArrowRight />
              </button>
            </div>
            
            <div className="patients-list-simple">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient, i) => (
                  <motion.div 
                    key={patient.id} 
                    className="patient-item-simple"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="patient-info-simple">
                      <img src={patient.avatar} alt={patient.name} className="patient-avatar-small" />
                      <div className="patient-details-simple">
                        <strong>{patient.name}</strong>
                        <span>ID: {patient.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                    <button 
                      className="patient-action-btn-small"
                      onClick={() => navigate(`/doctor/consultation?patientId=${patient.id}`)}
                    >
                      Consult
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state-simple">
                  <FiUsers size={32} />
                  <p>No patients found.</p>
                </div>
              )}
            </div>
          </section>

          <section className="quick-info-card">
            <div className="info-card-header">
              <h3>Professional Info</h3>
            </div>
            <div className="info-card-body">
              <div className="info-item">
                <FiUser />
                <div>
                  <label>Speciality</label>
                  <span>{doctorData.speciality}</span>
                </div>
              </div>
              <div className="info-item">
                <FiHome />
                <div>
                  <label>Establishment</label>
                  <span>{doctorData.establishment}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}