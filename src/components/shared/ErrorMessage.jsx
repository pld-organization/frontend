function ErrorMessage({ message, children }) {
  const content = message || children;

  if (!content) {
    return null;
  }

  return <p className="error-message">{content}</p>;
}

export default ErrorMessage;
