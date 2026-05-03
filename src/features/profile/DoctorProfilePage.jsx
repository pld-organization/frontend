import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "./data/profileService";
import {
  FiChevronDown,
  FiPhone,
  FiCamera,
  FiShield,
  FiBriefcase,
  FiMapPin,
  FiAward,
} from "react-icons/fi";
import "../../styles/doctor-profile.css";

function createInitialFormData(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    birthDate: user?.birthDate || user?.dateOfBirth || "",
    specialty: user?.specialty || user?.speciality || "",
    phone: user?.phone || user?.phoneNumber || "",
    licenseNumber: user?.licenseNumber || "",
    clinic: user?.clinic || user?.establishment || "",
    city: user?.city || user?.address || "",
    moreDetails: user?.moreDetails || user?.bio || "",
    avatar: user?.avatar || "",
  };
}

function mapDoctorProfile(data, fallbackUser) {
  return {
    firstName: data?.firstName || fallbackUser?.firstName || "",
    lastName: data?.lastName || fallbackUser?.lastName || "",
    birthDate:
      data?.birthDate ||
      data?.dateOfBirth ||
      fallbackUser?.birthDate ||
      fallbackUser?.dateOfBirth ||
      "",
    specialty:
      data?.specialty ||
      data?.speciality ||
      fallbackUser?.specialty ||
      fallbackUser?.speciality ||
      "",
    phone:
      data?.phone ||
      data?.phoneNumber ||
      fallbackUser?.phone ||
      fallbackUser?.phoneNumber ||
      "",
    licenseNumber: data?.licenseNumber || fallbackUser?.licenseNumber || "",
    clinic:
      data?.clinic ||
      data?.establishment ||
      fallbackUser?.clinic ||
      fallbackUser?.establishment ||
      "",
    city:
      data?.city ||
      data?.address ||
      fallbackUser?.city ||
      fallbackUser?.address ||
      "",
    moreDetails:
      data?.moreDetails ||
      data?.bio ||
      fallbackUser?.moreDetails ||
      fallbackUser?.bio ||
      "",
    avatar: data?.avatar || fallbackUser?.avatar || "",
  };
}

export default function DoctorProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState(() => createInitialFormData(user));
  const [originalData, setOriginalData] = useState(() =>
    createInitialFormData(user)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const data = await profileService.getProfile();
        const mappedProfile = mapDoctorProfile(data, user);

        if (isMounted) {
          setFormData(mappedProfile);
          setOriginalData(mappedProfile);
        }
      } catch (err) {
        console.error("Load doctor profile error:", err);

        if (isMounted) {
          const fallbackProfile = createInitialFormData(user);
          setFormData(fallbackProfile);
          setOriginalData(fallbackProfile);
          setError("Impossible de charger le profil docteur.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        dateOfBirth: formData.birthDate,
        phoneNumber: formData.phone?.trim(),
        speciality: formData.specialty?.trim(),
        establishment: formData.clinic?.trim(),
        city: formData.city?.trim(),
        licenseNumber: formData.licenseNumber?.trim(),
        bio: formData.moreDetails?.trim(),
        avatar: formData.avatar,
      };

      const updatedProfile = await profileService.completeProfile(payload);
      const mappedProfile = mapDoctorProfile(updatedProfile, {
        ...user,
        ...formData,
      });

      setFormData(mappedProfile);
      setOriginalData(mappedProfile);
      setSuccess("Profil docteur enregistré avec succès.");
    } catch (err) {
      console.error("Save doctor profile error:", err);
      setError("Erreur lors de l’enregistrement du profil docteur.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditAuth() {
    navigate("/settings");
  }

  function handleDiscard() {
    setFormData(originalData);
    setError("");
    setSuccess("");
  }

  function handleEditPhoto() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardShell title="Doctor Profile" description="Dashboard > Profile">
      <motion.div
        className="doctor-profile-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading && (
          <div className="profile-status-message">
            Chargement du profil...
          </div>
        )}

        {error && (
          <div className="profile-status-message profile-status-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-status-message profile-status-success">
            {success}
          </div>
        )}

        <div className="doctor-profile-header-main">
          <h2>Profile Settings</h2>
          <p>Update your personal information and professional details.</p>
        </div>

        <div className="doctor-profile-grid">
          <motion.aside
            className="doctor-profile-side-card"
            variants={itemVariants}
          >
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
                    {formData.firstName?.[0] || "D"}
                  </div>
                )}

                <button
                  type="button"
                  className="doctor-edit-photo-btn"
                  onClick={handleEditPhoto}
                  title="Update Photo"
                  disabled={saving}
                >
                  <FiCamera />
                </button>
              </div>

              <h2 className="doctor-profile-name">
                Dr. {formData.firstName || "Doctor"} {formData.lastName || ""}
              </h2>

              <p className="doctor-profile-specialty">
                {formData.specialty || "Specialty not provided"}
              </p>

              <div className="doctor-profile-badges">
                <span className="badge">
                  <FiMapPin /> {formData.city || "City not provided"}
                </span>

                <span className="badge">
                  <FiBriefcase /> {formData.clinic || "Clinic not provided"}
                </span>
              </div>
            </div>

            <div className="doctor-profile-side-bottom">
              <div className="profile-completion">
                <div className="completion-text">
                  <span>Profile Completion</span>
                  <span>90%</span>
                </div>

                <div className="completion-bar">
                  <div
                    className="completion-fill"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>
            </div>
          </motion.aside>

          <motion.section
            className="doctor-profile-main-card"
            variants={itemVariants}
          >
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
                    disabled={saving}
                  />
                </div>

                <div className="doctor-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <div className="doctor-field">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={saving}
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
                      disabled={saving}
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
                    disabled={saving}
                  >
                    <option value="">Select specialty</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
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
                      disabled={saving}
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
                      disabled={saving}
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
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <div className="doctor-field single-field" style={{ marginTop: "24px" }}>
                <label>Professional Bio</label>
                <textarea
                  name="moreDetails"
                  value={formData.moreDetails}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us a bit about your background, experience, and approach to patient care..."
                  disabled={saving}
                />
              </div>
            </div>

            <div className="doctor-profile-divider" />

            <div className="doctor-profile-section auth-section">
              <div className="auth-text">
                <h3>Authentication</h3>
                <p>Manage your account password and security settings.</p>
              </div>

              <button
                type="button"
                className="doctor-login-btn"
                onClick={handleEditAuth}
                disabled={saving}
              >
                <FiShield />
                Security Settings
              </button>
            </div>

            <div className="doctor-profile-footer-actions">
              <button
                type="button"
                className="doctor-discard-btn"
                onClick={handleDiscard}
                disabled={saving}
              >
                Discard Changes
              </button>

              <button
                type="button"
                className="doctor-save-btn"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </DashboardShell>
  );
}