import { FiCalendar, FiClock, FiVideo, FiMapPin, FiX } from "react-icons/fi";

function canJoinAppointment(dayOfWeek, startTime, windowMins = 5) {
  if (!dayOfWeek || !startTime) return false;

  const now = new Date();
  const DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

  const todayIndex = now.getDay();
  const apptIndex  = DAYS.indexOf(dayOfWeek.toUpperCase());
  if (apptIndex === -1 || apptIndex !== todayIndex) return false;

  const [hours, minutes] = startTime.split(":").map(Number);
  const apptStart   = new Date(now);
  apptStart.setHours(hours, minutes, 0, 0);

  const windowStart = new Date(apptStart.getTime() - windowMins * 60_000);
  const windowEnd   = new Date(apptStart.getTime() + 60 * 60_000);

  return now >= windowStart && now <= windowEnd;
}

export default function AppointmentCard({ appointment, onCancel, onJoin }) {
  const { id, doctor, date, time, type, status, reason, meetingUrl } = appointment;
  const isOnline  = type?.toLowerCase() === "online";
  const isActive  = status?.toLowerCase() === "confirmed" || status?.toLowerCase() === "pending";
  const joinable  = isOnline && meetingUrl && isActive && canJoinAppointment(date, time);

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
        {isOnline && meetingUrl && isActive && (
          <button
            className="btn btn-primary"
            disabled={!joinable}
            onClick={() => onJoin(meetingUrl)}
            title={!joinable ? "Available only at your appointment time" : "Join meeting"}
            style={{ opacity: joinable ? 1 : 0.45, cursor: joinable ? "pointer" : "not-allowed" }}
          >
            <FiVideo /> {joinable ? "Join Meeting" : "Join (Not yet)"}
          </button>
        )}

        {isActive && (
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