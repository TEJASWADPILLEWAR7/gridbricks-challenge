import type { AnalysisResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function fetchAnalysisData(
  startDate: string,
  endDate: string,
): Promise<AnalysisResponse> {
  const response = await fetch(
    `${API_BASE_URL}/analysis?start_date=${startDate}&end_date=${endDate}`,
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}
