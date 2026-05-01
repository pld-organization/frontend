import { NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiHelpCircle, FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import logoSahtekonline from "../../assets/logoSahtekonline.png";
import PatientNavbar from "./PatientNavbar";
import DoctorNavbar from "./DoctorNavbar";

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const role = (user?.role || "patient").toLowerCase();
  const isDoctor = role.includes("doctor");

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="dashboard-brand-row">
          <div className="dashboard-brand">
            <img
              src={logoSahtekonline}
              alt="Sahtek Online"
              className="dashboard-brand-logo"
            />
          </div>
          <button
            type="button"
            className="dashboard-collapse-btn"
            aria-label="Collapse sidebar"
          >
            <FiChevronDown />
          </button>
        </div>

        <nav className="dashboard-nav">
          <div className="dashboard-nav-group">
            {isDoctor ? <DoctorNavbar /> : <PatientNavbar />}
          </div>
        </nav>
      </div>

      <div className="dashboard-bottom-menu">
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `dashboard-bottom-item ${isActive ? "active" : ""}`
          }
        >
          <span className="dashboard-bottom-icon"><FiHelpCircle /></span>
          <span>Help</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `dashboard-bottom-item ${isActive ? "active" : ""}`
          }
        >
          <span className="dashboard-bottom-icon"><FiSettings /></span>
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="dashboard-bottom-item dashboard-logout-side-btn"
          onClick={handleLogout}
        >
          <span className="dashboard-bottom-icon">
            <FiLogOut />
          </span>
          <span>Déconnecter</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
