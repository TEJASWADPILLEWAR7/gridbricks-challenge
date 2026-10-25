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
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-gray-900">{displayValue}</span>
        {unit && displayValue !== "-" && (
          <span className="text-sm font-medium text-gray-500">{unit}</span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
