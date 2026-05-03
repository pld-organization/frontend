import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import DashboardRedirectPage from "../pages/DashboardRedirectPage";
import DoctorOverviewPage from "../features/dashboard/doctor/DoctorOverviewPage";
import LoginPage from "../features/auth/LoginPage";
import PatientDashboardPage from "../features/dashboard/patient/PatientDashboardPage";
import RegisterDoctorPage from "../features/auth/RegisterDoctorPage";
import RegisterPatientPage from "../features/auth/RegisterPatientPage";
import RoleSelectionPage from "../features/auth/RoleSelectionPage";
import AccountSettingsPage from "../features/profile/AccountSettingsPage";
import PatientOverviewPage from "../features/dashboard/patient/PatientOverviewPage";
import PatientProfilePage from "../features/profile/PatientProfilePage";
import DoctorProfilePage from "../features/profile/DoctorProfilePage";
import DoctorAppointmentsPage from "../features/appointments/DoctorAppointmentsPage";
import PatientAppointmentsPage from "../features/appointments/PatientAppointmentsPage";
import ConsultationListPage from "../features/consultations/ConsultationListPage";
import ConsultationDetailsPage from "../features/consultations/ConsultationDetailsPage";
import AIResultsDashboard from "../features/analysis/mainai";
import MedicalAnalysisDashboard1 from "../features/analysis/1Dai"
import MedicalAnalysisDashboard from "../features/analysis/2Dai"
import Analysis3D from "../features/analysis/3Dai"
import MedicalDashboard4 from "../features/analysis/mainresult"
import DoctorConsultationPage from "../features/consultations/DoctorConsultationPage";
import DoctorPatientsPage from "../features/consultations/DoctorPatientsPage";
import DoctorSchedulePage from "../features/appointments/DoctorSchedulePage";
import DoctorSetAvailabilityPage from "../features/appointments/DoctorSetAvailabilityPage";
import HelpPage from "../pages/HelpPage";
import PatientSchedulePage from "../features/appointments/PatientSchedulePage";
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
            <RegisterDoctorPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register/patient"
        element={
          <PublicOnlyRoute>
            <RegisterPatientPage />
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
        path="/doctor/overview"
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
            <ConsultationListPage />
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
            <ConsultationDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <AIResultsDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis/1Danalysis"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <MedicalAnalysisDashboard1 />
          </PrivateRoute>
        }
      />
      <Route
        path="/analysis/2Danalysis"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <MedicalAnalysisDashboard />
          </PrivateRoute>
        }
      />
 
      <Route
        path="/analysis/3Danalysis"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <Analysis3D />
          </PrivateRoute>
        }
      />


      
      <Route
        path="/analysis/models"
        element={
          <PrivateRoute allowedRoles={["PATIENT"]}>
            <MedicalDashboard4 />
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
       path="/schedule"
       element={
         <PrivateRoute allowedRoles={["PATIENT"]}>
           <PatientSchedulePage />
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