import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Moon, Sun, Calendar } from "lucide-react";
import { fetchAnalysisData } from "./api";
import type { AnalysisResponse } from "./types";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-01-31");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
    <div className="min-h-screen p-4 md:p-8 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-500">
      <div
        className="max-w-7xl mx-auto mb-8 animate-slide-up"
        style={{ animationDelay: "0ms" }}
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-6 items-center justify-between transition-colors duration-500">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="startDate"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400"
                >
                  Start:
                </label>
                <input
                  type="date"
                  id="startDate"
                  min="2026-01-01"
                  max="2026-01-31"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md px-1 cursor-pointer transition-colors duration-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-950 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors duration-500">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="endDate"
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400"
                >
                  End:
                </label>
                <input
                  type="date"
                  id="endDate"
                  min="2026-01-01"
                  max="2026-02-28"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md px-1 cursor-pointer transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 relative z-10" />
          </div>
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-6 tracking-wide">
            Syncing Elexon Data...
          </h2>
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-900 border-l-4 border-red-500 p-6 rounded-2xl shadow-lg flex items-start gap-4 animate-slide-up">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
              Data Retrieval Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      )}

      {data && !loading && !error && (
        <Dashboard
          data={data}
          startDate={startDate}
          endDate={endDate}
          isDark={isDark}
        />
      )}
    </div>
  );
}

export default App;
