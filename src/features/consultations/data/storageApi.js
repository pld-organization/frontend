import { storageInstance } from './apiClient';
import { getStoredUser } from '../../../services/authStorage';

/**
 * Storage API Service
 * Handles file-related operations with the Storage microservice.
 * Dynamically retrieves user context (ID/Role) from authStorage.
 */

/**
 * Reusable request wrapper to catch errors and standardize responses.
 */
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('[StorageApi Error]', error);
    throw error;
  }
};

/**
 * Helper to get current user context for storage operations.
 */
const getUserContext = () => {
  const user = getStoredUser();
  if (!user) throw new Error('No authenticated user found');
  
  const isPatient = user.role?.toUpperCase() === 'PATIENT';
  const isDoctor = user.role?.toUpperCase() === 'DOCTOR';
  
  return {
    id: user.id,
    role: user.role,
    isPatient,
    isDoctor
  };
};

const storageApi = {
  /**
   * Upload a single file.
   * Automatically sets patientId or doctorId based on the logged-in user's role.
   */
  async uploadSingleFile(file, targetId, type) {
    if (!file) throw new Error('File is required for upload');
    
    const user = getUserContext();
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('type', type);

    if (user.isPatient) {
      formData.append('patientId', user.id);
      if (targetId) formData.append('doctorId', targetId);
    } else if (user.isDoctor) {
      formData.append('doctorId', user.id);
      if (targetId) formData.append('patientId', targetId);
    }

    return handleRequest(
      storageInstance.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  /**
   * Upload multiple files.
   */
  async uploadMultipleFiles(files, targetId, type) {
    if (!files || files.length === 0) throw new Error('No files selected');
    
    const user = getUserContext();
    const formData = new FormData();
    
    Array.from(files).forEach((f) => formData.append('files', f));
    formData.append('type', type);

    if (user.isPatient) {
      formData.append('patientId', user.id);
      if (targetId) formData.append('doctorId', targetId);
    } else if (user.isDoctor) {
      formData.append('doctorId', user.id);
      if (targetId) formData.append('patientId', targetId);
    }

    return handleRequest(
      storageInstance.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  /**
   * Fetch files for the logged-in user based on their role.
   */
  async getMyFiles() {
    const user = getUserContext();
    const endpoint = user.isPatient 
      ? `/upload/patient/${user.id}` 
      : `/upload/doctor/${user.id}`;
      
    return handleRequest(storageInstance.get(endpoint));
  },

  /**
   * Fetch files for the logged-in user filtered by type.
   */
  async getMyFilesByType(type) {
    const user = getUserContext();
    const endpoint = user.isPatient
      ? `/upload/patient/${user.id}/type/${type}`
      : `/upload/doctor/${user.id}/type/${type}`;
      
    return handleRequest(storageInstance.get(endpoint));
  },

  async getPatientFiles(patientId) {
    return handleRequest(storageInstance.get(`/upload/patient/${patientId}`));
  },

  async getDoctorFiles(doctorId) {
    return handleRequest(storageInstance.get(`/upload/doctor/${doctorId}`));
  },

  async getDoctorPatientFiles(doctorId, patientId) {
    return handleRequest(storageInstance.get(`/upload/doctor/${doctorId}/patient/${patientId}`));
  },

  async getFileByName(filename) {
    return handleRequest(storageInstance.get(`/upload/filename/${filename}`));
  },
};

export default storageApi;
