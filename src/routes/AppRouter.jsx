import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import DashboardRedirectPage from "../pages/DashboardRedirectPage";
import DoctorDashboardPage from "../pages/DoctorDashboardPage";
import LoginPage from "../pages/LoginPage";
import PatientDashboardPage from "../pages/PatientDashboardPage";
import RegisterPageDoctor from "../pages/RegisterPageDoctor";
import RegisterPagePatient from "../pages/RegisterPagePatient";
import RoleSelectionPage from "../pages/RoleSelectionPage";

function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register/doctor"
        element={
          <PublicOnlyRoute>
            <RegisterPageDoctor />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register/patient"
        element={
          <PublicOnlyRoute>
            <RegisterPagePatient />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/roleSelection"
        element={
          <PublicOnlyRoute>
            <RoleSelectionPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardRedirectPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientDashboardPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
