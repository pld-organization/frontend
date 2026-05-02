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

export async function getDoctorAppointments() {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.LIST);
    return data;
  } catch (error) {
    console.warn("Doctor Appointments API failed, using fallback", error);
    return [
      { id: 1, time: "08:00", patient: "Salmi Ahmed", type: "IRL", status: "Completed", action: "View" },
      { id: 2, time: "08:30", patient: "Amina Boudjemaa", type: "IRL", status: "Cancelled", action: "View" },
      { id: 3, time: "09:00", patient: "Nabil Haddad", type: "Online", status: "Confirmed", action: "Join" },
      { id: 4, time: "09:30", patient: "Walid Benkhaled", type: "IRL", status: "Pending", action: "Start" },
      { id: 5, time: "10:00", patient: "Yousra Amrani", type: "Online", status: "Confirmed", action: "Join" },
      { id: 6, time: "10:30", patient: "Karim Ziani", type: "IRL", status: "Pending", action: "Start" },
      { id: 7, time: "11:00", patient: "Lydia Mansouri", type: "Online", status: "Pending", action: "Start" },
      { id: 8, time: "11:30", patient: "Fouad Belaid", type: "IRL", status: "Pending", action: "Start" },
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
