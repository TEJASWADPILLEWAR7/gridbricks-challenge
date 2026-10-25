import type { AnalysisResponse } from "../types";
import { MetricCard } from "./MetricCard";
import { ForecastCharts } from "./ForecastCharts";
import { IntervalTable } from "./IntervalTable";
import { Activity } from "lucide-react";

interface DashboardProps {
  data: AnalysisResponse;
  startDate: string;
  endDate: string;
  isDark: boolean;
}

export function Dashboard({
  data,
  startDate,
  endDate,
  isDark,
}: DashboardProps) {
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
      <header
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-500/20 transform transition-transform hover:scale-105 duration-300">
            <Activity className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight transition-colors duration-500">
              Wind Forecast Analytics
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-500">
              Evaluating 12:00 UTC day-ahead forecasts against actual metered
              generation
            </p>
          </div>
        </div>
        <div className="text-left md:text-right text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-500">
          <p className="font-medium">
            Period:{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {formatPeriodDate(startDate)} - {formatPeriodDate(endDate)}
            </span>
          </p>
          <p className="mt-0.5">
            Valid Intervals:{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {metrics.valid_pairs_count}
            </span>
          </p>
        </div>
      </header>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up"
        style={{ animationDelay: "200ms" }}
      >
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
          description="Mean Absolute Percentage Error (excludes intervals with 0 MW actuals)."
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <ForecastCharts intervals={intervals} isDark={isDark} />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
        <IntervalTable intervals={intervals} />
      </div>
    </div>
  );
}
