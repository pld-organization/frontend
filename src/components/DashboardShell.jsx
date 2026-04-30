import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/useAuth";
import {
  FiSearch,
  FiBell,
  FiChevronDown,
  FiGrid,
  FiCalendar,
  FiUsers,
  FiClock,
  FiActivity,
  FiHelpCircle,
  FiSettings,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import logoSahtekonline from "../assets/logoSahtekonline.png";
import "../styles/dashboard-shell.css";

function DashboardShell({ title, description, children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = (user?.role || "patient").toLowerCase();
  const isDoctor = role.includes("doctor");

  const mainMenu = useMemo(() => {
    if (isDoctor) {
      return [
        {
          label: "Overview",
          to: "/doctor/dashboard",
          icon: <FiGrid />,
        },
        {
          label: "Appointments",
          to: "/doctor-appointments",
          icon: <FiCalendar />,
        },
        {
        label: "Patients",
        to: "/patients",
        icon: <FiUsers />,
        },
        {
          label: "Schedule",
          to: "/availability",
          icon: <FiClock />,
        },
        {
          label: "Consultation",
          to: "/doctor/consultation",
          icon: <FiHeart />,
        },
      ];
    }

    return [
      {
        label: "Overview",
        to: "/patient-dashboard",
        icon: <FiGrid />,
      },
      {
        label: "Appointments",
        to: "/appointments",
        icon: <FiCalendar />,
      },
      {
        label: "Analysis",
        to: "/analysis-results",
        icon: <FiActivity />,
      },
      {
        label: "Schedule",
        to: "/schedule",
        icon: <FiClock />,
      },
      {
        label: "Consultation",
        to: "/consultation",
        icon: <FiHeart />,
      },
    ];
  }, [isDoctor]);

  const bottomMenu = [
    {
      label: "Help",
      to: "/help",
      icon: <FiHelpCircle />,
    },
    {
      label: "Settings",
      to: "/settings",
      icon: <FiSettings />,
    },
  ];

  const userInitial =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A";

  const userName = user?.name || (isDoctor ? "Dr Dehmani" : "Dehmani Mohamed");
  const userSubtitle = isDoctor
    ? user?.speciality || "Urologist"
    : "Patient";

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  }

  function handleUserClick() {
    if (isDoctor) {
      navigate("/doctor/profile");
    } else {
      navigate("/patient/profile");
    }
  }

  return (
    <div className="dashboard-shell-layout">
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
              {mainMenu.map((item) => (
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
            </div>
          </nav>
        </div>

        <div className="dashboard-bottom-menu">
          {bottomMenu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `dashboard-bottom-item ${isActive ? "active" : ""}`
              }
            >
              <span className="dashboard-bottom-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

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

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading-inline">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="dashboard-topbar-right">
            <div className="dashboard-search">
              <FiSearch className="dashboard-search-icon" />
              <input type="text" placeholder="Search" />
            </div>

            <button type="button" className="dashboard-icon-btn">
              <FiBell />
            </button>

            <div className="dashboard-user-box" onClick={handleUserClick}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className="dashboard-user-avatar-image"
                />
              ) : (
                <div className="dashboard-user-avatar">{userInitial}</div>
              )}

              <div className="dashboard-user-info">
                <span className="dashboard-user-name">{userName}</span>
                <span className="dashboard-user-role">{userSubtitle}</span>
              </div>

              <FiChevronDown className="dashboard-user-chevron" />
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="dashboard-page-body">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;