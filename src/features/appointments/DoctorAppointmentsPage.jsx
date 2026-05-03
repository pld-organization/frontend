import { useState, useMemo, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiSliders,
  FiUser,
  FiMapPin,
  FiGlobe,
  FiEye,
  FiVideo,
  FiPlay,
  FiMoreVertical,
  FiChevronDown,
  FiX,
  FiHash,
  FiAlertCircle,
} from "react-icons/fi";
import AuthContextValue from "../../context/AuthContextValue";
import {
  getDoctorAppointments,
  cancelAppointment,
  getReservationById,
  getPatientById,
} from "./data/appointmentService";
import "../../styles/doctor-appointments.css";

void motion;

// ─── Constants & pure helpers ────────────────────────────────────────────────

const DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

function getTodayDayOfWeek() {
  return DAYS[new Date().getDay()];
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

function canJoinAppointment(dayOfWeek, startTime, windowMins = 5) {
  if (!dayOfWeek || !startTime) return false;

  const now        = new Date();
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

function mapReservationToRow(r, p = null) {
  const isOnline = r.schedule?.appointmenttype === "ONLINE";
  const isActive = r.reservationStatus;

  const firstName = p?.firstName ?? p?.firstname ?? p?.first_name ?? "";
  const lastName  = p?.lastName  ?? p?.lastname  ?? p?.last_name  ?? "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ") || null;

  return {
    id:               r.id,
    time:             r.schedule?.startTime  ?? "—",
    endTime:          r.schedule?.endTime    ?? null,
    date:             r.schedule?.dayOfWeek  ?? null,
    patient:          fullName ?? r.patientId ?? "Patient",
    patientId:        r.patientId            ?? null,
    patientFirstName: firstName || null,
    patientLastName:  lastName  || null,
    type:             isOnline ? "Online" : "IRL",
    status:           isActive ? "Confirmed" : "Cancelled",
    action:           isActive ? (isOnline ? "Join" : "View") : "View",
    meetingUrl:       isOnline ? (r.meetingUrl ?? null) : null,
    duration:         r.schedule?.duration   ?? null,
    notes:            r.notes               ?? null,
    raw:              r,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "20px 0 12px" }}>
      {children}
    </p>
  );
}

function InfoItem({ label, value, icon, valueStyle = {} }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px" }}>
      <label style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {icon}
        {label}
      </label>
      <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: 600, ...valueStyle }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

function AppointmentDetailModal({ appointment, onClose, onCancel }) {
  if (!appointment) return null;

  const canCancel = appointment.status !== "Cancelled" && appointment.status !== "Completed";

  const joinable =
    appointment.type === "Online" &&
    !!appointment.meetingUrl &&
    appointment.status !== "Cancelled" &&
    canJoinAppointment(appointment.date, appointment.time);

  const handleJoin = () => {
    if (appointment.meetingUrl) {
      window.open(appointment.meetingUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const statusColor = {
    Confirmed:     "#16a34a",
    Cancelled:     "#dc2626",
    Completed:     "#2563eb",
    "In Progress": "#d97706",
    Pending:       "#9333ea",
  }[appointment.status] ?? "#64748b";

  return (
    <AnimatePresence>
      <motion.div
        className="apt-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "16px",
        }}
      >
        <motion.div
          className="apt-modal"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "#fff", borderRadius: "20px",
            width: "100%", maxWidth: "520px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
            overflow: "hidden", maxHeight: "90vh", overflowY: "auto",
          }}
        >
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #1e40af 0%, #2563eb 55%, #3b82f6 100%)", padding: "28px 28px 22px", position: "relative" }}>
            <button
              onClick={onClose}
              style={{ position: "absolute", top: "18px", right: "18px", background: "rgba(255,255,255,0.18)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            >
              <FiX />
            </button>

            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
              Appointment Details
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
              <FiHash size={12} />
              {String(appointment.id).slice(0, 18)}…
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "14px", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: "rgba(255,255,255,0.18)", color: "#fff" }}>
                {appointment.type === "Online" ? <FiGlobe size={11} /> : <FiMapPin size={11} />}
                {appointment.type === "Online" ? "Online" : "In-Person"}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, background: "rgba(255,255,255,0.18)", color: "#fff" }}>
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 28px" }}>
            <SectionLabel>Patient</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "20px", flexShrink: 0 }}>
                {(appointment.patientFirstName?.[0] ?? appointment.patient?.[0] ?? "P").toUpperCase()}
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "15px", color: "#1e293b" }}>
                  {appointment.patientFirstName && appointment.patientLastName
                    ? `${appointment.patientFirstName} ${appointment.patientLastName}`
                    : appointment.patient}
                </strong>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "monospace", display: "block", marginTop: "2px" }}>
                  ID: {appointment.patientId}
                </span>
              </div>
            </div>

            <SectionLabel>Schedule</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <InfoItem label="Day"        value={appointment.date ?? "—"} />
              <InfoItem label="Start Time" value={appointment.time} icon={<FiClock size={13} />} />
              {appointment.endTime  && <InfoItem label="End Time" value={appointment.endTime} />}
              {appointment.duration && <InfoItem label="Duration" value={`${appointment.duration} min`} />}
            </div>

            <SectionLabel>Consultation</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <InfoItem label="Type"   value={appointment.type === "Online" ? "🌐 Online" : "📍 In-Person"} />
              <InfoItem label="Status" value={appointment.status} valueStyle={{ color: statusColor }} />
              {appointment.meetingUrl && (
                <div style={{ gridColumn: "1 / -1", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "10px", padding: "12px 14px" }}>
                  <label style={{ fontSize: "11px", color: "#0284c7", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    MEETING LINK
                  </label>
                  <span style={{ fontSize: "13px", color: "#0369a1", wordBreak: "break-all", fontFamily: "monospace" }}>
                    {appointment.meetingUrl}
                  </span>
                </div>
              )}
            </div>

            {appointment.notes && (
              <>
                <SectionLabel>Notes</SectionLabel>
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#78350f", lineHeight: 1.6 }}>
                  {appointment.notes}
                </div>
              </>
            )}

            {appointment.type === "Online" && appointment.meetingUrl && appointment.status !== "Cancelled" && (
              <button
                onClick={handleJoin}
                disabled={!joinable}
                title={!joinable ? "Available only at appointment time" : "Join meeting"}
                style={{
                  width: "100%", marginTop: "20px", padding: "14px",
                  background: joinable ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#cbd5e1",
                  border: "none", borderRadius: "12px", color: "#fff",
                  fontSize: "15px", fontWeight: 700,
                  cursor: joinable ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  opacity: joinable ? 1 : 0.6, transition: "opacity 0.2s",
                }}
              >
                <FiVideo />
                {joinable ? "Join Meeting Room" : "Join (Not yet)"}
              </button>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 28px", display: "flex", gap: "10px" }}>
            {canCancel && (
              <button
                onClick={() => { onCancel(appointment.id); onClose(); }}
                style={{ flex: 1, padding: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", color: "#dc2626", fontWeight: 700, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fef2f2")}
              >
                <FiAlertCircle size={14} />
                Cancel Appointment
              </button>
            )}
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "12px", background: "#f1f5f9", border: "none", borderRadius: "10px", color: "#475569", fontWeight: 700, cursor: "pointer", fontSize: "14px", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DoctorAppointmentsPage() {
  const { user } = useContext(AuthContextValue);

  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loadingList,      setLoadingList]      = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingList(true);
    getDoctorAppointments(user.id)
      .then(async (data) => {
        const basic = Array.isArray(data) ? data : [];

        const detailedResults = await Promise.allSettled(
          basic.map((r) => getReservationById(r.id).then((full) => full).catch(() => r))
        );
        const fullReservations = detailedResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);

        const patientResults = await Promise.allSettled(
          fullReservations.map((r) =>
            r.patientId ? getPatientById(r.patientId).catch(() => null) : Promise.resolve(null)
          )
        );

        const rows = fullReservations.map((r, i) => {
          const patient = patientResults[i].status === "fulfilled" ? patientResults[i].value : null;
          return mapReservationToRow(r, patient);
        });

        setAppointmentsList(rows);
      })
      .catch(() => setAppointmentsList([]))
      .finally(() => setLoadingList(false));
  }, [user?.id]);

  const [searchTerm,          setSearchTerm]          = useState("");
  const [showDropdown,        setShowDropdown]        = useState(null);
  const [showFilterMenu,      setShowFilterMenu]      = useState(false);
  const [filterStatus,        setFilterStatus]        = useState("All");
  const [filterType,          setFilterType]          = useState("All");
  const [displayCount,        setDisplayCount]        = useState(4);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Appointments that belong to today only — used for stats + as base for search/filter
  const todayAppointments = useMemo(() => {
    const today = getTodayDayOfWeek();
    return appointmentsList.filter((app) => app.date?.toUpperCase() === today);
  }, [appointmentsList]);

  // Stats derived from today's appointments only
  const stats = useMemo(() => {
    const total     = todayAppointments.length;
    const confirmed = todayAppointments.filter((a) => a.status === "Confirmed" || a.status === "In Progress").length;
    const pending   = todayAppointments.filter((a) => a.status === "Pending").length;
    const cancelled = todayAppointments.filter((a) => a.status === "Cancelled").length;
    const fmt = (n) => (n < 10 ? `0${n}` : `${n}`);
    return [
      { title: "Total Appointments", value: fmt(total),     icon: <FiCalendar />,    color: "blue",   sub: "Today" },
      { title: "Confirmed",          value: fmt(confirmed), icon: <FiCheckCircle />, color: "green",  sub: "Today" },
      { title: "Pending",            value: fmt(pending),   icon: <FiClock />,       color: "orange", sub: "Today" },
      { title: "Cancelled",          value: fmt(cancelled), icon: <FiXCircle />,     color: "red",    sub: "Today" },
    ];
  }, [todayAppointments]);

  // Search + filter applied on top of today's appointments
  const filteredAppointments = useMemo(() => {
    return todayAppointments.filter((app) => {
      const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType   = filterType   === "All" || app.type   === filterType;
      const matchesStatus = filterStatus === "All" || app.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [todayAppointments, searchTerm, filterType, filterStatus]);

  const displayedAppointments = filteredAppointments.slice(0, displayCount);
  const hasMore = displayCount < filteredAppointments.length;

  const todayLabel = getTodayLabel();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDisplayCount(4);
  };

  const handleActionClick = useCallback(
    (id) => {
      const app = appointmentsList.find((a) => a.id === id);
      if (!app) return;

      if (app.action === "View") {
        setSelectedAppointment(app);
        return;
      }

      if ((app.action === "Join" || app.action === "Start") && app.meetingUrl) {
        if (!canJoinAppointment(app.date, app.time)) return;
        window.open(app.meetingUrl, "_blank", "noopener,noreferrer");
      }

      setAppointmentsList((prev) =>
        prev.map((a) => {
          if (a.id !== id) return a;
          if (a.action === "Start" || a.action === "Join")
            return { ...a, status: "In Progress", action: "Finish" };
          if (a.action === "Finish")
            return { ...a, status: "Completed", action: "View" };
          return a;
        })
      );
    },
    [appointmentsList]
  );

  const handleCancel = useCallback(async (id) => {
    setShowDropdown(null);
    try {
      await cancelAppointment(id);
      setAppointmentsList((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "Cancelled", action: "View" } : app
        )
      );
      setSelectedAppointment((prev) =>
        prev?.id === id ? { ...prev, status: "Cancelled", action: "View" } : prev
      );
    } catch {
      alert("Failed to cancel appointment. Please try again.");
    }
  }, []);

  return (
    <DashboardShell title="Dashboard" description="Appointments">
      <div className="doctor-appointments-page">

        {/* ── Header ── */}
        <motion.div
          className="doctor-appointments-header"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <h2>Manage and track all patient appointments</h2>
            <div className="doctor-appointments-subtitle">
              <span>Today's Statistics</span>
              <div className="doctor-date-small">
                <FiCalendar />
                {todayLabel}
              </div>
            </div>
          </div>
          <button className="doctor-date-btn">
            <FiCalendar />
            {todayLabel}
            <FiChevronDown />
          </button>
        </motion.div>

        {/* ── Stats ── */}
        <section className="doctor-stats-grid">
          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              className={`doctor-stat-card ${item.color}`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="stat-card-icon">{item.icon}</div>
              <div className="stat-card-info">
                <strong>{item.value}</strong>
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ── Appointments Table ── */}
        <motion.section
          className="doctor-appointments-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <div className="appointments-card-top">
            <div>
              <h3>Today's Appointments</h3>
              <p>{todayLabel}</p>
            </div>

            <div className="appointments-card-actions" style={{ position: "relative" }}>
              <div className="appointments-search-box">
                <FiSearch />
                <input
                  placeholder="Search patient by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <button
                className="appointments-filter-btn"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <FiSliders />
                Filter
                {(filterType !== "All" || filterStatus !== "All") && (
                  <span style={{ width: 8, height: 8, background: "#2388ff", borderRadius: "50%", marginLeft: 4 }} />
                )}
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", top: "54px", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", width: "260px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 20 }}
                  >
                    <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>Status</h4>
                    <select
                      value={filterStatus}
                      onChange={(e) => { setFilterStatus(e.target.value); setDisplayCount(4); }}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "20px", fontSize: "14px", outline: "none", background: "#f8fafc" }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>Consultation Type</h4>
                    <select
                      value={filterType}
                      onChange={(e) => { setFilterType(e.target.value); setDisplayCount(4); }}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#f8fafc" }}
                    >
                      <option value="All">All Types</option>
                      <option value="IRL">In Person (IRL)</option>
                      <option value="Online">Online</option>
                    </select>

                    <button
                      onClick={() => { setFilterStatus("All"); setFilterType("All"); setDisplayCount(4); setShowFilterMenu(false); }}
                      style={{ marginTop: "24px", width: "100%", padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", color: "#475569", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.background = "#e2e8f0")}
                      onMouseLeave={(e) => (e.target.style.background = "#f1f5f9")}
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Table */}
          <div className="appointments-table">
            <div className="appointments-table-head">
              <span>Time ↕</span>
              <span>Patient ↕</span>
              <span>Type</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="appointments-table-body">
              {loadingList ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#8c8c8c", fontSize: "15px" }}>
                  Loading appointments…
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedAppointments.length > 0 ? (
                    displayedAppointments.map((item) => {
                      const isJoinOrStart = item.action === "Join" || item.action === "Start";
                      const joinable = isJoinOrStart && canJoinAppointment(item.date, item.time);

                      return (
                        <motion.div
                          layout
                          className="appointment-row"
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="appointment-time">
                            <span className="row-icon"><FiClock /></span>
                            <strong>{item.time}</strong>
                          </div>

                          <div className="appointment-patient">
                            <span className="row-icon"><FiUser /></span>
                            <strong>{item.patient}</strong>
                          </div>

                          <div className="appointment-type">
                            {item.type === "Online" ? <FiGlobe /> : <FiMapPin />}
                            <span style={{ marginLeft: "8px" }}>{item.type}</span>
                          </div>

                          <div>
                            <span className={`appointment-status ${item.status.toLowerCase().replace(" ", "-")}`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="appointment-action" style={{ position: "relative" }}>
                            <button
                              className={`action-btn ${item.action.toLowerCase()}`}
                              onClick={() => handleActionClick(item.id)}
                              disabled={isJoinOrStart && !joinable}
                              title={isJoinOrStart && !joinable ? "Available only at appointment time" : undefined}
                              style={isJoinOrStart && !joinable ? { opacity: 0.45, cursor: "not-allowed" } : {}}
                            >
                              {item.action === "Join"   && <FiVideo />}
                              {item.action === "Start"  && <FiPlay />}
                              {item.action === "View"   && <FiEye />}
                              {item.action === "Finish" && <FiCheckCircle />}
                              {item.action}
                            </button>

                            <button
                              className="more-btn"
                              onClick={() => setShowDropdown(showDropdown === item.id ? null : item.id)}
                            >
                              <FiMoreVertical />
                            </button>

                            <AnimatePresence>
                              {showDropdown === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  style={{ position: "absolute", top: "45px", right: "0", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "160px" }}
                                >
                                  <button
                                    onClick={() => { setSelectedAppointment(item); setShowDropdown(null); }}
                                    style={{ display: "block", width: "100%", padding: "12px 16px", background: "transparent", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600, textAlign: "left" }}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleCancel(item.id)}
                                    disabled={item.status === "Cancelled" || item.status === "Completed"}
                                    style={{ display: "block", width: "100%", padding: "12px 16px", background: "transparent", border: "none", color: item.status === "Cancelled" || item.status === "Completed" ? "#cbd5e1" : "#e92735", cursor: item.status === "Cancelled" || item.status === "Completed" ? "not-allowed" : "pointer", fontWeight: 600, textAlign: "left" }}
                                  >
                                    Cancel Appointment
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div style={{ padding: "40px", textAlign: "center", color: "#8c8c8c", fontSize: "15px" }}>
                      No appointments for today.
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          <AnimatePresence>
            {hasMore && (
              <motion.div
                className="load-more-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button className="load-more-btn" onClick={() => setDisplayCount((p) => p + 4)}>
                  Load More <FiChevronDown />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCancel={handleCancel}
        />
      )}
    </DashboardShell>
  );
}