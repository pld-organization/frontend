export default function ReservationTypeSelector({ selectedType, onTypeSelect, date, onDateChange, time, onTimeChange, reason, onReasonChange }) {
  return (
    <div className="reservation-selector">
      <div className="type-buttons">
        <button 
          className={`type-btn ${selectedType === 'consultation' ? 'active' : ''}`}
          onClick={() => onTypeSelect('consultation')}
        >
          In-person
        </button>
        <button 
          className={`type-btn ${selectedType === 'online' ? 'active' : ''}`}
          onClick={() => onTypeSelect('online')}
        >
          Online Video
        </button>
      </div>
      <div className="reservation-inputs">
        <div className="input-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="input-group">
          <label>Time</label>
          <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} required />
        </div>
      </div>
      <div className="input-group full-width">
        <label>Reason for visit (Optional)</label>
        <textarea 
          placeholder="Briefly describe your symptoms..." 
          value={reason} 
          onChange={(e) => onReasonChange(e.target.value)}
          rows="2"
        />
      </div>
    </div>
  );
}