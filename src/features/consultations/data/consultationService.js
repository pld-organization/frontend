import { authInstance } from './apiClient';

/**
 * Service to handle all consultation-related operations.
 * Connects to the Auth/User microservice.
 */

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('[ConsultationService Error]', error);
    throw error;
  }
};

const consultationService = {
  /**
   * Fetch all consultations for the current user.
   */
  async getConsultations() {
    return handleRequest(authInstance.get('/consultations'));
  },

  /**
   * Fetch details for a specific consultation.
   */
  async getConsultationById(id) {
    if (!id) throw new Error('Consultation ID is required');
    return handleRequest(authInstance.get(`/consultations/${id}`));
  },

  /**
   * Create a new consultation record.
   */
  async createConsultation(data) {
    return handleRequest(authInstance.post('/consultations', data));
  }
};

export default consultationService;
