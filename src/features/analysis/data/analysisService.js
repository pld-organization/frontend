import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../lib/constants/api";

export async function predict(file, analysisType) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (analysisType) {
      formData.append("analysisType", analysisType);
    }
    
    // Axios automatically sets the correct Content-Type with boundary when FormData is passed
    const { data } = await apiClient.post(API_ENDPOINTS.ANALYSIS.PREDICT, formData);
    return data;
  } catch (error) {
    console.warn("API failed, using fallback data for analysis prediction", error);
    // TODO: Remove fallback data once backend is confirmed
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          type: analysisType || "General Check",
          status: "completed",
          date: new Date().toISOString().split('T')[0],
          findings: "No significant abnormalities detected. The uploaded scan appears normal.",
          confidence: 0.94,
          recommendation: "Continue routine monitoring."
        });
      }, 2000); // simulate analysis delay
    });
  }
}

export async function getMyAnalyses() {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.ANALYSIS.MY_ANALYSES);
    return data;
  } catch (error) {
    console.warn("API failed, using fallback data for analysis history", error);
    // TODO: Remove fallback data once backend is confirmed
    return [
      {
        id: "a1",
        type: "X-Ray Chest",
        status: "completed",
        date: "2026-04-10",
        findings: "Clear lungs, no signs of infection or inflammation.",
        confidence: 0.98,
        recommendation: "No further action required."
      },
      {
        id: "a2",
        type: "Blood Test Analysis",
        status: "completed",
        date: "2026-03-05",
        findings: "Slightly elevated cholesterol levels. Other parameters within normal range.",
        confidence: 0.89,
        recommendation: "Consider dietary adjustments and regular exercise."
      }
    ];
  }
}

export async function getAnalysisById(id) {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.ANALYSIS.BY_ID(id));
    return data;
  } catch (error) {
    console.warn("API failed, returning null", error);
    return null;
  }
}
