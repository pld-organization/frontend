import { useState, useEffect } from "react";

import AppointmentCard from "./AppointmentCard";
import Spinner from "../../components/shared/Spinner";
import EmptyState from "../../components/shared/EmptyState";
import ConfirmModal from "../../components/shared/ConfirmModal";
import { getPatientAppointments, cancelAppointment } from "./data/appointmentService";
import { FiCalendar } from "react-icons/fi";
import "../../styles/patient-schedule.css";

export default function PatientSchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const data = await getPatientAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setError(null);
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
      // Update local state to reflect cancellation
      setAppointments(prev => 
        prev.map(app => 
          app.id === selectedAppointmentId 
            ? { ...app, status: "Cancelled" } 
            : app
        )
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
    <>
      <div className="patient-schedule-page">
        {loading ? (
          <Spinner message="Loading your appointments..." />
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchAppointments}>Retry</button>
          </div>
        ) : appointments.length === 0 ? (
          <EmptyState 
            icon={<FiCalendar size={48} />}
            title="No appointments yet"
            description="You don't have any upcoming appointments scheduled."
            action={<button className="btn btn-primary">Book an Appointment</button>}
          />
        ) : (
          <div className="appointments-grid">
            {appointments.map(app => (
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
    </>
  );
}
