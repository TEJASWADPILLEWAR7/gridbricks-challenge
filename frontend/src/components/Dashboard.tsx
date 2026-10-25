import type { AnalysisResponse } from "../types";
import { MetricCard } from "./MetricCard";
import { ForecastCharts } from "./ForecastCharts";
import { IntervalTable } from "./IntervalTable";
import { Activity } from "lucide-react";

interface DashboardProps {
  data: AnalysisResponse;
  startDate: string;
  endDate: string;
}

export function Dashboard({ data, startDate, endDate }: DashboardProps) {
  const { metrics, intervals } = data;

  const formatPeriodDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Wind Forecast Accuracy
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Evaluating 12:00 UTC day-ahead forecasts against actual generation
            </p>
          </div>
        </div>
        <div className="text-left md:text-right text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <p className="font-medium">
            Period:{" "}
            <span className="text-gray-900">
              {formatPeriodDate(startDate)} - {formatPeriodDate(endDate)}
            </span>
          </p>
          <p>
            Valid Delivery Intervals:{" "}
            <span className="font-semibold text-blue-600">
              {metrics.valid_pairs_count}
            </span>
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Mean Absolute Error"
          value={metrics.MAE?.toFixed(2)}
          unit="MW"
          description="Average absolute magnitude of forecast errors. Lower is better."
        />
        <MetricCard
          title="Mean Error (Bias)"
          value={metrics.Bias?.toFixed(2)}
          unit="MW"
          description="Positive indicates overforecasting. Negative indicates underforecasting."
        />
        <MetricCard
          title="Root Mean Squared Error"
          value={metrics.RMSE?.toFixed(2)}
          unit="MW"
          description="Penalizes unusually large forecast deviations more heavily."
        />
        <MetricCard
          title="MAPE"
          value={metrics.MAPE?.toFixed(2)}
          unit="%"
          description="Mean Absolute Percentage Error (excludes intervals with 0 MW actual generation)."
        />
      </div>

      <ForecastCharts intervals={intervals} />

      <IntervalTable intervals={intervals} />
    </div>
  );
}
