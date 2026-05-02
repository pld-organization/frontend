import { authInstance } from './apiClient';

/**
 * User API Service
 * Handles user-related operations with the Auth & Users microservice.
 */

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('[UserApi Error]', error);
    throw error;
  }
};

const userApi = {
  /**
   * Fetch current authenticated profile.
   */
  async getProfile() {
    return handleRequest(authInstance.get('/auth/profile'));
  },

  /**
   * Fetch a list of all patient IDs.
   */
  async getPatientIds() {
    return handleRequest(authInstance.get('/auth/patients/ids'));
  },

  /**
   * Fetch all patients with details.
   */
  async getPatients() {
    return handleRequest(authInstance.get('/auth/patients'));
  },

  /**
   * Fetch a list of all doctor IDs.
   */
  async getDoctorIds() {
    return handleRequest(authInstance.get('/auth/doctors/ids'));
  },

  /**
   * Fetch specific patient data.
   */
  async getPatientById(id) {
    if (!id) throw new Error('Patient ID is required');
    return handleRequest(authInstance.get(`/auth/patient/${id}`));
  },

  /**
   * Fetch specific doctor data.
   */
  async getDoctorById(id) {
    if (!id) throw new Error('Doctor ID is required');
    return handleRequest(authInstance.get(`/auth/doctor/${id}`));
  },
};

export default userApi;
