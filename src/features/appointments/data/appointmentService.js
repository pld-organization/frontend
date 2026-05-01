import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../lib/constants/api";

export async function getPatientAppointments() {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.MY);
    return data;
  } catch (error) {
    console.warn("API failed, using fallback data for appointments", error);
    // TODO: Remove fallback data once backend is confirmed
    return [
      {
        id: "1",
        doctor: { firstName: "Sarah", lastName: "Bennani", speciality: "Cardiologist" },
        date: "2026-05-15",
        time: "10:00",
        type: "consultation",
        status: "confirmed",
        reason: "Routine checkup"
      },
      {
        id: "2",
        doctor: { firstName: "Amine", lastName: "Tazi", speciality: "Dermatologist" },
        date: "2026-05-20",
        time: "14:30",
        type: "online",
        status: "pending",
        reason: "Skin rash check"
      }
    ];
  }
}

export async function cancelAppointment(id) {
  try {
    const { data } = await apiClient.put(API_ENDPOINTS.APPOINTMENTS.CANCEL(id));
    return data;
  } catch (error) {
    console.warn("Cancel API failed, simulating success", error);
    return { success: true };
  }
}

export async function deleteAppointment(id) {
  try {
    const { data } = await apiClient.delete(API_ENDPOINTS.APPOINTMENTS.DELETE(id));
    return data;
  } catch (error) {
    console.warn("Delete API failed, simulating success", error);
    return { success: true };
  }
}

export async function getAvailableDoctors() {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.DOCTORS.AVAILABLE);
    return data;
  } catch (error) {
    console.warn("API failed, using fallback data for available doctors", error);
    // TODO: Remove fallback
    return [
      {
        id: "d1",
        firstName: "Sarah",
        lastName: "Bennani",
        speciality: "Cardiologist",
        establishment: "Clinique Riad"
      },
      {
        id: "d2",
        firstName: "Amine",
        lastName: "Tazi",
        speciality: "Dermatologist",
        establishment: "Hopital Cheikh Zaid"
      },
      {
        id: "d3",
        firstName: "Karim",
        lastName: "Naciri",
        speciality: "Pediatrician",
        establishment: "Clinique Atlas"
      }
    ];
  }
}

export async function createAppointment(appointmentData) {
  try {
    const { data } = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
    return data;
  } catch (error) {
    console.warn("Create API failed, simulating success", error);
    // TODO: Remove fallback
    return { success: true, id: Date.now().toString(), ...appointmentData, status: "pending" };
  }
}
