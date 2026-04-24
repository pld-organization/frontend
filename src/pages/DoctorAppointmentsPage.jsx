import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { FiClock, FiArrowLeft } from "react-icons/fi";
import "../styles/doctor-overview.css";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const allAppointments = [
  {
    id: 1,
    time: "10:00",
    patient: "Dehmani Mohamed",
    type: "IRL",
    status: "Completed",
    statusClass: "completed",
    date: "2026-04-20",
  },
  {
    id: 2,
    time: "11:15",
    patient: "Salmi Ahmed",
    type: "IRL",
    status: "Pending",
    statusClass: "pending",
    date: "2026-04-20",
  },
  {
    id: 3,
    time: "13:20",
    patient: "Meziani Lamia",
    type: "IRL",
    status: "Pending",
    statusClass: "pending",
    date: "2026-04-20",
  },
  {
    id: 4,
    time: "15:30",
    patient: "Attou Dihia",
    type: "IRL",
    status: "Confirmed",
    statusClass: "confirmed",
    date: "2026-04-20",
  },
  {
    id: 5,
    time: "20:00",
    patient: "Ayache Anis",
    type: "Online",
    status: "Confirmed",
    statusClass: "confirmed",
    date: "2026-04-20",
  },
  {
    id: 6,
    time: "09:00",
    patient: "Ahmed Karim",
    type: "IRL",
    status: "Confirmed",
    statusClass: "confirmed",
    date: "2026-04-21",
  },
  {
    id: 7,
    time: "10:30",
    patient: "Fatima Zahra",
    type: "Online",
    status: "Confirmed",
    statusClass: "confirmed",
    date: "2026-04-21",
  },
  {
    id: 8,
    time: "14:00",
    patient: "Mohamed Amine",
    type: "IRL",
    status: "Pending",
    statusClass: "pending",
    date: "2026-04-21",
  },
];

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleGoBack = () => {
    navigate("/doctor/dashboard");
  };

  const filteredAppointments =
    selectedStatus === "all"
      ? allAppointments
      : allAppointments.filter((apt) => apt.statusClass === selectedStatus);

  return (
    <DashboardShell title="Appointments" description="Full Schedule">
      <div className="doctor-overview-page">
        <button
          type="button"
          onClick={handleGoBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #2490ea",
            background: "#f0f7ff",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 600,
            color: "#2490ea",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2490ea";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f0f7ff";
            e.currentTarget.style.color = "#2490ea";
          }}
        >
          <FiArrowLeft />
          Back to Overview
        </button>

        <MotionDiv
          className="doctor-overview-greeting"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Your complete schedule
        </MotionDiv>

        <MotionSection
          className="doctor-appointments-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="doctor-appointments-header">
            <div>
              <h2>All Appointments</h2>
              <p>Total: {filteredAppointments.length} appointments</p>
            </div>
          </div>

          <div className="filter-buttons" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button
              type="button"
              className={`filter-btn ${selectedStatus === "all" ? "active" : ""}`}
              onClick={() => setSelectedStatus("all")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: selectedStatus === "all" ? "2px solid #2490ea" : "1px solid #ddd",
                background: selectedStatus === "all" ? "#2490ea" : "#fff",
                color: selectedStatus === "all" ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedStatus === "confirmed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("confirmed")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: selectedStatus === "confirmed" ? "2px solid #2490ea" : "1px solid #ddd",
                background: selectedStatus === "confirmed" ? "#2490ea" : "#fff",
                color: selectedStatus === "confirmed" ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Confirmed
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedStatus === "pending" ? "active" : ""}`}
              onClick={() => setSelectedStatus("pending")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: selectedStatus === "pending" ? "2px solid #2490ea" : "1px solid #ddd",
                background: selectedStatus === "pending" ? "#2490ea" : "#fff",
                color: selectedStatus === "pending" ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Pending
            </button>
            <button
              type="button"
              className={`filter-btn ${selectedStatus === "completed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("completed")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: selectedStatus === "completed" ? "2px solid #2490ea" : "1px solid #ddd",
                background: selectedStatus === "completed" ? "#2490ea" : "#fff",
                color: selectedStatus === "completed" ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Completed
            </button>
          </div>

          <div className="doctor-appointments-list">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div className="doctor-appointment-row" key={appointment.id}>
                  <div className="appointment-time-block">
                    <span className="time-icon">
                      <FiClock />
                    </span>
                    <div>
                      <div className="time-value">{appointment.time}</div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                        {appointment.date}
                      </div>
                    </div>
                  </div>

                  <div className="appointment-patient">{appointment.patient}</div>

                  <div className="appointment-type">{appointment.type}</div>

                  <div className="appointment-status-wrap">
                    <span
                      className={`appointment-status-pill ${appointment.statusClass}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#999",
                }}
              >
                No appointments found
              </div>
            )}
          </div>
        </MotionSection>
      </div>
    </DashboardShell>
  );
}
