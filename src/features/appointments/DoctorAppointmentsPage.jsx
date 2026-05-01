import { useState, useMemo } from "react";
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
} from "react-icons/fi";
import "../../styles/doctor-appointments.css";

void motion;

const initialAppointments = [
  { id: 1, time: "08:00", patient: "Salmi Ahmed", type: "IRL", status: "Completed", action: "View" },
  { id: 2, time: "08:30", patient: "Amina Boudjemaa", type: "IRL", status: "Cancelled", action: "View" },
  { id: 3, time: "09:00", patient: "Nabil Haddad", type: "Online", status: "Confirmed", action: "Join" },
  { id: 4, time: "09:30", patient: "Walid Benkhaled", type: "IRL", status: "Pending", action: "Start" },
  { id: 5, time: "10:00", patient: "Yousra Amrani", type: "Online", status: "Confirmed", action: "Join" },
  { id: 6, time: "10:30", patient: "Karim Ziani", type: "IRL", status: "Pending", action: "Start" },
  { id: 7, time: "11:00", patient: "Lydia Mansouri", type: "Online", status: "Pending", action: "Start" },
  { id: 8, time: "11:30", patient: "Fouad Belaid", type: "IRL", status: "Pending", action: "Start" },
];

export default function DoctorAppointmentsPage() {
  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  
  // Filter states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  // Pagination / Load More
  const [displayCount, setDisplayCount] = useState(4);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDisplayCount(4); // Reset pagination on search
  };

  const handleActionClick = (id) => {
    setAppointmentsList((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          if (app.action === "Start" || app.action === "Join") {
            return { ...app, status: "In Progress", action: "Finish" };
          }
          if (app.action === "Finish") {
            return { ...app, status: "Completed", action: "View" };
          }
        }
        return app;
      })
    );
  };

  const handleCancel = (id) => {
    setAppointmentsList((prev) =>
      prev.map((app) => {
        if (app.id === id && app.status !== "Completed" && app.status !== "Cancelled") {
          return { ...app, status: "Cancelled", action: "View" };
        }
        return app;
      })
    );
    setShowDropdown(null);
  };

  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((app) => {
      const matchesSearch = app.patient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "All" || app.type === filterType;
      const matchesStatus = filterStatus === "All" || app.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [appointmentsList, searchTerm, filterType, filterStatus]);

  const displayedAppointments = filteredAppointments.slice(0, displayCount);
  const hasMore = displayCount < filteredAppointments.length;

  const stats = useMemo(() => {
    const total = appointmentsList.length;
    const confirmed = appointmentsList.filter(a => a.status === "Confirmed" || a.status === "In Progress").length;
    const pending = appointmentsList.filter(a => a.status === "Pending").length;
    const cancelled = appointmentsList.filter(a => a.status === "Cancelled").length;

    return [
      { title: "Total Appointments", value: total < 10 ? `0${total}` : total, icon: <FiCalendar />, color: "blue", sub: "Today" },
      { title: "Confirmed", value: confirmed < 10 ? `0${confirmed}` : confirmed, icon: <FiCheckCircle />, color: "green", sub: "Today" },
      { title: "Pending", value: pending < 10 ? `0${pending}` : pending, icon: <FiClock />, color: "orange", sub: "Today" },
      { title: "Cancelled", value: cancelled < 10 ? `0${cancelled}` : cancelled, icon: <FiXCircle />, color: "red", sub: "Today" },
    ];
  }, [appointmentsList]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  return (
    <DashboardShell title="Dashboard" description="Appointments">
      <div className="doctor-appointments-page">
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
                June 19, 2026
              </div>
            </div>
          </div>

          <button className="doctor-date-btn">
            <FiCalendar />
            June 19, 2026
            <FiChevronDown />
          </button>
        </motion.div>

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

        <motion.section
          className="doctor-appointments-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
        >
          <div className="appointments-card-top">
            <div>
              <h3>Today's Appointments</h3>
              <p>Monday, June 19, 2026</p>
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
                   <span style={{width: 8, height: 8, background: '#2388ff', borderRadius: '50%', marginLeft: 4}} />
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

          <div className="appointments-table">
            <div className="appointments-table-head">
              <span>Time ↕</span>
              <span>Patient ↕</span>
              <span>Type</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div className="appointments-table-body">
              <AnimatePresence mode="popLayout">
                {displayedAppointments.length > 0 ? (
                  displayedAppointments.map((item) => (
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
                        <span className="row-icon">
                          <FiClock />
                        </span>
                        <strong>{item.time}</strong>
                      </div>

                      <div className="appointment-patient">
                        <span className="row-icon">
                          <FiUser />
                        </span>
                        <strong>{item.patient}</strong>
                      </div>

                      <div className="appointment-type">
                        {item.type === "Online" ? <FiGlobe /> : <FiMapPin />}
                        <span style={{ marginLeft: "8px" }}>{item.type}</span>
                      </div>

                      <div>
                        <span
                          className={`appointment-status ${item.status.toLowerCase().replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="appointment-action" style={{ position: "relative" }}>
                        <button 
                          className={`action-btn ${item.action.toLowerCase()}`}
                          onClick={() => handleActionClick(item.id)}
                        >
                          {item.action === "Join" && <FiVideo />}
                          {item.action === "Start" && <FiPlay />}
                          {item.action === "View" && <FiEye />}
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
                              style={{ position: 'absolute', top: '45px', right: '0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: "160px" }}
                            >
                              <button 
                                onClick={() => handleCancel(item.id)}
                                disabled={item.status === "Cancelled" || item.status === "Completed"}
                                style={{ display: 'block', width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', color: item.status === "Cancelled" || item.status === "Completed" ? '#cbd5e1' : '#e92735', cursor: item.status === "Cancelled" || item.status === "Completed" ? 'not-allowed' : 'pointer', fontWeight: '600', textAlign: 'left' }}
                              >
                                Cancel Appointment
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#8c8c8c", fontSize: "15px" }}>
                    No appointments match your filters.
                  </div>
                )}
              </AnimatePresence>
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
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Load More <FiChevronDown />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </DashboardShell>
  );
}
