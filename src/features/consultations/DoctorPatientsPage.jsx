import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import "../../styles/doctor-patients.css";

void motion;

const initialPatients = [
  {
    id: 1,
    date: "27 Dec, 2025",
    name: "Ahmed Benali",
    type: "Online",
    ai: "No risk detected",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    date: "03 Feb, 2026",
    name: "Yasmine Bensalem",
    type: "IRL",
    ai: "Normal result",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    date: "02 Mar, 2026",
    name: "Mohamed Khelifi",
    type: "Online",
    ai: "Moderate risk detected",
    meeting: "Diagnosis confirmed",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    date: "02 Mar, 2026",
    name: "Lina Haddad",
    type: "IRL",
    ai: "Normal result",
    meeting: "Additional tests",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 5,
    date: "02 Mar, 2026",
    name: "Samir Meziane",
    type: "IRL",
    ai: "Moderate risk detected",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 6,
    date: "02 Mar, 2026",
    name: "Nadia Boudiaf",
    type: "Online",
    ai: "Moderate risk detected",
    meeting: "Diagnosis confirmed",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 7,
    date: "02 Mar, 2026",
    name: "Karim Mansouri",
    type: "IRL",
    ai: "Normal result",
    meeting: "Treatment recommended",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 8,
    date: "02 Mar, 2026",
    name: "Dania Bouroubi",
    type: "Online",
    ai: "No risk detected",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 9,
    date: "05 Mar, 2026",
    name: "Walid Ziani",
    type: "IRL",
    ai: "Moderate risk detected",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 10,
    date: "06 Mar, 2026",
    name: "Amira Tahar",
    type: "Online",
    ai: "Normal result",
    meeting: "Follow up",
    status: "Completed",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1b4492?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 11,
    date: "07 Mar, 2026",
    name: "Sofiane Brahimi",
    type: "IRL",
    ai: "No risk detected",
    meeting: "—",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=100&q=80",
  }
];

function aiClass(value) {
  if (value.includes("Moderate")) return "risk";
  if (value.includes("Normal")) return "normal";
  return "safe";
}

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAi, setFilterAi] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPatients = useMemo(() => {
    return initialPatients.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const matchesAi = filterAi === "All" || p.ai === filterAi;
      const matchesType = filterType === "All" || p.type === filterType;
      
      return matchesSearch && matchesStatus && matchesAi && matchesType;
    });
  }, [searchTerm, filterStatus, filterAi, filterType]);

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
                <h2>Patients List</h2>
                <FiFilter className="title-filter-icon" />
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
                      style={{ position: "absolute", top: "54px", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", width: "260px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 20 }}
                    >
                      <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>Status</h4>
                      <select 
                        value={filterStatus} 
                        onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px", fontSize: "14px", outline: "none", background: "#f8fafc" }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>AI Result</h4>
                      <select 
                        value={filterAi} 
                        onChange={(e) => { setFilterAi(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px", fontSize: "14px", outline: "none", background: "#f8fafc" }}
                      >
                        <option value="All">All Results</option>
                        <option value="No risk detected">No risk detected</option>
                        <option value="Normal result">Normal result</option>
                        <option value="Moderate risk detected">Moderate risk detected</option>
                      </select>

                      <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>Consultation Type</h4>
                      <select 
                        value={filterType} 
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#f8fafc" }}
                      >
                        <option value="All">All Types</option>
                        <option value="IRL">IRL</option>
                        <option value="Online">Online</option>
                      </select>

                      <button 
                        onClick={() => { setFilterStatus("All"); setFilterAi("All"); setFilterType("All"); setCurrentPage(1); setShowFilterMenu(false); }}
                        style={{ marginTop: "20px", width: "100%", padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "8px", color: "#475569", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}
                        onMouseEnter={(e) => e.target.style.background = "#e2e8f0"}
                        onMouseLeave={(e) => e.target.style.background = "#f1f5f9"}
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
            <div className="patients-table-head">
              <span>DATE ↑</span>
              <span>PATIENT</span>
              <span>TYPE</span>
              <span>AI ANALYSIS RESULT</span>
              <span>MEETING RESULT</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>

            <div className="patients-table-body">
              <AnimatePresence mode="popLayout">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="patients-row"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                    >
                      <div className="patient-date">{item.date}</div>

                      <div className="patient-name-cell">
                        <img src={item.avatar} alt={item.name} className="patient-avatar-img" />
                        <strong>{item.name}</strong>
                      </div>

                      <div className="patient-type">
                        {item.type === "Online" ? <FiGlobe /> : <FiMapPin />}
                        <span>{item.type}</span>
                      </div>

                      <div>
                        <span className={`ai-pill ${aiClass(item.ai)}`}>
                          {item.ai}
                        </span>
                      </div>

                      <div className="meeting-result">{item.meeting}</div>

                      <div>
                        <span
                          className={`patient-status ${item.status.toLowerCase()}`}
                        >
                          <i />
                          {item.status}
                        </span>
                      </div>

                      <div className="patient-action">
                        <button className="patient-view-btn">
                          View Profile
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
