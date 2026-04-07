import { useState } from "react";
import "../styles/auth.css";
import logo from "../assets/logoSahtekonline.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  getApiErrorMessage,
  getRoleDashboardPath,
  isValidEmail,
} from "../utils/authHelpers";

const initialFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  bloodType: "",
  password: "",
  confirmPassword: "",
};

function RegisterPagePatient() {
  const navigate = useNavigate();
  const { registerPatient } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function validateForm() {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.gender ||
      !formData.phoneNumber.trim() ||
      !formData.bloodType ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all required patient fields.";
    }

    if (!isValidEmail(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password confirmation does not match.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const session = await registerPatient(formData);
      navigate(getRoleDashboardPath(session?.user?.role), { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to create the patient account."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="patient-register-page">
      <div className="patient-register-container">
        <div className="patient-register-left"></div>

        <div className="patient-register-right">
          <div className="patient-register-logo">
            <img
              src={logo}
              alt="Sahtek Online Logo"
              className="patient-register-logo-image"
            />
          </div>

          <h1 className="patient-register-title">Create Your Account</h1>

          <form className="patient-register-form" onSubmit={handleSubmit}>
            <div className="patient-register-grid">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              <div className="patient-register-select-wrap">
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                <span className="patient-select-arrow">&gt;</span>
              </div>
              <div className="patient-phone-input">
                <div className="patient-phone-prefix">
                  <span className="patient-flag">DZ</span>
                  <span className="patient-code">+213</span>
                </div>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="0555123456"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="patient-register-select-wrap">
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select blood type
                  </option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <span className="patient-select-arrow">&gt;</span>
              </div>

              <input
                className="patient-register-field--full"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {formError ? (
              <p className="form-message form-message--error">{formError}</p>
            ) : null}

            <div className="patient-register-actions">
              <button
                type="submit"
                className="patient-register-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                className="patient-google-btn"
                disabled={isSubmitting}
              >
                <span className="patient-google-icon">
                  <FcGoogle />
                </span>
                <span>Google</span>
              </button>
            </div>
          </form>

          <div className="patient-register-footer">
            <p className="patient-register-login-text">
              Already have an account? <Link to="/login">Log In</Link>
            </p>

            <div className="patient-register-socials">
              <span><FaFacebookF /></span>
              <span><FaTwitter /></span>
              <span><FaLinkedinIn /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPagePatient;
