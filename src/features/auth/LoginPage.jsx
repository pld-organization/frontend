import { useState } from "react";
import logo from "../../assets/logoSahtekonline.png";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getApiErrorMessage,
  getRoleDashboardPath,
} from "../../utils/authHelpers";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setFormError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const session = await login(formData);
      navigate(getRoleDashboardPath(session?.user?.role), { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Unable to log in. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left"></div>

        <div className="login-right">
          <div className="login-logo">
            <img src={logo} alt="Sahtek Online Logo" className="logo-image" />
          </div>

          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Log in to your account to continue</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-box has-left-icon">
              <span className="input-icon left">
                <MdEmail />
              </span>
              <input
                name="email"
                type="email"
                placeholder="awesome@user.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="input-box has-both-icons">
              <span className="input-icon left">
                <MdLock />
              </span>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********************"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </button>
            </div>

            {formError ? (
              <p className="form-message form-message--error">{formError}</p>
            ) : null}

            <div className="forgot-row">
              <span>Forgot Your Password?</span>
            </div>

            <button type="button" className="google-btn" disabled={isSubmitting}>
              <span className="google-icon">
                <FcGoogle />
              </span>
              <span className="google-text">Continue with Google</span>
            </button>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="signup-text">
            Don&apos;t Have An Account? <Link to="/">Sign Up!</Link>
          </p>

          <div className="social-icons">
            <span><FaFacebookF /></span>
            <span><FaTwitter /></span>
            <span><FaLinkedinIn /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
