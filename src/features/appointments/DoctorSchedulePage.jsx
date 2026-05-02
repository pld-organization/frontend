import { useState, useMemo, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiVideo,
  FiMapPin,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import AuthContextValue from "../../context/AuthContextValue";
import {
  getDoctorAppointments,
  cancelAppointment,
  getReservationById,
} from "./data/appointmentService";
import "../../styles/doctor-schedule.css";

void motion;

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABELS = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

function timeToHour(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

function hourToLabel(hour) {
  const h = Math.floor(hour);
  const m = (hour % 1) * 60;
  return `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
}

function durationHours(startTime, endTime) {
  return timeToHour(endTime) - timeToHour(startTime);
}

function mapReservation(r) {
  const start = r.schedule?.startTime ?? "00:00";
  const end   = r.schedule?.endTime   ?? "00:00";
  const type  = r.schedule?.appointmenttype === "ONLINE" ? "Online" : "IRL";
  const day   = r.schedule?.dayOfWeek ?? "MONDAY";

  return {
    id:        r.id,
    day,
    startHour: timeToHour(start),
    duration:  start !== "00:00" && end !== "00:00"
                 ? durationHours(start, end)
                 : 1,
    startTime: start,
    endTime:   start !== "00:00" && end !== "00:00"
                 ? end
                 : hourToLabel(timeToHour(start) + 1),
    patientId: r.patientId,
    type,
    status:    r.reservationStatus ? "confirmed" : "cancelled",
    meetingUrl: r.meetingUrl ?? null,
  };
}

const TIMELINE_HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

export default function DoctorSchedulePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContextValue);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedDay, setSelectedDay]   = useState("MONDAY");
  const [activeTab, setActiveTab]       = useState("Day");
  const [direction, setDirection]       = useState(0);

  useEffect(() => {
  if (!user?.id) return;
  getDoctorAppointments(user.id)
    .then(async (data) => {
      const basic = Array.isArray(data) ? data : [];
      
      const detailed = await Promise.allSettled(
        basic.map((r) =>
          getReservationById(r.id)
            .then((full) => full)
            .catch(() => r) 
        )
      );

      const full = detailed
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      setReservations(full.map(mapReservation));
    })
    .catch(() => setReservations([]))
    .finally(() => setLoading(false));
}, [user?.id]);

  function handleSelectDay(day) {
    const oldIdx = DAYS.indexOf(selectedDay);
    const newIdx = DAYS.indexOf(day);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setSelectedDay(day);
  }

  function handlePrevDay() {
    const idx = DAYS.indexOf(selectedDay);
    if (idx > 0) handleSelectDay(DAYS[idx - 1]);
  }

  function handleNextDay() {
    const idx = DAYS.indexOf(selectedDay);
    if (idx < DAYS.length - 1) handleSelectDay(DAYS[idx + 1]);
  }

  async function handleCancel(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to cancel. Please try again.");
    }
  }

  const dayReservations = useMemo(() =>
    reservations
      .filter((r) => r.day === selectedDay)
      .sort((a, b) => a.startHour - b.startHour),
    [reservations, selectedDay]
  );

  const overview = useMemo(() => {
    if (dayReservations.length === 0) return { first: "—", last: "—", total: "0h 00m" };
    const first = dayReservations[0].startTime;
    const last  = dayReservations[dayReservations.length - 1].startTime;
    const totalH = dayReservations.reduce((s, r) => s + r.duration, 0);
    const h = Math.floor(totalH);
    const m = Math.round((totalH % 1) * 60);
    return { first, last, total: `${h}h ${String(m).padStart(2, "0")}m` };
  }, [dayReservations]);

  const dayStatus = useMemo(() => {
    const map = {};
    for (const day of DAYS) {
      const items = reservations.filter((r) => r.day === day);
      if (items.length === 0) { map[day] = null; continue; }
      if (items.some((r) => r.status === "confirmed")) map[day] = "confirmed";
      else map[day] = "cancelled";
    }
    return map;
  }, [reservations]);

  const slideVariants = {
    enter:  (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit:   (dir) => ({ x: dir > 0 ? -30 : 30, opacity: 0, transition: { duration: 0.2 } }),
  };

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <DashboardShell title="Schedule" description="Dashboard > Schedule">
      <motion.div
        className="doctor-schedule-page"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Header */}
        <div className="schedule-header-row">
          <div>
            <h2>My Schedule</h2>
            <p>Weekly overview of your appointments</p>
          </div>
          <button className="set-availability-btn" onClick={() => navigate("/set-availability")}>
            <FiCalendar /> Set Availability
          </button>
        </div>

        <div className="schedule-layout">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="schedule-left-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Day-of-week selector (replaces monthly calendar) */}
            <motion.div className="calendar-widget-card" variants={itemVariants}>
              <div className="calendar-widget-header">
                <h3>Week</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {DAYS.map((day) => {
                  const isSelected = selectedDay === day;
                  const status     = dayStatus[day];
                  const count      = reservations.filter((r) => r.day === day).length;

                  return (
                    <motion.button
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: isSelected ? "#2563eb" : "#f8fafc",
                        color: isSelected ? "#fff" : "#0f172a",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 14,
                        transition: "background 0.15s",
                      }}
                    >
                      <span>{DAY_LABELS[day]}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {count > 0 && (
                          <span style={{
                            fontSize: 12, fontWeight: 600,
                            background: isSelected ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                            color: isSelected ? "#fff" : "#475569",
                            borderRadius: 10, padding: "1px 7px",
                          }}>
                            {count}
                          </span>
                        )}
                        {status === "confirmed" && (
                          <i className="status-dot green" style={{ position: "static", width: 6, height: 6, background: isSelected ? "#fff" : "#16a34a" }} />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="calendar-legend" style={{ marginTop: 16 }}>
                <span><i className="status-dot green" style={{ position: "static", width: 6, height: 6 }} /> Has appointments</span>
              </div>
            </motion.div>

            {/* Day overview */}
            <motion.div className="today-overview-card" variants={itemVariants}>
              <div className="today-overview-header">
                <div className="icon-wrap"><FiClock /></div>
                <h3>{DAY_LABELS[selectedDay]} Overview</h3>
              </div>
              <div className="overview-row">
                <span className="overview-label">First appointment</span>
                <span className="overview-value">{overview.first}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Last appointment</span>
                <span className="overview-value">{overview.last}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Total duration</span>
                <span className="overview-value">{overview.total}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Appointments</span>
                <span className="overview-value">{dayReservations.length}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            className="schedule-right-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="day-view-card" variants={itemVariants}>
              {/* Day nav header */}
              <div className="day-view-header">
                <div className="date-nav">
                  <button onClick={handlePrevDay} disabled={selectedDay === DAYS[0]}>
                    <FiChevronLeft />
                  </button>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.h3
                      key={selectedDay}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      {DAY_LABELS[selectedDay]}
                    </motion.h3>
                  </AnimatePresence>
                  <button onClick={handleNextDay} disabled={selectedDay === DAYS[DAYS.length - 1]}>
                    <FiChevronRight />
                  </button>
                </div>

                <div className="view-toggle">
                  <button className={activeTab === "Day"  ? "active" : ""} onClick={() => setActiveTab("Day")}>Day</button>
                  <button className={activeTab === "List" ? "active" : ""} onClick={() => setActiveTab("List")}>List</button>
                </div>
              </div>

              {/* Content */}
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  Loading schedule…
                </div>
              ) : (
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${selectedDay}-${activeTab}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {/* ── DAY (timeline) VIEW ── */}
                    {activeTab === "Day" ? (
                      <div className="timeline-container">
                        <div className="timeline-grid">
                          {TIMELINE_HOURS.map((hour) => (
                            <div key={hour} className="timeline-row">
                              <div className="time-label">{hour}</div>
                              <div className="time-line" />
                            </div>
                          ))}

                          <AnimatePresence>
                            {dayReservations.map((r) => {
                              const top    = (r.startHour - 8) * 72;
                              const height = r.duration * 72;
                              const color  = r.status === "cancelled" ? "red"
                                           : r.type === "Online"      ? "blue"
                                           : "green";

                              return (
                                <motion.div
                                  key={r.id}
                                  className={`appointment-block ${color}`}
                                  style={{ top: `${top + 16}px`, height: `${Math.max(height - 12, 40)}px` }}
                                  initial={{ opacity: 0, scaleY: 0.8, transformOrigin: "top" }}
                                  animate={{ opacity: 1, scaleY: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.25 }}
                                  whileHover={{ scale: 1.01, zIndex: 10 }}
                                >
                                  <div className="block-info">
                                    <h4 style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      {r.type === "Online"
                                        ? <FiVideo style={{ flexShrink: 0 }} />
                                        : <FiMapPin style={{ flexShrink: 0 }} />}
                                      {r.startTime} – {r.endTime}
                                    </h4>
                                    <p style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                      <FiUser size={11} />
                                      {r.patientId.slice(0, 8)}…
                                    </p>
                                    {r.meetingUrl && r.type === "Online" && (
                                      <a
                                        href={r.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 11, color: "#2563eb", marginTop: 2, display: "block" }}
                                      >
                                        Join meeting ↗
                                      </a>
                                    )}
                                  </div>
                                  <div className="block-actions">
                                    {r.status !== "cancelled" && (
                                      <button onClick={() => handleCancel(r.id)} title="Cancel appointment">
                                        <FiTrash2 />
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>

                        {dayReservations.length === 0 && (
                          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: 14 }}>
                            No appointments for {DAY_LABELS[selectedDay]}.
                          </div>
                        )}
                      </div>

                    ) : (
                      /* ── LIST VIEW ── */
                      <div style={{ marginTop: 24 }}>
                        {dayReservations.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                            No appointments for {DAY_LABELS[selectedDay]}.
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <AnimatePresence>
                              {dayReservations.map((r, i) => (
                                <motion.div
                                  key={r.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  transition={{ delay: i * 0.05 }}
                                  style={{
                                    padding: "16px",
                                    border: "1px solid #f1f5f9",
                                    borderRadius: 8,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: r.status === "cancelled" ? "#fef2f2" : "#fff",
                                  }}
                                >
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 15 }}>
                                      {r.type === "Online"
                                        ? <FiVideo style={{ color: "#7c3aed" }} />
                                        : <FiMapPin style={{ color: "#16a34a" }} />}
                                      {r.startTime} – {r.endTime}
                                      <span style={{
                                        fontSize: 12, padding: "2px 8px", borderRadius: 10,
                                        background: r.status === "confirmed" ? "#dcfce7" : "#fee2e2",
                                        color: r.status === "confirmed" ? "#15803d" : "#dc2626",
                                        fontWeight: 600,
                                      }}>
                                        {r.status}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                                      <FiUser size={12} /> Patient: {r.patientId.slice(0, 8)}…
                                    </div>
                                    {r.meetingUrl && (
                                      <a
                                        href={r.meetingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 12, color: "#2563eb" }}
                                      >
                                        Join meeting ↗
                                      </a>
                                    )}
                                  </div>

                                  {r.status !== "cancelled" && (
                                    <button
                                      onClick={() => handleCancel(r.id)}
                                      style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
