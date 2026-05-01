function AuthInput({ label, id, error, className = "", ...props }) {
  return (
    <label className={`auth-input ${className}`.trim()} htmlFor={id}>
      {label && <span>{label}</span>}
      <input id={id} {...props} />
      {error && <small className="auth-input-error">{error}</small>}
    </label>
  );
}

export default AuthInput;
