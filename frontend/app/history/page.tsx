"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryItem = {
  soil_type: string;
  date: string;

  soil_parameters?: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    pH: number;
    moisture: number;
    organicMatter: number;
  };

  soil_health?: {
    score: number;
    level: string;
  };

  nutrient_deficiencies?: string[];

  nutrient_gaps?: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
};

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("soilAnalysisHistory");

    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  function clearHistory() {
    localStorage.removeItem("soilAnalysisHistory");
    setHistory([]);
  }

  function openResult(item: HistoryItem) {
    sessionStorage.setItem(
      "soilAnalysisResult",
      JSON.stringify(item)
    );

    router.push("/results");
  }

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-4 py-8">

      <div className="mx-auto max-w-4xl">

        <div className="mb-6 flex items-center justify-between">

          <button
            onClick={() => router.push("/")}
            className="font-semibold text-green-700"
          >
            ← Back
          </button>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Clear History
            </button>
          )}

        </div>

        <header className="mb-8">

          <h1 className="text-3xl font-bold text-[#082b55]">
            Analysis History
          </h1>

          <p className="mt-2 text-gray-600">
            Your previous soil analyses
          </p>

        </header>

        {history.length === 0 ? (

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="text-5xl">
              🌱
            </div>

            <p className="mt-4 text-gray-600">
              No soil analyses found.
            </p>

            <button
              onClick={() => router.push("/analyze")}
              className="mt-5 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
            >
              Start Soil Analysis
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {history.map((item, index) => (

              <button
                key={index}
                onClick={() => openResult(item)}
                className="w-full rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <span className="text-3xl">
                        🌱
                      </span>

                      <div>

                        <h2 className="text-xl font-bold text-[#082b55]">
                          {item.soil_type}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.date}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Soil Health
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      {item.soil_health?.score ?? "--"}/100
                    </p>

                  </div>

                </div>

                {item.soil_parameters && (
                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <MiniValue
                      label="N"
                      value={item.soil_parameters.nitrogen}
                    />

                    <MiniValue
                      label="P"
                      value={item.soil_parameters.phosphorus}
                    />

                    <MiniValue
                      label="K"
                      value={item.soil_parameters.potassium}
                    />

                  </div>
                )}

                {item.nutrient_deficiencies &&
                  item.nutrient_deficiencies.length > 0 && (

                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">

                    Deficiency:{" "}
                    {item.nutrient_deficiencies.join(", ")}

                  </div>

                )}

                <p className="mt-4 text-sm font-semibold text-green-700">
                  View complete analysis →
                </p>

              </button>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

function MiniValue({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}