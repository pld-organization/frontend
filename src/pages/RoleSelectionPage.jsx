import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoSahtekonline.png";
import patientImage from "../assets/patient-card.png";
import doctorImage from "../assets/doctor-card.jpg";

function RoleSelectionPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("doctor");

  const registerPath =
    selectedRole === "patient" ? "/register/patient" : "/register/doctor";

  return (
    <div className="role-page">
      <div className="role-wrapper">
        <div className="role-logo">
          <img src={logo} alt="Sahtek Online Logo" className="role-logo-image" />
        </div>

        <h1 className="role-title">Welcome to Sahtek Online web site</h1>
        <p className="role-subtitle">Select your role to continue</p>

        <div className="role-cards">
          <div
            className={`role-card patient-card${
              selectedRole === "patient" ? " active" : ""
            }`}
            onClick={() => setSelectedRole("patient")}
          >
            <div className="role-card-image-wrap">
              <img src={patientImage} alt="Patient" className="role-card-image" />
            </div>
            <h2 className="role-card-title">I&apos;m a Patient</h2>
          </div>

          <div
            className={`role-card doctor-card${
              selectedRole === "doctor" ? " active" : ""
            }`}
            onClick={() => setSelectedRole("doctor")}
          >
            <div className="role-card-image-wrap">
              <img src={doctorImage} alt="Doctor" className="role-card-image" />
            </div>
            <h2 className="role-card-title">I&apos;m a Doctor</h2>
          </div>
        </div>

        <p className="role-login-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <button
          className="role-register-btn"
          onClick={() => navigate(registerPath)}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
