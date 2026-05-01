import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiChevronLeft,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiInfo,
  FiVideo,
  FiMapPin,
  FiTrash2,
  FiPlus,
  FiChevronRight,
  FiClock,
  FiSave
} from "react-icons/fi";
import "../../styles/doctor-set-availability.css";

void motion;

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorSetAvailabilityPage() {
  const navigate = useNavigate();
  const [repeatWeekly, setRepeatWeekly] = useState(true);
  
  // State for days schedule
  const [schedule, setSchedule] = useState(
    DAYS_OF_WEEK.map((day) => ({
      name: day,
      enabled: true,
      expanded: true,
      slots: [{ id: 1, start: "09:00", end: "10:00", types: ["IRL"] }]
    }))
  );

  const toggleDayStatus = (index) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      newSchedule[index].enabled = !newSchedule[index].enabled;
      if (!newSchedule[index].enabled) {
        newSchedule[index].expanded = false; // collapse if disabled
      } else {
        newSchedule[index].expanded = true; // expand if enabled
      }
      return newSchedule;
    });
  };

  const toggleDayExpanded = (index) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      newSchedule[index].expanded = !newSchedule[index].expanded;
      return newSchedule;
    });
  };

  const addTimeSlot = (dayIndex) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].slots.push({
        id: Date.now(),
        start: "10:00",
        end: "11:00",
        types: ["IRL"]
      });
      return newSchedule;
    });
  };

  const removeTimeSlot = (dayIndex, slotId) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(s => s.id !== slotId);
      return newSchedule;
    });
  };

  const toggleSlotType = (dayIndex, slotId, type) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      const slot = newSchedule[dayIndex].slots.find(s => s.id === slotId);
      if (slot) {
        if (slot.types.includes(type)) {
          slot.types = slot.types.filter(t => t !== type);
        } else {
          slot.types.push(type);
        }
      }
      return newSchedule;
    });
  };

  const updateSlotTime = (dayIndex, slotId, field, value) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      const slot = newSchedule[dayIndex].slots.find(s => s.id === slotId);
      if (slot) {
        slot[field] = value;
      }
      return newSchedule;
    });
  };

  return (
    <DashboardShell title="Set Availability" description="Dashboard > Schedule > Availability">
      <motion.div
        className="set-availability-page"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="availability-header-row">
          <button className="back-button" onClick={() => navigate("/availability")}>
            <FiChevronLeft />
          </button>
          <div>
            <h2>Set Availability</h2>
            <p>Manage your availability for appointments</p>
          </div>
        </div>

        <div className="availability-content">
          {/* Period Card */}
          <div className="availability-card period-card">
            <h3>Availability Period</h3>
            <div className="period-grid">
              <div className="input-group">
                <label>Start Date</label>
                <div className="date-input-wrap">
                  <input type="date" defaultValue="2026-04-20" />
                </div>
              </div>
              <div className="input-group">
                <label>Valid Till</label>
                <div className="date-input-wrap">
                  <input type="date" defaultValue="2026-07-20" />
                </div>
              </div>
              
              <div className="repeat-toggle-wrap">
                <div 
                  className={`custom-toggle ${repeatWeekly ? "active" : ""}`}
                  onClick={() => setRepeatWeekly(!repeatWeekly)}
                >
                  <div className="toggle-knob"></div>
                </div>
                <span>Repeat weekly until changed</span>
                <FiInfo className="info-icon" />
              </div>
            </div>

            <div className="unavailable-dates-btn">
              <div className="unavailable-left">
                <FiCalendar />
                <span>Mark Unavailable Dates</span>
              </div>
              <FiChevronRight />
            </div>
          </div>

          {/* Days Schedule */}
          <div className="days-schedule-list">
            {schedule.map((day, dIdx) => (
              <div key={day.name} className={`day-card ${day.enabled ? 'enabled' : 'disabled'}`}>
                <div className="day-card-header">
                  <div className="day-header-left">
                    <div 
                      className={`custom-toggle ${day.enabled ? "active" : ""}`}
                      onClick={() => toggleDayStatus(dIdx)}
                    >
                      <div className="toggle-knob"></div>
                    </div>
                    <h4>{day.name}</h4>
                  </div>
                  <button className="expand-btn" onClick={() => toggleDayExpanded(dIdx)}>
                    {day.expanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                <AnimatePresence>
                  {day.expanded && day.enabled && (
                    <motion.div 
                      className="day-slots-container"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="slots-header">
                        <span style={{flex: 1}}>Time Slots</span>
                        <span style={{width: '140px', paddingLeft: '8px'}}>Appointment Types</span>
                        <span style={{width: '40px'}}></span>
                      </div>
                      
                      <div className="slots-list">
                        {day.slots.map((slot) => (
                          <div key={slot.id} className="slot-row">
                            <div className="time-inputs">
                              <div className="time-input-box">
                                <input 
                                  type="time" 
                                  value={slot.start}
                                  onChange={(e) => updateSlotTime(dIdx, slot.id, "start", e.target.value)}
                                />
                                <FiClock className="time-icon" />
                              </div>
                              <span className="time-separator">-</span>
                              <div className="time-input-box">
                                <input 
                                  type="time" 
                                  value={slot.end}
                                  onChange={(e) => updateSlotTime(dIdx, slot.id, "end", e.target.value)}
                                />
                                <FiClock className="time-icon" />
                              </div>
                            </div>

                            <div className="type-toggles">
                              <button 
                                className={`type-btn ${slot.types.includes('IRL') ? 'active' : ''}`}
                                onClick={() => toggleSlotType(dIdx, slot.id, 'IRL')}
                                title="In Person (IRL)"
                              >
                                <FiMapPin />
                              </button>
                              <button 
                                className={`type-btn ${slot.types.includes('Online') ? 'active' : ''}`}
                                onClick={() => toggleSlotType(dIdx, slot.id, 'Online')}
                                title="Online"
                              >
                                <FiVideo />
                              </button>
                            </div>

                            <button className="delete-slot-btn" onClick={() => removeTimeSlot(dIdx, slot.id)}>
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button className="add-slot-btn" onClick={() => addTimeSlot(dIdx)}>
                        <FiPlus /> Add Time Slot
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="save-availability-wrap">
            <button className="save-availability-btn" onClick={() => navigate("/availability")}>
              <FiSave /> Save Availability
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
