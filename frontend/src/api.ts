import type { AnalysisResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function fetchAnalysisData(): Promise<AnalysisResponse> {
  // For now, we rely on the backend's default dates (first week of Jan 2026)
  const response = await fetch(`${API_BASE_URL}/analysis`);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}
