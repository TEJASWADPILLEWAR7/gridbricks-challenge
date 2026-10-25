import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { fetchAnalysisData } from "./api";
import type { AnalysisResponse } from "./types";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchAnalysisData();
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      {loading && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-700">
            Loading analytics engine...
          </h2>
          <p className="text-sm mt-2">
            Retrieving and aligning live Day-Ahead Elexon datasets.
          </p>
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

      {data && !loading && !error && <Dashboard data={data} />}
    </div>
  );
}

export default App;
