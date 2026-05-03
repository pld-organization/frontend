import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../../components/shared/Spinner";
import EmptyState from "../../components/shared/EmptyState";
import DoctorFilter from "./DoctorFilter";
import DoctorCard from "./DoctorCard";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../lib/constants/api";
import { FiUsers, FiCheckCircle } from "react-icons/fi";
import "../../styles/available-doctors.css";

export default function AvailableDoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get(API_ENDPOINTS.DOCTORS.AVAILABLE);
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load available doctors.");
    } finally {
      setLoading(false);
    }
  }

  // Called by DoctorCard after a successful reservation
  function handleBookingSuccess(reservation) {
    setSuccessMessage("Your appointment has been successfully booked!");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => navigate("/schedule"), 3000);
  }

  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = `${doc.firstName} ${doc.lastName}`
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const specMatch = speciality ? doc.speciality === speciality : true;
    return nameMatch && specMatch;
  });

  return (
    <div className="available-doctors-page">
      {successMessage && (
        <div className="success-banner">
          <FiCheckCircle size={24} />
          <div>
            <h4>Success!</h4>
            <p>{successMessage}</p>
            <p className="redirect-text">Redirecting to your schedule…</p>
          </div>
        </div>
      )}

      <div className="filters-section">
        <DoctorFilter
          filterText={filterText}
          onFilterChange={setFilterText}
          speciality={speciality}
          onSpecialityChange={setSpeciality}
        />
      </div>

      {loading ? (
        <Spinner message="Searching for available doctors…" />
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDoctors}>
            Retry
          </button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          icon={<FiUsers size={48} />}
          title="No doctors found"
          description="Try adjusting your filters or search term."
          action={
            <button
              className="btn btn-secondary"
              onClick={() => { setFilterText(""); setSpeciality(""); }}
            >
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onBook={handleBookingSuccess} />
          ))}
        </div>
      )}
    </div>
  );
}