export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://authservice-version-90.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
  },

  PATIENTS: {
    LIST: "/patients",
    BY_ID: (id) => `/patients/${id}`,
    PROFILE: "/patients/profile",
  },

  DOCTORS: {
    LIST: "/doctors",
    BY_ID: (id) => `/doctors/${id}`,
    AVAILABLE: "/doctors/available",
  },

  APPOINTMENTS: {
    LIST: "/appointments",
    MY: "/appointments/my",
    CREATE: "/appointments",
    BY_ID: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    DELETE: (id) => `/appointments/${id}`,
  },

  CONSULTATIONS: {
    LIST: "/consultations",
    CREATE: "/consultations",
    BY_ID: (id) => `/consultations/${id}`,
  },

  ANALYSIS: {
    PREDICT: "/analysis/predict",
    MY_ANALYSES: "/analysis/my",
    BY_ID: (id) => `/analysis/${id}`,
    UPLOAD: "/analysis/upload",
  },
};
