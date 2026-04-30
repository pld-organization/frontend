import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import DashboardRedirectPage from "../pages/DashboardRedirectPage";
import DoctorOverviewPage from "../pages/DoctorOverviewPage";
import LoginPage from "../pages/LoginPage";
import PatientDashboardPage from "../pages/PatientDashboardPage";
import RegisterPageDoctor from "../pages/RegisterPageDoctor";
import RegisterPagePatient from "../pages/RegisterPagePatient";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import AccountSettingsPage from "../pages/AccountSettingsPage";
import PatientOverviewPage from "../pages/PatientOverviewPage";
import PatientProfilePage from "../pages/PatientProfilePage";
import DoctorProfilePage from "../pages/DoctorProfilePage";
import DoctorAppointmentsPage from "../pages/DoctorAppointmentsPage";
import PatientAppointmentsPage from "../pages/PatientAppointmentsPage";
import PatientConsultationPage from "../pages/PatientConsultationPage";
import PatientConsultationDetailPage from "../pages/PatientConsultationDetailPage";
import PatientAnalysisPage from "../pages/PatientAnalysisPage";
import DoctorConsultationPage from "../pages/DoctorConsultationPage";
import DoctorPatientsPage from "../pages/DoctorPatientsPage";
import DoctorSchedulePage from "../pages/DoctorSchedulePage";
import DoctorSetAvailabilityPage from "../pages/DoctorSetAvailabilityPage";
import HelpPage from "../pages/HelpPage";
function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <RoleSelectionPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
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
            <DoctorOverviewPage />
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

      <Route
        path="/patient/profile"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/consultation"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientConsultationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/consultation"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorConsultationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/consultation/:consultationId"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientConsultationDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientAnalysisPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorAppointmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/patient-dashboard"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientOverviewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AccountSettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor-appointments"
        element={
          <PrivateRoute>
            <DoctorAppointmentsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <PatientAppointmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <DoctorPatientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/availability"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorSchedulePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/set-availability"
        element={
          <PrivateRoute allowedRoles={["DOCTOR"]}>
            <DoctorSetAvailabilityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/help"
        element={
          <PrivateRoute>
            <HelpPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
