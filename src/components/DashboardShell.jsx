import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

function DashboardShell({ title, description }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <span className="dashboard-badge">{user?.role}</span>
        <h1>{title}</h1>
        <p className="dashboard-description">{description}</p>

        <div className="dashboard-meta">
          <div className="dashboard-meta-item">
            <span className="dashboard-meta-label">Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="dashboard-meta-item">
            <span className="dashboard-meta-label">User ID</span>
            <strong>{user?.id}</strong>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardShell;
