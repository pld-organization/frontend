import React from "react";
import "../../styles/BloodAnalysis.css";

export default function BloodAnalysis() {
  return (
    <div className="blood-analysis-container">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="logo-section">
          <h1 className="logo-title">Curator Pro</h1>
          <p className="logo-subtitle">Clinical Diagnostics</p>
        </div>

        <nav className="nav-menu">
          {[
            { label: "Dashboard", icon: "grid_view" },
            { label: "Analyses", icon: "biotech" },
            { label: "Health trends", icon: "timeline" },
            { label: "Patient history", icon: "history" },
            { label: "Settings", icon: "settings" },
          ].map(({ label, icon }) => (
            <a
              key={label}
              href="#"
              className={`nav-item ${label === "Analyses" ? "active" : ""}`}
            >
              <span className="material-symbols-outlined nav-icon">{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        <button className="start-analysis-btn">Start analysis</button>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <span className="header-brand">Clinical Curator</span>
            <div className="search-box">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                className="search-input"
                placeholder="Search patient ID..."
              />
            </div>
          </div>

          <div className="header-right">
            <span className="material-symbols-outlined header-icon">
              notifications
            </span>
            <span className="material-symbols-outlined header-icon">
              help_outline
            </span>
            <div className="user-info">
              <div className="user-details">
                <p className="user-name">Dr. Julian Vance</p>
                <p className="user-role">Chief Clinician</p>
              </div>
              <div className="user-avatar">JV</div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="body-container">
          <h2 className="page-title">Blood analysis report</h2>
          <p className="page-subtitle">
            Patient ID: PT-00482 · Collected 18 Apr 2026 · Dr. Julian Vance
          </p>

          {/* Stat cards */}
          <div className="stats-grid">
            <StatCard
              label="Hemoglobin"
              value="11.2"
              unit="g/dL"
              delta="Below range"
              deltaColor="red"
              valueColor="red"
            />
            <StatCard
              label="Glucose"
              value="128"
              unit="mg/dL"
              delta="Above range"
              deltaColor="amber"
              valueColor="amber"
            />
            <StatCard
              label="Cholesterol"
              value="185"
              unit="mg/dL"
              delta="Normal"
              deltaColor="blue"
              valueColor="blue"
            />
            <StatCard
              label="Risk score"
              value="2/5"
              unit=""
              delta="Low–moderate"
              deltaColor="slate"
              valueColor="slate"
            />
          </div>

          {/* Table card */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Hematology &amp; metabolic panel</h3>
              <span className="table-badge">3 parameters</span>
            </div>

            <table className="data-table">
              <thead className="table-head">
                <tr>
                  {["Parameter", "Result", "Reference range", "Visual", "Status"].map(
                    (h) => (
                      <th key={h} className="table-header-cell">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                <Row
                  name="Hemoglobin"
                  result="11.2 g/dL"
                  range="13.5 – 17.5"
                  pct={52}
                  barColor="red"
                  status="Low"
                  statusType="low"
                />
                <Row
                  name="Glucose"
                  result="128 mg/dL"
                  range="70 – 99"
                  pct={85}
                  barColor="amber"
                  status="High"
                  statusType="high"
                />
                <Row
                  name="Cholesterol"
                  result="185 mg/dL"
                  range="< 200"
                  pct={62}
                  barColor="blue"
                  status="Normal"
                  statusType="normal"
                />
              </tbody>
            </table>
          </div>

          {/* Insights */}
          <div className="insights-grid">
            <Insight
              title="Microcytic anemia"
              text="Low hemoglobin suggests possible iron deficiency. Consider CBC with ferritin."
              type="red"
              icon="warning"
            />
            <Insight
              title="High glucose"
              text="Pre-diabetic range detected. Fasting retest and HbA1c recommended."
              type="amber"
              icon="error"
            />
            <Insight
              title="Healthy cholesterol"
              text="Lipid profile is within normal range. No intervention needed at this time."
              type="blue"
              icon="check_circle"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, unit, delta, deltaColor, valueColor }) {
  const getValueClass = () => {
    switch (valueColor) {
      case "red":
        return "stat-value-red";
      case "amber":
        return "stat-value-amber";
      case "blue":
        return "stat-value-blue";
      default:
        return "stat-value-slate";
    }
  };

  const getDeltaClass = () => {
    switch (deltaColor) {
      case "red":
        return "stat-delta-red";
      case "amber":
        return "stat-delta-amber";
      case "blue":
        return "stat-delta-blue";
      default:
        return "stat-delta-slate";
    }
  };

  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className={`stat-value ${getValueClass()}`}>
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>
      <p className={`stat-delta ${getDeltaClass()}`}>{delta}</p>
    </div>
  );
}

function Row({ name, result, range, pct, barColor, status, statusType }) {
  const getBarClass = () => {
    switch (barColor) {
      case "red":
        return "progress-bar-red";
      case "amber":
        return "progress-bar-amber";
      default:
        return "progress-bar-blue";
    }
  };

  const getStatusClass = () => {
    switch (statusType) {
      case "low":
        return "status-badge-low";
      case "high":
        return "status-badge-high";
      default:
        return "status-badge-normal";
    }
  };

  const getDotClass = () => {
    switch (statusType) {
      case "low":
        return "status-dot-red";
      case "high":
        return "status-dot-amber";
      default:
        return "status-dot-blue";
    }
  };

  return (
    <tr className="table-row">
      <td className="table-cell table-cell-name">{name}</td>
      <td className="table-cell table-cell-result">{result}</td>
      <td className="table-cell table-cell-range">{range}</td>
      <td className="table-cell">
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill ${getBarClass()}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="progress-percentage">{pct}%</span>
        </div>
      </td>
      <td className="table-cell">
        <span className={`status-badge ${getStatusClass()}`}>
          <span className={`status-dot ${getDotClass()}`} />
          {status}
        </span>
      </td>
    </tr>
  );
}

function Insight({ title, text, type, icon }) {
  const getCardClass = () => {
    switch (type) {
      case "red":
        return "insight-red";
      case "amber":
        return "insight-amber";
      default:
        return "insight-blue";
    }
  };

  const getIconWrapperClass = () => {
    switch (type) {
      case "red":
        return "insight-icon-red";
      case "amber":
        return "insight-icon-amber";
      default:
        return "insight-icon-blue";
    }
  };

  const getIconTextClass = () => {
    switch (type) {
      case "red":
        return "insight-icon-text-red";
      case "amber":
        return "insight-icon-text-amber";
      default:
        return "insight-icon-text-blue";
    }
  };

  const getTitleClass = () => {
    switch (type) {
      case "red":
        return "insight-title-red";
      case "amber":
        return "insight-title-amber";
      default:
        return "insight-title-blue";
    }
  };

  const getTextClass = () => {
    switch (type) {
      case "red":
        return "insight-text-red";
      case "amber":
        return "insight-text-amber";
      default:
        return "insight-text-blue";
    }
  };

  return (
    <div className={`insight-card ${getCardClass()}`}>
      <div className={`insight-icon-wrapper ${getIconWrapperClass()}`}>
        <span className={`material-symbols-outlined insight-icon ${getIconTextClass()}`}>
          {icon}
        </span>
      </div>
      <h4 className={`insight-title ${getTitleClass()}`}>{title}</h4>
      <p className={`insight-text ${getTextClass()}`}>{text}</p>
    </div>
  );
}