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
  isDark: boolean;
}

export function ForecastCharts({ intervals, isDark }: ForecastChartsProps) {
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

  const axisColor = isDark ? "#6b7280" : "#9ca3af";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";
  const tooltipBg = isDark ? "#111827" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const textColor = isDark ? "#f3f4f6" : "#111827";

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-500">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Generation: Actual vs. Forecast
        </h3>
        <div className="h-[22rem] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 12, fill: axisColor }}
                tickMargin={12}
                minTickGap={50}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "MW",
                  angle: -90,
                  position: "insideLeft",
                  fill: axisColor,
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: "12px",
                  borderColor: tooltipBorder,
                  color: textColor,
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: textColor, fontWeight: 500 }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "24px",
                  fontSize: "13px",
                  color: axisColor,
                }}
              />
              <Line
                type="monotone"
                name="Actual Generation"
                dataKey="actual_generation"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                name="Forecast Generation (12:00 Cutoff)"
                dataKey="forecast_generation"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="6 6"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-500">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Error Magnitude & Direction
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
          Positive implies overforecasting. Negative implies underforecasting.
        </p>
        <div className="h-[18rem] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 12, fill: axisColor }}
                tickMargin={12}
                minTickGap={50}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisColor }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "MW Error",
                  angle: -90,
                  position: "insideLeft",
                  fill: axisColor,
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={{ fill: isDark ? "#1f2937" : "#f9fafb" }}
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: "12px",
                  borderColor: tooltipBorder,
                  color: textColor,
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <ReferenceLine
                y={0}
                stroke={axisColor}
                strokeWidth={1.5}
                opacity={0.5}
              />
              <Bar
                name="Forecast Error"
                dataKey="error"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
