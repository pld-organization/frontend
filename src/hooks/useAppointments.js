import {
  cancelAppointment,
  createAppointment,
  getAvailableDoctors,
  getPatientAppointments,
} from "../features/appointments/data/appointmentService";

export function useAppointments() {
  return {
    cancelAppointment,
    createAppointment,
    getAvailableDoctors,
    getPatientAppointments,
  };
}
