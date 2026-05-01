import { FiSearch, FiFilter } from "react-icons/fi";

export default function DoctorFilter({ filterText, onFilterChange, speciality, onSpecialityChange }) {
  const specialities = [
    "All Specialities",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Generalist",
    "Neurologist",
    "Dentist"
  ];

  return (
    <div className="doctor-filter-container">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search doctor by name..." 
          value={filterText}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <div className="filter-select-wrapper">
        <FiFilter className="filter-icon" />
        <select 
          className="filter-select" 
          value={speciality}
          onChange={(e) => onSpecialityChange(e.target.value)}
        >
          {specialities.map(spec => (
            <option key={spec} value={spec === "All Specialities" ? "" : spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
