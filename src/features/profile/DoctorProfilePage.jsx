import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../hooks/useAuth";
import {
  FiChevronDown,
  FiPhone,
  FiCamera,
  FiShield,
  FiBriefcase,
  FiMapPin,
  FiAward
} from "react-icons/fi";
import "../../styles/doctor-profile.css";

void motion;

function createInitialFormData(user) {
  return {
    firstName: user?.firstName || "Karim",
    lastName: user?.lastName || "Bentahar",
    birthDate: user?.birthDate || "1980-04-15",
    specialty: user?.specialty || "Internal Medicine",
    phone: user?.phone || "+213 555 67 89 10",
    licenseNumber: user?.licenseNumber || "MED-2384-DZ",
    clinic: user?.clinic || "Hopital Central d'Alger",
    city: user?.city || "Algiers, Algeria",
    moreDetails: user?.moreDetails || "Dedicated internal medicine specialist with over 15 years of experience.",
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
    if(window.confirm("Are you sure you want to discard your changes?")) {
      setFormData(createInitialFormData(user));
    }
  }

  function handleEditPhoto() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <DashboardShell title="Doctor Profile" description="Dashboard > Profile">
      <motion.div 
        className="doctor-profile-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="doctor-profile-header-main">
          <h2>Profile Settings</h2>
          <p>Update your personal information and professional details.</p>
        </div>

        <div className="doctor-profile-grid">
          {/* LEFT SIDE: Avatar & Quick Info */}
          <motion.aside className="doctor-profile-side-card" variants={itemVariants}>
            <div className="doctor-profile-side-top">
              <div className="avatar-wrapper">
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
                <button type="button" className="doctor-edit-photo-btn" onClick={handleEditPhoto} title="Update Photo">
                  <FiCamera />
                </button>
              </div>

              <h2 className="doctor-profile-name">
                Dr. {formData.firstName} {formData.lastName}
              </h2>
              <p className="doctor-profile-specialty">{formData.specialty}</p>
              
              <div className="doctor-profile-badges">
                <span className="badge"><FiMapPin /> {formData.city}</span>
                <span className="badge"><FiBriefcase /> {formData.clinic}</span>
              </div>
            </div>
            
            <div className="doctor-profile-side-bottom">
              <div className="profile-completion">
                <div className="completion-text">
                  <span>Profile Completion</span>
                  <span>90%</span>
                </div>
                <div className="completion-bar"><div className="completion-fill" style={{width: '90%'}}></div></div>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT SIDE: Edit Form */}
          <motion.section className="doctor-profile-main-card" variants={itemVariants}>
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

                <div className="doctor-field">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="doctor-field">
                  <label>Phone Number</label>
                  <div className="input-with-icon">
                    <FiPhone className="field-icon" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="doctor-profile-divider" />

            <div className="doctor-profile-section">
              <h3>Professional Details</h3>
              <div className="doctor-profile-form-grid">
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
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                  <FiChevronDown className="select-icon" />
                </div>

                <div className="doctor-field">
                  <label>Medical License Number</label>
                  <div className="input-with-icon">
                    <FiAward className="field-icon" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="doctor-field">
                  <label>Hospital / Clinic</label>
                  <div className="input-with-icon">
                    <FiBriefcase className="field-icon" />
                    <input
                      type="text"
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="doctor-field">
                  <label>City & Country</label>
                  <div className="input-with-icon">
                    <FiMapPin className="field-icon" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="doctor-field single-field" style={{marginTop: '24px'}}>
                <label>Professional Bio (Optional)</label>
                <textarea
                  name="moreDetails"
                  value={formData.moreDetails}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us a bit about your background, experience, and approach to patient care..."
                />
              </div>
            </div>

            <div className="doctor-profile-divider" />

            <div className="doctor-profile-section auth-section">
              <div className="auth-text">
                <h3>Authentication</h3>
                <p>Manage your account password and security settings.</p>
              </div>
              <button type="button" className="doctor-login-btn" onClick={handleEditAuth}>
                <FiShield />
                Security Settings
              </button>
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
                Save Profile
              </button>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
