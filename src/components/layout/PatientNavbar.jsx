import { NavLink } from "react-router-dom";
import { FiGrid, FiClock, FiUsers, FiActivity, FiMessageCircle } from "react-icons/fi";

const patientMenu = [
  { label: "Overview", to: "/patient-dashboard", icon: <FiGrid /> },
  { label: "Schedule", to: "/schedule", icon: <FiClock /> },
  { label: "Appointment", to: "/appointments", icon: <FiUsers /> },
  { label: "Analysis", to: "/analysis", icon: <FiActivity /> },
  { label: "Consultation", to: "/consultation", icon: <FiMessageCircle /> },
];

export function PatientNavbar() {
  return (
    <>
      {patientMenu.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <div className="dashboard-nav-left">
            <span className="dashboard-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        </NavLink>
      ))}
    </>
  );
}

export default PatientNavbar;
