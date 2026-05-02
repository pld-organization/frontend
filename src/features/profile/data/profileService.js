import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../lib/constants/api";

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  completeProfile: async (profileData) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.COMPLETE_PROFILE,
      profileData
    );
    return response.data;
  },
};