const RESERVATION_BASE_URL = import.meta.env.VITE_RESERVATION_API_URL ?? "https://reservation-service-f8ik.onrender.com";

export const RESERVATION_URL = RESERVATION_BASE_URL;

export const R = {
  CREATE_SCHEDULE:               "/reservation/create-schedule",
  CREATE:                        "/reservation/create",
  CANCEL:          (id)        => `/reservation/cancel/${id}`,
  BY_ID:           (id)        => `/reservation/${id}`,
  BY_DOCTOR:       (doctorId)  => `/reservation/doctor/${doctorId}`,
  BY_PATIENT:      (patientId) => `/reservation/patient/${patientId}`,
  AVAILABLE_SLOTS: (doctorId)  => `/reservation/available/${doctorId}`,
  UPCOMING_DOCTOR:  (id)       => `/reservation/upcoming/doctor/${id}`,
  UPCOMING_PATIENT: (id)       => `/reservation/upcoming/patient/${id}`,
  MEETINGS_DOCTOR:  (id)       => `/reservation/meetings/doctor/${id}`,
  MEETINGS_PATIENT: (id)       => `/reservation/meetings/patient/${id}`,
};