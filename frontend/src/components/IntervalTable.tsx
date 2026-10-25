import type { IntervalData } from "../types";
import { AlertCircle } from "lucide-react";

interface IntervalTableProps {
  intervals: IntervalData[];
}

export function IntervalTable({ intervals }: IntervalTableProps) {
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return "-";
    return (
      new Date(isoString).toLocaleString("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }) + " UTC"
    );
  };

  const formatNumber = (num: number | null) => {
    return num !== null && num !== undefined
      ? num.toLocaleString("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : "-";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 mt-8 transition-colors duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Interval Investigation
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
          Detailed breakdown of delivery periods, settled actuals, and retained
          forecasts.
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors duration-500">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-950/50 text-gray-600 dark:text-gray-400 sticky top-0 z-10 backdrop-blur-md transition-colors duration-500">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Delivery Start Time
                </th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">
                  Actual (MW)
                </th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">
                  Forecast (MW)
                </th>
                <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">
                  Error (MW)
                </th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">
                  Publish Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 transition-colors duration-500">
              {intervals.map((interval, idx) => {
                const isMissing =
                  interval.actual_generation === null ||
                  interval.forecast_generation === null;

                return (
                  <tr
                    key={interval.startTime || idx}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${isMissing ? "bg-red-50/40 dark:bg-red-900/10" : ""}`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap text-gray-900 dark:text-gray-200 font-medium">
                      {formatDateTime(interval.startTime)}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right text-gray-600 dark:text-gray-400 font-medium">
                      {formatNumber(interval.actual_generation)}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right text-gray-600 dark:text-gray-400 font-medium">
                      {formatNumber(interval.forecast_generation)}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right">
                      <span
                        className={`font-bold ${
                          interval.error && interval.error > 0
                            ? "text-red-500 dark:text-red-400"
                            : interval.error && interval.error < 0
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-500"
                        }`}
                      >
                        {formatNumber(interval.error)}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                      {formatDateTime(interval.publishTime)}
                      {isMissing && (
                        <span title="Missing data" className="inline-flex">
                          <AlertCircle className="w-4 h-4 text-red-400 dark:text-red-500" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
