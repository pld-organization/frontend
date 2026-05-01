function AuthButton({ children, className = "", type = "button", ...props }) {
  return (
    <button className={`auth-button ${className}`.trim()} type={type} {...props}>
      {children}
    </button>
  );
}

export default AuthButton;
