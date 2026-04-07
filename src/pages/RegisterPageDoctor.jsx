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
  speciality: "",
  serialNumber: "",
  phoneNumber: "",
  establishment: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterPageDoctor() {
  const navigate = useNavigate();
  const { registerDoctor } = useAuth();
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
      !formData.speciality.trim() ||
      !formData.establishment.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return "Please fill in all required doctor fields.";
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
      const session = await registerDoctor(formData);
      navigate(getRoleDashboardPath(session?.user?.role), { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to create the doctor account."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="doctor-register-page">
      <div className="doctor-register-container">
        <div className="doctor-register-left"></div>

        <div className="doctor-register-right">
          <div className="doctor-register-logo">
            <img
              src={logo}
              alt="Sahtek Online Logo"
              className="doctor-register-logo-image"
            />
          </div>

          <h1 className="doctor-register-title">Create Your Account</h1>

          <form className="doctor-register-form" onSubmit={handleSubmit}>
            <div className="doctor-register-grid">
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
              <input
                name="speciality"
                type="text"
                placeholder="Speciality"
                value={formData.speciality}
                onChange={handleChange}
              />
              <input
                name="serialNumber"
                type="text"
                placeholder="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
              />
              <div className="doctor-phone-input">
                <div className="doctor-phone-prefix">
                  <span className="doctor-flag">DZ</span>
                  <span className="doctor-code">+213</span>
                </div>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <input
                className="doctor-register-field--full"
                name="establishment"
                type="text"
                placeholder="Hospital / Clinic"
                value={formData.establishment}
                onChange={handleChange}
              />
              <input
                className="doctor-register-field--full"
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

            <div className="doctor-register-actions">
              <button
                type="submit"
                className="doctor-register-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                className="doctor-google-btn"
                disabled={isSubmitting}
              >
                <span className="doctor-google-icon">
                  <FcGoogle />
                </span>
                <span>Google</span>
              </button>
            </div>
          </form>

          <div className="doctor-register-footer">
            <p className="doctor-register-login-text">
              Already have an account? <Link to="/login">Log In</Link>
            </p>

            <div className="doctor-register-socials">
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

export default RegisterPageDoctor;
