import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { fetchAnalysisData } from "./api";
import type { AnalysisResponse } from "./types";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-01-31");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchAnalysisData(startDate, endDate);
        setData(result);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-3">
          <label
            htmlFor="startDate"
            className="text-sm font-bold text-gray-700"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            min="2026-01-01"
            max="2026-01-31"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="endDate" className="text-sm font-bold text-gray-700">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            min="2026-01-01"
            max="2026-02-28"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-700">
            Loading analytics engine...
          </h2>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto mt-12 bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-sm flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Data Retrieval Failed
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}

      {data && !loading && !error && (
        <Dashboard data={data} startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
}

export default App;
