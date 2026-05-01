import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "../../styles/doctor-schedule.css";

void motion;

const initialAppointments = [
  { id: 1, date: 20, startHour: 8, duration: 1.5, name: "Meziani Lamia", type: "IRL", status: "confirmed" },
  { id: 2, date: 20, startHour: 13, duration: 1.5, name: "Djezzar Youcef", type: "IRL", status: "pending" },
  { id: 3, date: 21, startHour: 9, duration: 1, name: "Benali Amine", type: "Online", status: "confirmed" },
  { id: 4, date: 21, startHour: 15, duration: 2, name: "Karim Mansouri", type: "IRL", status: "cancelled" },
  { id: 5, date: 14, startHour: 10, duration: 1, name: "Nadia Boudiaf", type: "Online", status: "confirmed" },
  { id: 6, date: 16, startHour: 11, duration: 0.5, name: "Samir Meziane", type: "IRL", status: "confirmed" },
];

export default function DoctorSchedulePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Day");
  const [selectedDay, setSelectedDay] = useState(20);
  const [direction, setDirection] = useState(0);
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleNextDay = () => {
    setDirection(1);
    setSelectedDay(prev => Math.min(30, prev + 1));
  };

  const handlePrevDay = () => {
    setDirection(-1);
    setSelectedDay(prev => Math.max(1, prev - 1));
  };

  const handleSelectDay = (day) => {
    if (day !== selectedDay) {
      setDirection(day > selectedDay ? 1 : -1);
      setSelectedDay(day);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to cancel/remove this appointment?")) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  // Calendar logic for April 2026 (Starts on Wed, 30 days)
  const calendarDays = useMemo(() => {
    const days = [];
    // Previous month (March 2026 ending days: Sun 29, Mon 30, Tue 31)
    days.push({ day: 29, currentMonth: false }, { day: 30, currentMonth: false }, { day: 31, currentMonth: false });
    
    // April days
    for (let i = 1; i <= 30; i++) {
      // Find what statuses exist on this day
      const dayAppts = appointments.filter(a => a.date === i);
      let status = null;
      if (dayAppts.length > 0) {
        if (dayAppts.some(a => a.status === 'cancelled')) status = 'cancelled';
        if (dayAppts.some(a => a.status === 'pending')) status = 'pending';
        if (dayAppts.some(a => a.status === 'confirmed')) status = 'confirmed'; // Prioritize confirmed visually if mixed
      }
      days.push({ day: i, currentMonth: true, status });
    }
    
    // Next month (May 2026 starting days)
    days.push({ day: 1, currentMonth: false }, { day: 2, currentMonth: false });
    
    return days;
  }, [appointments]);

  const selectedAppointments = useMemo(() => {
    return appointments.filter(a => a.date === selectedDay).sort((a, b) => a.startHour - b.startHour);
  }, [appointments, selectedDay]);

  const todayStats = useMemo(() => {
    if (selectedAppointments.length === 0) {
      return { first: "—", last: "—", duration: "0h 00m" };
    }
    
    const first = selectedAppointments[0].startHour;
    const lastAppt = selectedAppointments[selectedAppointments.length - 1];
    const last = lastAppt.startHour;
    
    const totalHours = selectedAppointments.reduce((sum, app) => sum + app.duration, 0);
    
    const formatTime = (hour) => {
      const h = Math.floor(hour);
      const m = (hour % 1) * 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return `${formattedH.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'} ${ampm}`;
    };

    const h = Math.floor(totalHours);
    const m = (totalHours % 1) * 60;

    return {
      first: formatTime(first),
      last: formatTime(last),
      duration: `${h}h ${m === 0 ? '00' : '30'}m`
    };
  }, [selectedAppointments]);

  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const getDayName = (day) => {
    // April 2026: 1st is Wednesday.
    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const offset = 3; // April 1 is Wednesday (index 3)
    const index = (day - 1 + offset) % 7;
    return daysArr[index];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" }
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" }
    }),
  };

  return (
    <DashboardShell title="Schedule" description="Dashboard > Schedule">
      <motion.div
        className="doctor-schedule-page"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="schedule-header-row">
          <div>
            <h2>My Schedule</h2>
            <p>Manage your appointments and availability</p>
          </div>
          <button 
            className="set-availability-btn"
            onClick={() => navigate("/set-availability")}
          >
            <FiCalendar />
            Set Availability
          </button>
        </div>

        <div className="schedule-layout">
          {/* LEFT COLUMN */}
          <motion.div 
            className="schedule-left-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="calendar-widget-card" variants={itemVariants}>
              <div className="calendar-widget-header">
                <h3>April 2026</h3>
                <div className="calendar-widget-nav">
                  <button><FiChevronLeft /></button>
                  <button><FiChevronRight /></button>
                </div>
              </div>

              <div className="calendar-widget-grid">
                <div className="day-name">SUN</div>
                <div className="day-name">MON</div>
                <div className="day-name">TUE</div>
                <div className="day-name">WED</div>
                <div className="day-name">THU</div>
                <div className="day-name">FRI</div>
                <div className="day-name">SAT</div>

                {calendarDays.map((d, index) => (
                  <motion.div 
                    key={index} 
                    className={`calendar-day ${d.currentMonth ? 'current' : 'muted'} ${d.day === selectedDay && d.currentMonth ? 'selected' : ''}`}
                    onClick={() => {
                      if (d.currentMonth) handleSelectDay(d.day);
                    }}
                    whileHover={d.currentMonth && d.day !== selectedDay ? { scale: 1.1, backgroundColor: "#f1f5f9" } : {}}
                    whileTap={d.currentMonth ? { scale: 0.95 } : {}}
                  >
                    <span>{d.day}</span>
                    {d.status === 'confirmed' && <motion.i initial={{scale:0}} animate={{scale:1}} className="status-dot green"></motion.i>}
                    {d.status === 'pending' && <motion.i initial={{scale:0}} animate={{scale:1}} className="status-dot orange"></motion.i>}
                    {d.status === 'cancelled' && <motion.i initial={{scale:0}} animate={{scale:1}} className="status-dot red"></motion.i>}
                  </motion.div>
                ))}
              </div>

              <div className="calendar-legend">
                <span><i className="status-dot green"></i> Confirmed</span>
                <span><i className="status-dot orange"></i> Pending</span>
                <span><i className="status-dot red"></i> Cancelled</span>
              </div>
            </motion.div>

            <motion.div className="today-overview-card" variants={itemVariants}>
              <div className="today-overview-header">
                <div className="icon-wrap"><FiClock /></div>
                <h3>Day Overview</h3>
              </div>
              
              <div className="overview-row">
                <span className="overview-label">First appointment</span>
                <span className="overview-value">{todayStats.first}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Last appointment</span>
                <span className="overview-value">{todayStats.last}</span>
              </div>
              <div className="overview-row">
                <span className="overview-label">Total duration</span>
                <span className="overview-value">{todayStats.duration}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div 
            className="schedule-right-col"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="day-view-card" variants={itemVariants}>
              <div className="day-view-header">
                <div className="date-nav">
                  <button onClick={handlePrevDay}><FiChevronLeft /></button>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.h3
                      key={selectedDay}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      {getDayName(selectedDay)}, April {selectedDay}, 2026
                    </motion.h3>
                  </AnimatePresence>
                  <button onClick={handleNextDay}><FiChevronRight /></button>
                </div>

                <div className="view-toggle">
                  <button className={activeTab === 'Day' ? 'active' : ''} onClick={() => setActiveTab('Day')}>Day</button>
                  <button className={activeTab === 'List' ? 'active' : ''} onClick={() => setActiveTab('List')}>List</button>
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div 
                  key={`${selectedDay}-${activeTab}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {activeTab === "Day" ? (
                    <div className="timeline-container">
                      <div className="timeline-grid">
                        {hours.map((hour) => (
                          <div key={hour} className="timeline-row">
                            <div className="time-label">{hour}</div>
                            <div className="time-line"></div>
                          </div>
                        ))}
                        
                        <AnimatePresence>
                          {selectedAppointments.map(app => {
                            const top = (app.startHour - 8) * 72;
                            const height = app.duration * 72;
                            
                            let colorClass = "blue";
                            if (app.status === "pending") colorClass = "orange";
                            if (app.status === "cancelled") colorClass = "red";
                            if (app.status === "confirmed" && app.startHour > 12) colorClass = "green"; 

                            return (
                              <motion.div 
                                key={app.id}
                                className={`appointment-block ${colorClass}`} 
                                style={{ top: `${top + 16}px`, height: `${height - 12}px` }}
                                initial={{ opacity: 0, scaleY: 0.8, transformOrigin: "top" }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25 }}
                                whileHover={{ scale: 1.01, zIndex: 10 }}
                              >
                                <div className="block-info">
                                  <h4>{app.name}</h4>
                                  <p>{app.type} • {app.status}</p>
                                </div>
                                <div className="block-actions">
                                  <button><FiUser /></button>
                                  <button><FiEdit2 /></button>
                                  <button onClick={() => handleDelete(app.id)}><FiTrash2 /></button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  ) : (
                    // LIST VIEW
                    <div style={{ marginTop: "24px" }}>
                      {selectedAppointments.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                          No appointments for this day.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <AnimatePresence>
                            {selectedAppointments.map((app, i) => (
                              <motion.div 
                                key={app.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ delay: i * 0.05 }}
                                style={{ padding: "16px", border: "1px solid #f1f5f9", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              >
                                <div>
                                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#0f172a" }}>{app.name}</h4>
                                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                                    {Math.floor(app.startHour)}:00 - {Math.floor(app.startHour + app.duration)}:{app.duration % 1 === 0 ? '00' : '30'} • {app.type}
                                  </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }} onClick={() => handleDelete(app.id)}>Cancel</button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}
