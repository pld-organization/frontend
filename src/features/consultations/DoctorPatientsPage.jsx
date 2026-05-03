import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiSearch,
  FiSliders,
  FiFilter,
  FiGlobe,
  FiMapPin,
  FiChevronDown,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import userApi from "./data/userApi";
import "../../styles/doctor-patients.css";

function aiClass(value = "") {
  if (value.includes("Moderate")) return "risk";
  if (value.includes("Normal")) return "normal";
  return "safe";
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAi, setFilterAi] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Step 1: Récupérer les IDs des patients comme demandé par le leader
        const idsResponse = await userApi.getPatientIds();
        const ids = Array.isArray(idsResponse) ? idsResponse : (idsResponse?.ids || []);

        // Step 2: Récupérer les détails pour chaque patient
        const patientDetails = await Promise.all(
          (ids || []).map(id => userApi.getPatientById(id).catch(err => {
            console.error(`Failed to fetch patient ${id}`, err);
            return null;
          }))
        );

        // Step 3: Formater les données pour le tableau
        const formattedPatients = patientDetails
          .filter(p => p !== null)
          .map(p => ({
            id: p.id || p.userId || p._id,
            name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Unknown",
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A",
            type: p.consultationType || "Online",
            ai: p.aiResult || "No risk detected",
            meeting: p.meetingResult || "—",
            status: p.status || "Pending",
            avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id || p.firstName}`,
          }));

        setPatients(formattedPatients);

        // Fetch doctor name if missing or as verification
        try {
          const dData = await userApi.getDoctorById(user.id);
          if (dData) {
            const fullName = dData.name || dData.fullName || 
                            (`${dData.firstName || ""} ${dData.lastName || ""}`.trim());
            if (fullName) {
              setDoctorName(fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}`);
            }
          }
        } catch (err) {
          console.error("Failed to fetch doctor name", err);
        }
      } catch (err) {
        console.error("Failed to fetch patients", err);
        setError("Erreur lors du chargement des patients.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const matchesAi = filterAi === "All" || p.ai === filterAi;
      const matchesType = filterType === "All" || p.type === filterType;

      return matchesSearch && matchesStatus && matchesAi && matchesType;
    });
  }, [patients, searchTerm, filterStatus, filterAi, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / rowsPerPage));
  const currentItems = filteredPatients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const isFiltered = filterStatus !== "All" || filterAi !== "All" || filterType !== "All";

  return (
    <DashboardShell title="Dashboard" description="Patients">
      <motion.div
        className="doctor-patients-page"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <section className="patients-card">
          <div className="patients-card-header">
            <div>
              <div className="patients-title-row">
                <h2>{doctorName ? `${doctorName}'s Patients` : "Patients List"}</h2>
              </div>
              <p>Manage and track all your patients</p>
            </div>

            <div className="patients-tools">
              <div className="patients-search">
                <FiSearch />
                <input
                  placeholder="Search patient by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div style={{ position: "relative" }}>
                <button
                  className="patients-filter-btn"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <FiSliders />
                  Filter
                  {isFiltered && (
                    <span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', marginLeft: 4 }} />
                  )}
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{ position: "absolute", top: "54px", right: 0, background: "#fff", border: "1px solid #bcdcff", borderRadius: "16px", padding: "24px", width: "280px", boxShadow: "0 10px 30px rgba(36, 144, 234, 0.12)", zIndex: 20 }}
                    >
                      <h4 style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</h4>
                      <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #bcdcff", marginBottom: "20px", fontSize: "14px", outline: "none", background: "#f7fbff", color: "#1e2738", fontWeight: "500" }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <h4 style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Result</h4>
                      <select
                        value={filterAi}
                        onChange={(e) => { setFilterAi(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #bcdcff", marginBottom: "20px", fontSize: "14px", outline: "none", background: "#f7fbff", color: "#1e2738", fontWeight: "500" }}
                      >
                        <option value="All">All Results</option>
                        <option value="No risk detected">No risk detected</option>
                        <option value="Normal result">Normal result</option>
                        <option value="Moderate risk detected">Moderate risk detected</option>
                      </select>

                      <h4 style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>Consultation Type</h4>
                      <select
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #bcdcff", fontSize: "14px", outline: "none", background: "#f7fbff", color: "#1e2738", fontWeight: "500" }}
                      >
                        <option value="All">All Types</option>
                        <option value="IRL">IRL</option>
                        <option value="Online">Online</option>
                      </select>

                      <button
                        onClick={() => { setFilterStatus("All"); setFilterAi("All"); setFilterType("All"); setCurrentPage(1); setShowFilterMenu(false); }}
                        style={{ marginTop: "24px", width: "100%", padding: "12px", background: "#eff6ff", border: "1px solid #bcdcff", borderRadius: "12px", color: "#2490ea", cursor: "pointer", fontWeight: "700", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.target.style.background = "#2490ea"; e.target.style.color = "#fff"; }}
                        onMouseLeave={(e) => { e.target.style.background = "#eff6ff"; e.target.style.color = "#2490ea"; }}
                      >
                        Reset Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="patients-status-legend">
            <span>
              <i className="dot completed" /> Completed
            </span>
            <span>
              <i className="dot pending" /> Pending
            </span>
          </div>

          <div className="patients-table">
            <div className="patients-table-body">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>Chargement des patients...</div>
                ) : error ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error}</div>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="patients-row"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="data-block">
                        <span className="data-label">Date</span>
                        <div className="patient-date">{item.date}</div>
                      </div>

                      <div className="data-block">
                        <span className="data-label">Patient</span>
                        <div className="patient-name-cell">
                          <img src={item.avatar} alt={item.name} className="patient-avatar-img" />
                          <strong>{item.name}</strong>
                        </div>
                      </div>

                      <div className="data-block">
                        <span className="data-label">Type</span>
                        <div className="patient-type">
                          {item.type === "Online" ? <FiGlobe /> : <FiMapPin />}
                          <span>{item.type}</span>
                        </div>
                      </div>

                      <div className="data-block">
                        <span className="data-label">AI Analysis Result</span>
                        <div>
                          <span className={`ai-pill ${aiClass(item.ai)}`}>
                            {item.ai}
                          </span>
                        </div>
                      </div>

                      <div className="data-block">
                        <span className="data-label">Meeting Result</span>
                        <div className="meeting-result">{item.meeting}</div>
                      </div>

                      <div className="data-block">
                        <span className="data-label">Status</span>
                        <div>
                          <span
                            className={`patient-status ${item.status.toLowerCase()}`}
                          >
                            <i />
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="patient-action">
                        <button
                          className="patient-view-btn"
                          onClick={() => navigate(`/doctor/consultation?patientId=${item.id}`)}
                        >
                          Start Consultation
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
                    No patients match your search or filters.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="patients-footer">
            <div className="patients-pagination">
              <button
                className="text-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <FiArrowLeft /> Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-num ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="text-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
              >
                Next <FiArrowRight />
              </button>
            </div>

            <div className="patients-page-info">
              <span>Rows per page</span>
              <button onClick={() => {
                const options = [4, 8, 12];
                const currentIndex = options.indexOf(rowsPerPage);
                const nextValue = options[(currentIndex + 1) % options.length];
                setRowsPerPage(nextValue);
                setCurrentPage(1);
              }}>
                {rowsPerPage} <FiChevronDown />
              </button>
              <span>
                {filteredPatients.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, filteredPatients.length)} of {filteredPatients.length}
              </span>
            </div>
          </div>
        </section>
      </motion.div>
    </DashboardShell>
  );
}