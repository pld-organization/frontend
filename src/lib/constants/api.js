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
    LIST: "/auth/patients",
    BY_ID: (id) => `/auth/patient/${id}`,
    PROFILE: "/auth/patients/profile",
  },

  DOCTORS: {
    LIST: "/auth/doctors",
    BY_ID: (id) => `/auth/doctor/${id}`,
    AVAILABLE: "/auth/doctors/available",
    ALL_IDS: "/auth/doctors/ids",
    BY_ID_AUTH: (id) => `/auth/doctor/${id}`,
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