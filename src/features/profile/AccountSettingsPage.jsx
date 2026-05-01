import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../hooks/useAuth";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLock,
  FiEye,
  FiChevronDown,
  FiSave,
} from "react-icons/fi";
import { BsGenderAmbiguous } from "react-icons/bs";
import "../../styles/account-settings.css";

const MotionSection = motion.section;

export default function AccountSettingsPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "Anes Cheikh",
    email: user?.email || "w@gmail.com",
    phone: user?.phone || "0698741235",
    birthDate: user?.birthDate || "",
    gender: user?.gender || "Male",
    username: user?.username || "anescheikh",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validate password confirmation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Save settings:", formData);
    alert("Account settings saved successfully!");
  }

  return (
    <DashboardShell
      title="Account Settings"
      description="Dashboard  ›  Account Settings"
    >
      <div className="account-settings-page-fit">
        <MotionSection
          className="account-settings-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="account-settings-header">
            <div className="account-settings-title-wrap">
              <div className="account-settings-icon-box">
                <FiSettings />
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Update your personal information and manage your account</p>
              </div>
            </div>
          </div>

          <form className="account-settings-form" onSubmit={handleSubmit}>
            <div className="account-settings-grid">
              <div className="field-group">
                <label>Full Name</label>
                <div className="input-wrap">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label>Email Address</label>
                  <span className="readonly-badge">Read only</span>
                </div>
                <div className="input-wrap readonly">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Phone Number</label>
                <div className="input-wrap">
                  <FiPhone className="input-icon" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="field-group empty-desktop-space" />

              <div className="field-group">
                <label>Birth Date</label>
                <div className="input-wrap">
                  <FiCalendar className="input-icon" />
                  <input
                    type="text"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Gender</label>
                <div className="input-wrap select-wrap">
                  <BsGenderAmbiguous className="input-icon" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <FiChevronDown className="select-chevron" />
                </div>
              </div>
            </div>

            <div className="login-section">
              <h4>Login Information</h4>
              <div className="account-settings-grid">
                <div className="field-group">
                  <label>Username</label>
                  <div className="input-wrap">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="field-group empty-desktop-space" />
              </div>
            </div>

            <div className="password-section">
              <h4>Change Password</h4>
              <div className="account-settings-grid">
                <div className="field-group">
                  <label>New Password</label>
                  <div className="input-wrap password-wrap">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      aria-label="Show password"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label>Confirm Password</label>
                  <div className="input-wrap password-wrap">
                    <FiLock className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      aria-label="Show password"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FiSave />
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setFormData({
                    fullName: user?.name || "Anes Cheikh",
                    email: user?.email || "w@gmail.com",
                    phone: user?.phone || "0698741235",
                    birthDate: user?.birthDate || "",
                    gender: user?.gender || "Male",
                    username: user?.username || "anescheikh",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </MotionSection>

        <footer className="account-settings-footer">
          <span>© 2024 MediCare. All rights reserved.</span>

          <div className="account-settings-footer-links">
            <a href="/">Privacy Policy</a>
            <a href="/">Terms of Service</a>
            <a href="/">Help Center</a>
          </div>
        </footer>
      </div>
    </DashboardShell>
  );
}
