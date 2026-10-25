import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { IntervalData } from "../types";

interface ForecastChartsProps {
  intervals: IntervalData[];
}

export function ForecastCharts({ intervals }: ForecastChartsProps) {
  const chartData = useMemo(() => {
    return intervals.map((interval) => {
      const dateObj = new Date(interval.startTime);
      return {
        ...interval,
        displayTime: dateObj.toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });
  }, [intervals]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Wind Generation: Actual vs. Forecast
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                minTickGap={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{
                  value: "Generation (MW)",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "#4b5563",
                    fontSize: 14,
                  },
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                name="Actual Generation"
                dataKey="actual_generation"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                name="Forecast Generation (12:00 Day-Ahead)"
                dataKey="forecast_generation"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          Forecast Error Magnitude & Direction
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Positive values indicate overforecasting. Negative values indicate
          underforecasting.
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                minTickGap={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                label={{
                  value: "Error (MW)",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "#4b5563",
                    fontSize: 14,
                  },
                }}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={2} />
              <Bar name="Forecast Error" dataKey="error" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
