export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://authservice-version-90.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
    COMPLETE_PROFILE: "/auth/complete-profile",
    GOOGLE: "/auth/google",
    GOOGLE_MOBILE: "/auth/google/mobile",
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
    ALL_IDS: "/auth/doctors/ids",
    BY_ID_AUTH: (id) => `/auth/doctor/${id}`,
  },

  RESERVATION: {
    CREATE_SCHEDULE:               "/reservation/create-schedule",
    CREATE:                        "/reservation/create",
    CANCEL:       (id)          => `/reservation/cancel/${id}`,
    BY_ID:        (id)          => `/reservation/${id}`,
    BY_DOCTOR:    (doctorId)    => `/reservation/doctor/${doctorId}`,
    BY_PATIENT:   (patientId)   => `/reservation/patient/${patientId}`,
    AVAILABLE_SLOTS: (doctorId) => `/reservation/available/${doctorId}`,
    UPCOMING_DOCTOR:  (id)      => `/reservation/upcoming/doctor/${id}`,
    UPCOMING_PATIENT: (id)      => `/reservation/upcoming/patient/${id}`,
    MEETINGS_DOCTOR:  (id)      => `/reservation/meetings/doctor/${id}`,
    MEETINGS_PATIENT: (id)      => `/reservation/meetings/patient/${id}`,
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
