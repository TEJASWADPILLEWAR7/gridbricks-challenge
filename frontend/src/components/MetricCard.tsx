interface MetricCardProps {
  title: string;
  value: string | number | undefined | null;
  unit?: string;
  description: string;
}

export function MetricCard({
  title,
  value,
  unit,
  description,
}: MetricCardProps) {
  const displayValue = value !== null && value !== undefined ? value : "-";

  return (
    <div className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col transform transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-bl-full -mr-16 -mt-16 transition-colors duration-500"></div>

      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 relative z-10 transition-colors duration-500">
        {title}
      </h3>
      <div className="flex items-baseline gap-1.5 mb-3 relative z-10">
        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-500">
          {displayValue}
        </span>
        {unit && displayValue !== "-" && (
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 transition-colors duration-500">
            {unit}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-auto leading-relaxed relative z-10 transition-colors duration-500 group-hover:text-gray-500 dark:group-hover:text-gray-400">
        {description}
      </p>
    </div>
  );
}
