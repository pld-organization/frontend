import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

export function PageHeader({ title, description }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = (user?.role || "patient").toLowerCase();
  const isDoctor = role.includes("doctor");

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A";
  const userName = user?.name || (isDoctor ? "Dr Dehmani" : "Dehmani Mohamed");
  const userSubtitle = isDoctor ? user?.speciality || "Urologist" : "Patient";

  function handleUserClick() {
    if (isDoctor) {
      navigate("/doctor/profile");
    } else {
      navigate("/patient/profile");
    }
  }

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-heading-inline">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
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
  );
}

export default PageHeader;
