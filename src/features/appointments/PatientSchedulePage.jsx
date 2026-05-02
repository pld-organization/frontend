import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import DashboardShell from "../../components/layout/DashboardShell";
import AppointmentCard from "./AppointmentCard";
import Spinner from "../../components/shared/Spinner";
import EmptyState from "../../components/shared/EmptyState";
import ConfirmModal from "../../components/shared/ConfirmModal";
import {
  getPatientAppointments,
  getReservationById,
  cancelAppointment,
} from "./data/appointmentService";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../lib/constants/api";
import AuthContextValue from "../../context/AuthContextValue";
import { FiCalendar } from "react-icons/fi";
import "../../styles/patient-schedule.css";

/**
 * Fetch doctor profile from the auth service.
 * Returns null silently on failure.
 */
async function fetchDoctorProfile(doctorId) {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.DOCTORS.BY_ID(doctorId));
    return data;
  } catch {
    return null;
  }
}

/**
 * Maps a fully-loaded Reservation (with schedule joined) + doctor profile
 * into the shape AppointmentCard expects.
 */
function mapReservation(r, doctorProfile) {
  return {
    id:     r.id,
    doctor: {
      firstName:  doctorProfile?.firstName  ?? "Unknown",
      lastName:   doctorProfile?.lastName   ?? "",
      speciality: doctorProfile?.speciality ?? "",
    },
    date:   r.schedule?.dayOfWeek  ?? "—",
    time:   r.schedule?.startTime  ?? "—",
    type:   r.schedule?.appointmenttype === "ONLINE" ? "online" : "in-person",
    status: r.reservationStatus ? "confirmed" : "cancelled",
    reason: r.reason ?? "",
  };
}

export default function PatientSchedulePage() {
  const { user } = useContext(AuthContextValue);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (user?.id) fetchAppointments();
  }, [user?.id]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError(null);

      // 1 — get reservation list (schedule is null here — backend doesn't join it)
      const list = await getPatientAppointments(user.id);
      if (!Array.isArray(list) || list.length === 0) {
        setAppointments([]);
        return;
      }

      // 2 — re-fetch each reservation by ID in parallel (this endpoint DOES join schedule)
      const fullReservations = await Promise.all(list.map((r) => getReservationById(r.id)));

      // 3 — fetch unique doctor profiles in parallel
      const uniqueDoctorIds = [...new Set(fullReservations.map((r) => r.doctorId).filter(Boolean))];
      const doctorProfiles  = await Promise.all(uniqueDoctorIds.map(fetchDoctorProfile));
      const doctorMap       = Object.fromEntries(uniqueDoctorIds.map((id, i) => [id, doctorProfiles[i]]));

      // 4 — map to AppointmentCard shape
      const mapped = fullReservations.map((r) => mapReservation(r, doctorMap[r.doctorId]));
      setAppointments(mapped);

    } catch {
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelClick(id) {
    setSelectedAppointmentId(id);
    setModalOpen(true);
  }

  async function handleConfirmCancel() {
    if (!selectedAppointmentId) return;
    try {
      setCancelLoading(true);
      await cancelAppointment(selectedAppointmentId);
      setAppointments((prev) =>
        prev.filter((app) => app.id !== selectedAppointmentId)
      );
      setModalOpen(false);
    } catch {
      alert("Failed to cancel appointment.");
    } finally {
      setCancelLoading(false);
      setSelectedAppointmentId(null);
    }
  }

  return (
    <DashboardShell title="My Schedule" description="Dashboard > Schedule">
      <div className="patient-schedule-page">
        {loading ? (
          <Spinner message="Loading your appointments..." />
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchAppointments}>
              Retry
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={<FiCalendar size={48} />}
            title="No appointments yet"
            description="You don't have any upcoming appointments scheduled."
            action={
              <button
                className="btn btn-primary"
                onClick={() => navigate("/appointments")}
              >
                Book an Appointment
              </button>
            }
          />
        ) : (
          <div className="appointments-grid">
            {appointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText={cancelLoading ? "Cancelling..." : "Yes, Cancel it"}
        cancelText="No, Keep it"
        isDanger={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => !cancelLoading && setModalOpen(false)}
      />
    </DashboardShell>
  );
}