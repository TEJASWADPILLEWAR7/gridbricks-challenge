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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Interval-Level Investigation
          </h3>
          <p className="text-sm text-gray-500">
            Detailed breakdown of actuals, selected forecasts, and errors.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0 shadow-sm z-10">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                Delivery Start Time
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right font-semibold text-gray-700"
              >
                Actual (MW)
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right font-semibold text-gray-700"
              >
                Forecast (MW)
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right font-semibold text-gray-700"
              >
                Error (MW)
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                Forecast Publish Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {intervals.map((interval, idx) => {
              const isMissingData =
                interval.actual_generation === null ||
                interval.forecast_generation === null;

              return (
                <tr
                  key={interval.startTime || idx}
                  className={`hover:bg-gray-50 ${isMissingData ? "bg-red-50/30" : ""}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">
                    {formatDateTime(interval.startTime)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                    {formatNumber(interval.actual_generation)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">
                    {formatNumber(interval.forecast_generation)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span
                      className={
                        interval.error && interval.error > 0
                          ? "text-red-600 font-medium"
                          : interval.error && interval.error < 0
                            ? "text-blue-600 font-medium"
                            : "text-gray-600"
                      }
                    >
                      {formatNumber(interval.error)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500 flex items-center gap-2">
                    {formatDateTime(interval.publishTime)}
                    {isMissingData && (
                      <span
                        title="Missing data for this interval"
                        className="text-red-400"
                      >
                        <AlertCircle className="w-4 h-4" />
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
  );
}
