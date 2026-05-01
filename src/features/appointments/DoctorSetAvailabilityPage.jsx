import { useState, useContext } from "react";
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
  FiSave,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import AuthContextValue from "../../context/AuthContextValue";
import { saveSchedule } from "./data/appointmentService";
import "../../styles/doctor-set-availability.css";

void motion;

// Backend expects uppercase DAY enum values
const DAYS_OF_WEEK = [
  { label: "Sunday",    value: "SUNDAY"    },
  { label: "Monday",    value: "MONDAY"    },
  { label: "Tuesday",   value: "TUESDAY"   },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday",  value: "THURSDAY"  },
  { label: "Friday",    value: "FRIDAY"    },
  { label: "Saturday",  value: "SATURDAY"  },
];

export default function DoctorSetAvailabilityPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContextValue);

  const [repeatWeekly, setRepeatWeekly] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null
  const [saveError, setSaveError] = useState("");

  const [schedule, setSchedule] = useState(
    DAYS_OF_WEEK.map((day) => ({
      ...day,
      enabled: true,
      expanded: true,
      slots: [{ id: 1, start: "09:00", end: "10:00", types: ["IRL"] }],
    }))
  );

  const toggleDayStatus = (index) => {
    setSchedule((prev) => {
      const n = [...prev];
      n[index] = { ...n[index], enabled: !n[index].enabled, expanded: !n[index].enabled };
      return n;
    });
  };

  const toggleDayExpanded = (index) => {
    setSchedule((prev) => {
      const n = [...prev];
      n[index] = { ...n[index], expanded: !n[index].expanded };
      return n;
    });
  };

  const addTimeSlot = (dayIndex) => {
    setSchedule((prev) => {
      const n = [...prev];
      n[dayIndex] = {
        ...n[dayIndex],
        slots: [...n[dayIndex].slots, { id: Date.now(), start: "10:00", end: "11:00", types: ["IRL"] }],
      };
      return n;
    });
  };

  const removeTimeSlot = (dayIndex, slotId) => {
    setSchedule((prev) => {
      const n = [...prev];
      n[dayIndex] = { ...n[dayIndex], slots: n[dayIndex].slots.filter((s) => s.id !== slotId) };
      return n;
    });
  };

  const toggleSlotType = (dayIndex, slotId, type) => {
    setSchedule((prev) => {
      const n = prev.map((d, i) => {
        if (i !== dayIndex) return d;
        return {
          ...d,
          slots: d.slots.map((s) => {
            if (s.id !== slotId) return s;
            const has = s.types.includes(type);
            return { ...s, types: has ? s.types.filter((t) => t !== type) : [...s.types, type] };
          }),
        };
      });
      return n;
    });
  };

  const updateSlotTime = (dayIndex, slotId, field, value) => {
    setSchedule((prev) => {
      const n = prev.map((d, i) => {
        if (i !== dayIndex) return d;
        return { ...d, slots: d.slots.map((s) => (s.id !== slotId ? s : { ...s, [field]: value })) };
      });
      return n;
    });
  };

  // Convert UI slot types to backend TYPE enum
  const uiTypeToBackend = (uiTypes) => {
    // If both are selected, we send two slots — handled below
    // If only "Online" → ONLINE, else → ATTENDANCE
    if (uiTypes.includes("Online") && !uiTypes.includes("IRL")) return ["ONLINE"];
    if (uiTypes.includes("IRL") && !uiTypes.includes("Online")) return ["ATTENDANCE"];
    // Both → create one entry per type
    return ["ATTENDANCE", "ONLINE"];
  };

  const handleSaveAvailability = async () => {
    if (!user?.id) {
      setSaveError("You must be logged in to save availability.");
      setSaveStatus("error");
      return;
    }

    // Build flat list of schedule slots for the API
    const slots = [];
    for (const day of schedule) {
      if (!day.enabled) continue;
      for (const slot of day.slots) {
        if (!slot.types.length) continue;
        const backendTypes = uiTypeToBackend(slot.types);
        for (const appointmenttype of backendTypes) {
          slots.push({
            dayOfWeek: day.value,       // "MONDAY" etc.
            startTime: slot.start,      // "HH:MM"
            endTime: slot.end,
            appointmenttype,            // "ONLINE" | "ATTENDANCE"
          });
        }
      }
    }

    if (slots.length === 0) {
      setSaveError("Please enable at least one day with a time slot.");
      setSaveStatus("error");
      return;
    }

    setSaving(true);
    setSaveStatus(null);
    setSaveError("");

    try {
      await saveSchedule(user.id, slots);
      setSaveStatus("success");
      setTimeout(() => navigate("/availability"), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Failed to save availability. Please try again.";
      setSaveError(msg);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
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

        {/* Save status banners */}
        {saveStatus === "success" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, marginBottom: 16, color: "#15803d" }}>
            <FiCheckCircle /> Availability saved! Redirecting…
          </div>
        )}
        {saveStatus === "error" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, marginBottom: 16, color: "#dc2626" }}>
            <FiAlertCircle /> {saveError}
          </div>
        )}

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
              <div key={day.value} className={`day-card ${day.enabled ? "enabled" : "disabled"}`}>
                <div className="day-card-header">
                  <div className="day-header-left">
                    <div
                      className={`custom-toggle ${day.enabled ? "active" : ""}`}
                      onClick={() => toggleDayStatus(dIdx)}
                    >
                      <div className="toggle-knob"></div>
                    </div>
                    <h4>{day.label}</h4>
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
                        <span style={{ flex: 1 }}>Time Slots</span>
                        <span style={{ width: "140px", paddingLeft: "8px" }}>Appointment Types</span>
                        <span style={{ width: "40px" }}></span>
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
                                className={`type-btn ${slot.types.includes("IRL") ? "active" : ""}`}
                                onClick={() => toggleSlotType(dIdx, slot.id, "IRL")}
                                title="In Person (IRL) → ATTENDANCE"
                              >
                                <FiMapPin />
                              </button>
                              <button
                                className={`type-btn ${slot.types.includes("Online") ? "active" : ""}`}
                                onClick={() => toggleSlotType(dIdx, slot.id, "Online")}
                                title="Online → ONLINE"
                              >
                                <FiVideo />
                              </button>
                            </div>

                            <button
                              className="delete-slot-btn"
                              onClick={() => removeTimeSlot(dIdx, slot.id)}
                            >
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
            <button
              className="save-availability-btn"
              onClick={handleSaveAvailability}
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving…" : "Save Availability"}
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}