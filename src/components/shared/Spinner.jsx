import "../../styles/shared-components.css";

export default function Spinner({ size = "md", message }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}
