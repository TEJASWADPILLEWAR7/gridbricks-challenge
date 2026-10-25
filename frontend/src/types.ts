export interface IntervalData {
  startTime: string;
  actual_generation: number | null;
  forecast_generation: number | null;
  publishTime: string | null;
  cutoffTime: string | null;
  error: number | null;
  abs_error: number | null;
}

export interface MetricsData {
  MAE: number | null;
  Bias: number | null;
  RMSE: number | null;
  MAPE: number | null;
  valid_pairs_count: number;
}

export interface AnalysisResponse {
  intervals: IntervalData[];
  metrics: MetricsData;
}
