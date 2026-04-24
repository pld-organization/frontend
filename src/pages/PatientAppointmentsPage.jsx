import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import {
  FiSearch,
  FiFilter,
  FiPlusCircle,
  FiVideo,
  FiMapPin,
} from "react-icons/fi";
import "../styles/patient-appointments.css";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const doctors = [
  {
    id: 1,
    name: "Dehmani mohamed",
    speciality: "something",
    appointmentType: ["irl", "video"],
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Dehmani mohamed",
    speciality: "something",
    appointmentType: ["irl", "video"],
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Dehmani mohamed",
    speciality: "something",
    appointmentType: ["irl", "video"],
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Dehmani mohamed",
    speciality: "something",
    appointmentType: ["irl", "video"],
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    name: "Dehmani mohamed",
    speciality: "something",
    appointmentType: ["irl", "video"],
    avatar:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&q=80",
  },
];

export default function PatientAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const pageSize = 3;

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const nameMatches = doctor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const typeMatches =
        appointmentTypeFilter === "all" ||
        doctor.appointmentType.includes(appointmentTypeFilter);

      return nameMatches && typeMatches;
    });
  }, [searchQuery, appointmentTypeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const pagedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, currentPage]);

  function handleAddAppointment(doctor) {
    const alreadyAdded = appointments.some((item) => item.id === doctor.id);

    if (alreadyAdded) {
      setFeedbackMessage(`Appointment already requested with ${doctor.name}.`);
      return;
    }

    setAppointments((prev) => [...prev, doctor]);
    setFeedbackMessage(`Appointment requested with ${doctor.name}.`);
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }

  function handleAppointmentTypeFilterChange(event) {
    setAppointmentTypeFilter(event.target.value);
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
              onChange={handleAppointmentTypeFilterChange}
            >
              <option value="all">All</option>
              <option value="irl">In-person</option>
              <option value="video">Video</option>
            </select>
            <div className="appointments-filter-actions">
              <button
                type="button"
                className="appointments-reset-btn"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </MotionDiv>
        )}

        <MotionSection
          className="available-doctors-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="available-doctors-header">
            <h3>
              Available doctors <span>↗</span>
            </h3>
          </div>

          <div className="appointments-feedback">
            {feedbackMessage && <span>{feedbackMessage}</span>}
          </div>

          <div className="available-doctors-list">
            {pagedDoctors.length > 0 ? (
              pagedDoctors.map((doctor) => (
                <div className="doctor-row" key={doctor.id}>
                  <div className="doctor-main-info">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="doctor-avatar"
                    />

                    <div className="doctor-name-block">
                      <span className="doctor-name">{doctor.name}</span>
                    </div>
                  </div>

                  <div className="doctor-meta-block">
                    <span className="meta-label">speciality</span>
                    <span className="meta-value">{doctor.speciality}</span>
                  </div>

                  <div className="doctor-meta-block">
                    <span className="meta-label">Appointment Type</span>
                    <div className="appointment-type-icons">
                      {doctor.appointmentType.includes("irl") && (
                        <span className="type-icon">
                          <FiMapPin />
                        </span>
                      )}

                      {doctor.appointmentType.includes("video") && (
                        <span className="type-icon">
                          <FiVideo />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="doctor-action-block">
                    <span className="meta-label add-label">Add Appointment</span>
                    <button
                      className="add-appointment-btn"
                      type="button"
                      onClick={() => handleAddAppointment(doctor)}
                      disabled={appointments.some((item) => item.id === doctor.id)}
                    >
                      <FiPlusCircle />
                      {appointments.some((item) => item.id === doctor.id)
                        ? "Added"
                        : "Add"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments-message">
                Aucun médecin ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>
        </MotionSection>

        <div className="appointments-footer-bar">
          <div className="appointments-pagination">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index + 1}
                type="button"
                className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
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
              onChange={(event) => handlePageChange(Number(event.target.value))}
            >
              {Array.from({ length: pageCount }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <span>of {pageCount}</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
