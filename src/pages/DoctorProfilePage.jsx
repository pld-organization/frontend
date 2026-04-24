import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { useAuth } from "../context/useAuth";
import {
  FiChevronDown,
  FiPhone,
  FiCamera,
  FiShield,
} from "react-icons/fi";
import "../styles/doctor-profile.css";

function createInitialFormData(user) {
  return {
    firstName: user?.firstName || "Karim",
    lastName: user?.lastName || "Bentahar",
    birthDate: user?.birthDate || "15 / 04 / 1980",
    specialty: user?.specialty || "Internal Medicine",
    countryCode: user?.countryCode || "+213",
    phone: user?.phone || "+213 555 67 89 10",
    serialNumber: user?.serialNumber || "+213",
    clinic: user?.clinic || "Hopital Central",
    moreDetails: user?.moreDetails || "",
    city: user?.city || "Internal Medicine",
    avatar: user?.avatar || "",
  };
}

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(() => createInitialFormData(user));

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    console.log("Doctor profile saved:", formData);
    alert("Doctor profile saved successfully!");
  }

  function handleEditAuth() {
    navigate("/settings");
  }

  function handleDiscard() {
    setFormData(createInitialFormData(user));
  }

  function handleEditPhoto() {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({
            ...prev,
            avatar: event.target.result
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  return (
    <DashboardShell title="Doctor Profile" description="Profile">
      <div className="doctor-profile-page">
        <div className="doctor-profile-grid">
          <aside className="doctor-profile-side-card">
            <div className="doctor-profile-side-top">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Doctor"
                  className="doctor-profile-avatar"
                />
              ) : (
                <div className="doctor-profile-avatar-fallback">
                  {formData.firstName?.[0]}
                </div>
              )}

              <h2 className="doctor-profile-name">
                Dr. {formData.firstName}
                <br />
                {formData.lastName}
              </h2>

              <p className="doctor-profile-specialty">{formData.city}</p>

              <button type="button" className="doctor-edit-photo-btn" onClick={handleEditPhoto}>
                <FiCamera />
                Edit Photo
              </button>
            </div>

            <div className="doctor-profile-side-decor" />
          </aside>

          <section className="doctor-profile-main-card">
            <div className="doctor-profile-header">
              <h2>Personal Information</h2>
              <p>
                Manage your professional details and authentication
                information.
              </p>
            </div>

            <div className="doctor-profile-divider" />

            <div className="doctor-profile-section">
              <h3>Personal Information</h3>

              <div className="doctor-profile-form-grid">
                <div className="doctor-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-field select-field">
                  <label>Age</label>
                  <select
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  >
                    <option value="15 / 04 / 1980">15 / 04 / 1980</option>
                    <option value="08 / 06 / 1985">08 / 06 / 1985</option>
                    <option value="20 / 12 / 1990">20 / 12 / 1990</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>

                <div className="doctor-field select-field">
                  <label>Specialty</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                  >
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>

              <div className="doctor-serial-block">
                <label className="block-label">Serial Number</label>

                <div className="doctor-serial-row">
                  <div className="doctor-serial-left">
                    <span className="serial-icon">
                      <FiPhone />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="doctor-serial-middle">
                    <span className="serial-middle-icon">
                      <FiShield />
                    </span>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="doctor-serial-right">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="doctor-field single-field clinic-field">
                <label>Hospital / Clinic</label>
                <input
                  type="text"
                  name="clinic"
                  value={formData.clinic}
                  onChange={handleChange}
                />
              </div>

              <button type="button" className="doctor-login-btn" onClick={handleEditAuth}>
                <FiShield />
                Edit Login & Password
              </button>

              <div className="doctor-profile-divider inside-divider" />

              <div className="doctor-field single-field">
                <label>More Details (Optional)</label>
                <input
                  type="text"
                  name="moreDetails"
                  value={formData.moreDetails}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="doctor-profile-footer-actions">
              <button
                type="button"
                className="doctor-discard-btn"
                onClick={handleDiscard}
              >
                Discard Changes
              </button>

              <button
                type="button"
                className="doctor-save-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
