import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../components/DashboardShell";
import { useAuth } from "../context/useAuth";
import {
  FiChevronDown,
  FiPhone,
  FiMail,
  FiCamera,
  FiUpload,
} from "react-icons/fi";
import "../styles/profile-pages.css";

export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Dehmani",
    lastName: user?.lastName || "Mohamed",
    age: user?.age || "32",
    gender: user?.gender || "Male",
    phone: user?.phone || "+213 555 12 34 56",
    email: user?.email || "dehmani.mohamed@gmail.com",
    patientId: user?.patientId || "9876543210",
    city: user?.city || "Algiers, Algeria",
    avatar: user?.avatar || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    console.log("Save patient profile:", formData);
    // TODO: Implement actual save logic
    alert("Profile saved successfully!");
  }

  function handleDiscard() {
    setFormData({
      firstName: user?.firstName || "Dehmani",
      lastName: user?.lastName || "Mohamed",
      age: user?.age || "32",
      gender: user?.gender || "Male",
      phone: user?.phone || "+213 555 12 34 56",
      email: user?.email || "dehmani.mohamed@gmail.com",
      patientId: user?.patientId || "9876543210",
      city: user?.city || "Algiers, Algeria",
      avatar: user?.avatar || "",
    });
    alert("Changes discarded!");
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
    <DashboardShell title="Patient Profile" description="Profile">
      <div className="patient-profile-page">
        <div className="patient-profile-grid">
          <aside className="patient-profile-side-card">
            <div className="patient-profile-side-top">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Patient"
                  className="patient-profile-avatar"
                />
              ) : (
                <div className="patient-profile-avatar-fallback">
                  {formData.firstName?.[0]}
                </div>
              )}

              <h2 className="patient-profile-name">
                {formData.firstName}
                <br />
                {formData.lastName}
              </h2>

              <p className="patient-profile-location">{formData.city}</p>

              <button type="button" className="edit-photo-btn" onClick={handleEditPhoto}>
                <FiCamera />
                Edit Photo
              </button>
            </div>

            <div className="patient-profile-side-decor" />
          </aside>

          <section className="patient-profile-main-card">
            <div className="patient-profile-header">
              <h2>Personal Information</h2>
              <p>Manage your basic details and medical information.</p>
            </div>

            <div className="patient-profile-divider" />

            <div className="patient-profile-section">
              <h3>Personal Information</h3>

              <div className="patient-profile-form-grid">
                <div className="patient-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="patient-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="patient-field select-field">
                  <label>Age</label>
                  <select
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  >
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>

                <div className="patient-field select-field">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>
              </div>

              <div className="patient-contact-block">
                <label className="block-label">Contact Information</label>

                <div className="patient-contact-grid">
                  <div className="patient-field icon-input-field">
                    <span className="input-icon-left">
                      <FiPhone />
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="patient-field icon-input-field">
                    <span className="input-icon-left">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="patient-profile-section">
              <h3>Medical ID / Patient Number</h3>

              <div className="patient-field single-field">
                <label>Medical ID / Patient Number</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                />
              </div>

              <div className="upload-block">
                <label>Latest Imaging Results</label>
                <button type="button" className="upload-btn">
                  <FiUpload />
                  Upload Document
                </button>
              </div>
            </div>

            <div className="patient-profile-footer-actions">
              <button
                type="button"
                className="auth-settings-btn"
                onClick={() => navigate("/settings")}
              >
                Edit authentication info
              </button>

              <button
                type="button"
                className="discard-btn"
                onClick={handleDiscard}
              >
                Discard Changes
              </button>

              <button
                type="button"
                className="save-btn"
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