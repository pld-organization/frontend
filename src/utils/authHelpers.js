export function getRoleDashboardPath(role) {
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }

  if (role === "PATIENT") {
    return "/patient/dashboard";
  }

  return "/";
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (error?.message === "Network Error" || !error?.response) {
    return "Unable to reach the authentication server. If you are running locally, start the app with Vite dev server so the proxy can forward /auth requests.";
  }

  const message = error?.response?.data?.message;

  if (Array.isArray(message) && message.length > 0) {
    return message.join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
