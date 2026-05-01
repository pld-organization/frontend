import { FiCalendar, FiClock, FiVideo, FiMapPin, FiX } from "react-icons/fi";

export default function AppointmentCard({ appointment, onCancel }) {
  const { id, doctor, date, time, type, status, reason } = appointment;
  const isOnline = type?.toLowerCase() === "online";
  
  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div className="appointment-doctor-info">
          <h4>Dr. {doctor?.firstName} {doctor?.lastName}</h4>
          <span className="speciality">{doctor?.speciality}</span>
        </div>
        <span className={`status-badge status-${status?.toLowerCase()}`}>
          {status}
        </span>
      </div>
      
      <div className="appointment-details">
        <div className="detail-item">
          <FiCalendar /> <span>{date}</span>
        </div>
        <div className="detail-item">
          <FiClock /> <span>{time}</span>
        </div>
        <div className="detail-item">
          {isOnline ? <FiVideo /> : <FiMapPin />} 
          <span>{isOnline ? "Online Consultation" : "In-person"}</span>
        </div>
        {reason && (
          <div className="detail-item reason">
            <strong>Motif: </strong> <span>{reason}</span>
          </div>
        )}
      </div>

      <div className="appointment-actions">
        {(status?.toLowerCase() === "pending" || status?.toLowerCase() === "confirmed") && (
          <button 
            className="btn btn-outline-danger" 
            onClick={() => onCancel(id)}
          >
            <FiX /> Cancel Appointment
          </button>
        )}
      </div>
    </div>
  );
}
