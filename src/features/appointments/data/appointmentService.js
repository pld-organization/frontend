import { getStoredAccessToken } from "../../../services/authStorage"; 
import { R, RESERVATION_URL } from "./reservationEndpoints";
import { API_ENDPOINTS, API_BASE_URL } from "../../../lib/constants/api"; // adjust path if needed


const BASE_URL = RESERVATION_URL;


function authHeaders() {
  const token = getStoredAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw Object.assign(new Error(error.message ?? "Request failed"), {
      response: { status: res.status, data: error },
    });
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

/** Fetch patient profile via Vite proxy (dev) or direct (prod) — avoids CORS. */
export async function getPatientById(patientId) {
  const token = getStoredAccessToken();
  const res = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.PATIENTS.BY_ID(patientId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error("Patient not found");
  return res.json(); // { firstName, lastName, ... }
}

export async function getPatientAppointments(patientId) {
  return apiFetch(R.BY_PATIENT(patientId));
}

export async function createAppointment({ doctorId, patientId, reservationDay, reservationTime, reason = "" }) {
  return apiFetch(R.CREATE, {
    method: "POST",
    body: JSON.stringify({ doctorId, patientId, reservationDay, reservationTime, reason }),
  });
}

export async function cancelAppointment(reservationId) {
  return apiFetch(R.CANCEL(reservationId), { method: "POST" });
}

export async function getPatientMeetingUrls(patientId) {
  return apiFetch(R.MEETINGS_PATIENT(patientId));
}

export async function getPatientUpcomingMeetings(patientId) {
  return apiFetch(R.UPCOMING_PATIENT(patientId));
}

export async function getDoctorAppointments(doctorId) {
  return apiFetch(R.BY_DOCTOR(doctorId));
}

export async function getDoctorUpcomingMeetings(doctorId) {
  return apiFetch(R.UPCOMING_DOCTOR(doctorId));
}

export async function getDoctorMeetingUrls(doctorId) {
  return apiFetch(R.MEETINGS_DOCTOR(doctorId));
}

export async function createScheduleSlot({ doctorId, dayOfWeek, startTime, endTime, appointmenttype }) {
  return apiFetch(R.CREATE_SCHEDULE, {
    method: "POST",
    body: JSON.stringify({ doctorId, dayOfWeek, startTime, endTime, appointmenttype }),
  });
}

export async function saveSchedule(doctorId, slots) {
  let existingSlots = [];
  try {
    existingSlots = await getAvailableSlots(doctorId);
  } catch {
    existingSlots = [];
  }

  const isMatch = (existing, incoming) =>
    existing.dayOfWeek === incoming.dayOfWeek &&
    existing.startTime === incoming.startTime &&
    existing.endTime   === incoming.endTime   &&
    existing.appointmenttype === incoming.appointmenttype;

  const newSlots = slots.filter(
    (incoming) => !existingSlots.some((ex) => isMatch(ex, incoming))
  );

  if (newSlots.length === 0) return existingSlots;

  return Promise.all(
    newSlots.map((slot) => createScheduleSlot({ doctorId, ...slot }))
  );
}

export async function getAvailableSlots(doctorId) {
  return apiFetch(R.AVAILABLE_SLOTS(doctorId));
}

export async function getReservationById(reservationId) {
  return apiFetch(R.BY_ID(reservationId));
}