function RoleCard({ title, description, image, selected, className = "", ...props }) {
  return (
    <button
      className={`role-card ${selected ? "is-selected" : ""} ${className}`.trim()}
      type="button"
      {...props}
    >
      {image && <img src={image} alt="" />}
      <span>{title}</span>
      {description && <small>{description}</small>}
    </button>
  );
}

export default RoleCard;
