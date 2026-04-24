import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import {
  FiUsers,
  FiCalendar,
  FiClipboard,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import "../styles/doctor-overview.css";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const stats = [
  {
    id: 1,
    value: "10",
    label: "Total Patients",
    icon: <FiUsers />,
  },
  {
    id: 2,
    value: "3",
    label: "Pending Prescriptions",
    icon: <FiClipboard />,
  },
  {
    id: 3,
    value: "28",
    label: "Appointments of the Week",
    icon: <FiCalendar />,
  },
  {
    id: 4,
    value: "5",
    label: "Completed Consultations",
    icon: <FiCheckCircle />,
  },
];

const appointments = [
  {
    id: 1,
    time: "10:00",
    patient: "Dehmani Mohamed",
    type: "IRL",
    status: "Completed",
    statusClass: "completed",
  },
  {
    id: 2,
    time: "11:15",
    patient: "Salmi Ahmed",
    type: "IRL",
    status: "Pending",
    statusClass: "pending",
  },
  {
    id: 3,
    time: "13:20",
    patient: "Meziani Lamia",
    type: "IRL",
    status: "Pending",
    statusClass: "pending",
  },
  {
    id: 4,
    time: "15:30",
    patient: "Attou Dihia",
    type: "IRL",
    status: "Confirmed",
    statusClass: "confirmed",
  },
  {
    id: 5,
    time: "20:00",
    patient: "Ayache Anis",
    type: "Online",
    status: "Confirmed",
    statusClass: "confirmed",
  },
];

export default function DoctorOverviewPage() {
  const navigate = useNavigate();

  const handleViewFullSchedule = () => {
    navigate("/doctor/appointments");
  };

  return (
    <DashboardShell title="Dashboard" description="Overview">
      <div className="doctor-overview-page">
        <MotionDiv
          className="doctor-overview-greeting"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          Hi Dr.Dehmani, Here is your activity of the day
        </MotionDiv>

        <MotionSection
          className="doctor-stats-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04 }}
        >
          {stats.map((item, index) => (
            <div
              className={`doctor-stat-item ${
                index !== stats.length - 1 ? "with-divider" : ""
              }`}
              key={item.id}
            >
              <div className="doctor-stat-text">
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>

              <div className="doctor-stat-icon">{item.icon}</div>
            </div>
          ))}
        </MotionSection>

        <MotionSection
          className="doctor-appointments-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <div className="doctor-appointments-header">
            <div>
              <h2>Today&apos;s Appointments</h2>
              <p>Monday, April 20, 2026</p>
            </div>

            <button 
              type="button" 
              className="full-schedule-btn"
              onClick={handleViewFullSchedule}
            >
              View Full Schedule
            </button>
          </div>

          <div className="doctor-appointments-list">
            {appointments.map((appointment) => (
              <div className="doctor-appointment-row" key={appointment.id}>
                <div className="appointment-time-block">
                  <span className="time-icon">
                    <FiClock />
                  </span>
                  <span className="time-value">{appointment.time}</span>
                </div>

                <div className="appointment-patient">
                  {appointment.patient}
                </div>

                <div className="appointment-type">{appointment.type}</div>

                <div className="appointment-status-wrap">
                  <span
                    className={`appointment-status-pill ${appointment.statusClass}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MotionSection>
      </div>
    </DashboardShell>
  );
}
