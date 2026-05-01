import { useState } from "react";
import ReservationTypeSelector from "./ReservationTypeSelector";
import { FiUser, FiMapPin, FiBriefcase } from "react-icons/fi";

export default function DoctorCard({ doctor, onBook }) {
  const [isBooking, setIsBooking] = useState(false);
  
  // Reservation state
  const [selectedType, setSelectedType] = useState('consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookSubmit = async () => {
    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }
    
    setLoading(true);
    try {
      await onBook({
        doctorId: doctor.id,
        doctor: {
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          speciality: doctor.speciality
        },
        type: selectedType,
        date,
        time,
        reason
      });
      setIsBooking(false);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-card">
      <div className="doctor-card-content">
        <div className="doctor-avatar">
          <FiUser size={32} />
        </div>
        <div className="doctor-info">
          <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
          <p className="doctor-spec"><FiBriefcase /> {doctor.speciality}</p>
          <p className="doctor-loc"><FiMapPin /> {doctor.establishment || "Private Clinic"}</p>
        </div>
      </div>
      
      {isBooking ? (
        <div className="booking-section">
          <ReservationTypeSelector 
            selectedType={selectedType}
            onTypeSelect={setSelectedType}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
            reason={reason}
            onReasonChange={setReason}
          />
          <div className="booking-actions">
            <button className="btn btn-secondary" onClick={() => setIsBooking(false)} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleBookSubmit} disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      ) : (
        <div className="doctor-card-footer">
          <button className="btn btn-primary full-width" onClick={() => setIsBooking(true)}>
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}
