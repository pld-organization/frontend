import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import userApi from "../../features/consultations/data/userApi";
import { useState, useEffect } from "react";
export function PageHeader({ title, description }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error("[PageHeader] Profile fetch failed", err);
      }
    };
    fetchProfile();
  }, []);
  const role = (user?.role || "patient").toLowerCase();
  const isDoctor = role.includes("doctor");

  const userInitial = profileData 
  ? profileData.firstName?.[0]?.toUpperCase() 
  : user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "A";

  const userName = profileData 
    ? `${profileData.firstName} ${profileData.lastName}` 
    : user?.name || (isDoctor ? "Dr Dehmani" : "Dehmani Mohamed");

  const userSubtitle = isDoctor 
    ? profileData?.doctor?.speciality || profileData?.speciality || user?.speciality || "Médecin" 
    : "Patient";

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
