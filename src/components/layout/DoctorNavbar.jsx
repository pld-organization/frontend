import { NavLink } from "react-router-dom";
import { FiGrid, FiCalendar, FiUsers, FiClock, FiMessageCircle } from "react-icons/fi";

const doctorMenu = [
  { label: "Overview", to: "/doctor/overview", icon: <FiGrid /> },
  { label: "Appointments", to: "/doctor/appointments", icon: <FiCalendar /> },
  { label: "Patients", to: "/patients", icon: <FiUsers /> },
  { label: "Schedule", to: "/availability", icon: <FiClock /> },
  { label: "Consultation", to: "/doctor/consultation", icon: <FiMessageCircle /> },
];

export function DoctorNavbar() {
  return (
    <>
      {doctorMenu.map((item) => (
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

export default DoctorNavbar;
