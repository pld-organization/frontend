import { getMyAnalyses, predict } from "../features/analysis/data/analysisService";

export function useAnalysis() {
  return {
    getMyAnalyses,
    predict,
  };
}
