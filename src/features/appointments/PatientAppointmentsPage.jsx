import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiSearch,
  FiFilter,
  FiVideo,
  FiMapPin,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import AuthContextValue from "../../context/AuthContextValue";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../lib/constants/api";
import { getAvailableSlots, createAppointment } from "./data/appointmentService";
import "../../styles/patient-appointments.css";
import { getStoredAccessToken } from "../../services/authStorage";


const MotionDiv = motion.div;
const MotionSection = motion.section;

export default function PatientAppointmentsPage() {
  const { user } = useContext(AuthContextValue);
  const navigate = useNavigate();

  // Doctors list from users/auth service
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Booking flow
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [slots, setSlots] = useState([]);         // available slots for expanded doctor
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedDoctorIds, setBookedDoctorIds] = useState(new Set());
  const [successMessage, setSuccessMessage] = useState("");

  // Filters + pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;


useEffect(() => {
  apiClient
    .get(API_ENDPOINTS.DOCTORS.ALL_IDS)
    .then(async ({ data }) => {
      const ids = Array.isArray(data?.ids) ? data.ids : [];

      if (ids.length === 0) {
        setDoctors([]);
        setLoadingDoctors(false);
        return;
      }

      const profileResults = await Promise.allSettled(
        ids.map((id) =>
          apiClient
            .get(API_ENDPOINTS.DOCTORS.BY_ID_AUTH(id))
            .then(({ data }) => data)
            .catch(() => null)
        )
      );

      const allDoctors = profileResults
        .filter((r) => r.status === "fulfilled" && r.value !== null)
        .map((r) => r.value);

      if (allDoctors.length === 0) {
        setDoctors([]);
        setLoadingDoctors(false);
        return;
      }

      const token = getStoredAccessToken();

      const slotChecks = await Promise.allSettled(
        allDoctors.map((doc) =>
          fetch(
            `${import.meta.env.VITE_RESERVATION_API_URL ?? "https://reservation-service-f8ik.onrender.com"}${API_ENDPOINTS.RESERVATION.AVAILABLE_SLOTS(doc.id)}`,
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          )
            .then((res) => (res.ok ? res.json() : []))
            .then((slots) => {
              return Array.isArray(slots) && slots.length > 0 ? doc : null;
            })
            .catch(() => null)
        )
      );

      const available = slotChecks
        .filter((r) => r.status === "fulfilled" && r.value !== null)
        .map((r) => r.value);

      setDoctors(available);
    })
    .catch((err) => {
      console.log("❌ Failed:", err);
      setDoctors([]);
    })
    .finally(() => setLoadingDoctors(false));
}, []);

  // When a doctor row is expanded, load their available slots
  useEffect(() => {
    if (!expandedDoctorId) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    setReason("");
    getAvailableSlots(expandedDoctorId)
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [expandedDoctorId]);

  function handleToggleDoctor(doctorId) {
    setExpandedDoctorId((prev) => (prev === doctorId ? null : doctorId));
  }

  async function handleConfirmBooking(doctor) {
    if (!selectedSlot) return;
    setBookingLoading(true);
    try {
      await createAppointment({
        doctorId: doctor.id,
        patientId: user.id,
        reservationDay: selectedSlot.dayOfWeek,
        reservationTime: selectedSlot.startTime,
        reason,
      });
      setBookedDoctorIds((prev) => new Set(prev).add(doctor.id));
      setExpandedDoctorId(null);
      setSuccessMessage(`Appointment booked with Dr. ${doctor.firstName} ${doctor.lastName}!`);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/schedule");
      }, 2500);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Booking failed. Please try again.";
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  }

  // Filter doctors by name and appointment type
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const nameMatches = `${doctor.firstName} ${doctor.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (appointmentTypeFilter === "all") return nameMatches;

      // We don't know types until slots are loaded, so type filter is best-effort
      // based on what the doctor has in their schedule (checked when slots load)
      return nameMatches;
    });
  }, [doctors, searchQuery, appointmentTypeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const pagedDoctors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, currentPage]);

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    setExpandedDoctorId(null);
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchQuery("");
    setAppointmentTypeFilter("all");
    setCurrentPage(1);
  }

  return (
    <DashboardShell title="Appointments" description="Appointments">
      <div className="patient-appointments-page">

        {successMessage && (
          <MotionDiv
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", marginBottom: 16,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 8, color: "#15803d"
            }}
          >
            <FiCheckCircle /> {successMessage}
          </MotionDiv>
        )}

        {/* Toolbar */}
        <MotionDiv
          className="appointments-toolbar"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="appointments-search">
            <FiSearch className="appointments-search-icon" />
            <input
              type="text"
              placeholder="Search doctors by name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <button
            className="appointments-filter-btn"
            type="button"
            onClick={() => setShowFilterPanel((prev) => !prev)}
          >
            <FiFilter />
            Filter
          </button>
        </MotionDiv>

        {/* Filter panel */}
        {showFilterPanel && (
          <MotionDiv
            className="appointments-filter-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <label className="filter-label" htmlFor="filter-type">
              Appointment type
            </label>
            <select
              id="filter-type"
              value={appointmentTypeFilter}
              onChange={(e) => { setAppointmentTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All</option>
              <option value="irl">In-person</option>
              <option value="video">Video</option>
            </select>
            <div className="appointments-filter-actions">
              <button type="button" className="appointments-reset-btn" onClick={handleResetFilters}>
                Reset
              </button>
            </div>
          </MotionDiv>
        )}

        {/* Doctors list */}
        <MotionSection
          className="available-doctors-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="available-doctors-header">
            <h3>Available doctors <span>↗</span></h3>
          </div>

          <div className="available-doctors-list">
            {loadingDoctors ? (
              <div className="no-appointments-message">Loading doctors…</div>
            ) : pagedDoctors.length === 0 ? (
              <div className="no-appointments-message">
                No doctors match the selected filters.
              </div>
            ) : (
              pagedDoctors.map((doctor) => {
                const isExpanded = expandedDoctorId === doctor.id;
                const isBooked = bookedDoctorIds.has(doctor.id);

                return (
                  <div className="doctor-row" key={doctor.id}>
                    {/* Main info row */}
                    <div className="doctor-main-info">
                      <div className="doctor-avatar-placeholder">
                        {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                      </div>
                      <div className="doctor-name-block">
                        <span className="doctor-name">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </span>
                      </div>
                    </div>

                    <div className="doctor-meta-block">
                      <span className="meta-label">Speciality</span>
                      <span className="meta-value">{doctor.speciality ?? "—"}</span>
                    </div>

                    <div className="doctor-meta-block">
                      <span className="meta-label">Establishment</span>
                      <span className="meta-value">{doctor.establishment ?? "Private Clinic"}</span>
                    </div>

                    <div className="doctor-action-block">
                      <button
                        className="add-appointment-btn"
                        type="button"
                        onClick={() => !isBooked && handleToggleDoctor(doctor.id)}
                        disabled={isBooked}
                      >
                        {isBooked ? <><FiCheckCircle /> Booked</> : "Book"}
                      </button>
                    </div>

                    {/* Expandable booking panel */}
                    {isExpanded && !isBooked && (
                      <div className="booking-panel">
                        {slotsLoading ? (
                          <p style={{ color: "#64748b", padding: "8px 0" }}>Loading available slots…</p>
                        ) : slots.length === 0 ? (
                          <p style={{ color: "#64748b", padding: "8px 0" }}>No available slots for this doctor.</p>
                        ) : (
                          <>
                            <p style={{ fontWeight: 600, marginBottom: 8 }}>Select a time slot</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                              {slots.map((slot) => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => setSelectedSlot(slot)}
                                  style={{
                                    padding: "9px 12px",
                                    border: `2px solid ${selectedSlot?.id === slot.id ? "#0ea5e9" : "#e2e8f0"}`,
                                    borderRadius: 8,
                                    background: selectedSlot?.id === slot.id ? "#f0f9ff" : "#fff",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    fontSize: 14,
                                  }}
                                >
                                  <FiClock style={{ color: "#0ea5e9", flexShrink: 0 }} />
                                  <span style={{ fontWeight: 500 }}>{slot.dayOfWeek}</span>
                                  <span style={{ color: "#64748b" }}>{slot.startTime} – {slot.endTime}</span>
                                  {slot.appointmenttype === "ONLINE"
                                    ? <FiVideo style={{ marginLeft: "auto", color: "#7c3aed" }} />
                                    : <FiMapPin style={{ marginLeft: "auto", color: "#16a34a" }} />}
                                </button>
                              ))}
                            </div>

                            <textarea
                              placeholder="Reason for visit (optional)"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              style={{
                                marginTop: 10, width: "100%", padding: "8px 12px",
                                borderRadius: 8, border: "1px solid #e2e8f0",
                                resize: "vertical", minHeight: 64, fontSize: 14,
                              }}
                            />

                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                              <button
                                type="button"
                                className="appointments-reset-btn"
                                onClick={() => setExpandedDoctorId(null)}
                                disabled={bookingLoading}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="add-appointment-btn"
                                onClick={() => handleConfirmBooking(doctor)}
                                disabled={bookingLoading || !selectedSlot}
                              >
                                {bookingLoading ? "Booking…" : "Confirm"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </MotionSection>

        {/* Pagination */}
        <div className="appointments-footer-bar">
          <div className="appointments-pagination">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage === pageCount}
            >
              Next →
            </button>
          </div>

          <div className="appointments-page-indicator">
            <span>Page</span>
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <span>of {pageCount}</span>
          </div>
        </div>

      </div>
    </DashboardShell>
  );
}