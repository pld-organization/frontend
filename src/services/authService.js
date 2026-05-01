import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../lib/constants/api";

function compactPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  );
}

export async function login(credentials) {
  const payload = compactPayload({
    email: credentials.email?.trim(),
    password: credentials.password,
  });

  const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload, {
    skipAuth: true,
    skipAuthRefresh: true,
  });

  return data;
}

export async function registerPatient(patientData) {
  const payload = compactPayload({
    email: patientData.email?.trim(),
    password: patientData.password,
    role: "PATIENT",
    firstName: patientData.firstName?.trim(),
    lastName: patientData.lastName?.trim(),
    phoneNumber: patientData.phoneNumber?.trim(),
    bloodType: patientData.bloodType,
    gender: patientData.gender,
  });

  const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload, {
    skipAuth: true,
    skipAuthRefresh: true,
  });

  return data;
}

export async function registerDoctor(doctorData) {
  const payload = compactPayload({
    email: doctorData.email?.trim(),
    password: doctorData.password,
    role: "DOCTOR",
    firstName: doctorData.firstName?.trim(),
    lastName: doctorData.lastName?.trim(),
    speciality: doctorData.speciality?.trim(),
    establishment: doctorData.establishment?.trim(),
  });

  const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload, {
    skipAuth: true,
    skipAuthRefresh: true,
  });

  return data;
}

export async function logoutSession() {
  const { data } = await apiClient.post(
    API_ENDPOINTS.AUTH.LOGOUT,
    {},
    {
      skipAuthRefresh: true,
    },
  );

  return data;
}
