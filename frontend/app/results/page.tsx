"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VoiceAssistant from "../components/VoiceAssistant";

type Crop = {
  name?: string;
  crop?: string;
  suitability?: string;
  score?: number;
  suitability_score?: number;
};

export default function ResultsPage() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [input, setInput] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedResult =
        sessionStorage.getItem("soilAnalysisResult");

      const storedInput =
        sessionStorage.getItem("soilInputParameters");

      if (storedResult) {
        setResult(JSON.parse(storedResult));
      }

      if (storedInput) {
        setInput(JSON.parse(storedInput));
      }
    } catch (error) {
      console.error(
        "Unable to load analysis result:",
        error
      );
    }

    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f3]">
        <div className="text-center">
          <div className="text-5xl">🌱</div>
          <p className="mt-4 font-semibold text-[#082b55]">
            Loading soil analysis...
          </p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#f5f8f3] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">🌱</div>

          <h1 className="mt-4 text-2xl font-bold text-[#082b55]">
            No Analysis Result Found
          </h1>

          <p className="mt-2 text-gray-600">
            Please perform a soil analysis first.
          </p>

          <button
            onClick={() => router.push("/analyze")}
            className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
          >
            Start Soil Analysis
          </button>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * READ THE REAL BACKEND RESPONSE
   * -------------------------------------------------------
   */

  const soilType =
    result.soil_type ??
    result.soilType ??
    result.predicted_soil_type ??
    result.prediction?.soil_type ??
    "Not available";

  const soilHealth =
    result.soil_health ??
    result.soilHealth ??
    {};

  const score =
    soilHealth?.score ??
    result.soil_health_score ??
    result.score ??
    null;

  const healthLabel =
    soilHealth?.label ??
    soilHealth?.status ??
    result.health_status ??
    result.health_label ??
    (typeof score === "number"
      ? score >= 80
        ? "Excellent"
        : score >= 60
          ? "Good"
          : score >= 40
            ? "Needs Improvement"
            : "Poor"
      : "Not available");

  /*
   * Parameters:
   *
   * IMPORTANT:
   * We prefer the values entered by the farmer.
   * These were saved by analyze/page.tsx.
   */

  const nitrogen =
    input?.nitrogen ??
    result.nitrogen ??
    result.parameters?.nitrogen ??
    result.parameters?.N ??
    result.N ??
    "Not available";

  const phosphorus =
    input?.phosphorus ??
    result.phosphorus ??
    result.parameters?.phosphorus ??
    result.parameters?.P ??
    result.P ??
    "Not available";

  const potassium =
    input?.potassium ??
    result.potassium ??
    result.parameters?.potassium ??
    result.parameters?.K ??
    result.K ??
    "Not available";

  const ph =
    input?.ph ??
    result.ph ??
    result.pH ??
    result.parameters?.ph ??
    result.parameters?.pH ??
    "Not available";

  const moisture =
    input?.moisture ??
    result.moisture ??
    result.parameters?.moisture ??
    "Not available";

  const organicMatter =
    input?.organicMatter ??
    result.organic_matter ??
    result.organicMatter ??
    result.parameters?.organic_matter ??
    result.parameters?.organicMatter ??
    "Not available";

  /*
   * Nutrient score information
   */

  const nutrientScore =
    soilHealth?.nutrient_score ??
    result.nutrient_score ??
    result.scores?.nutrient_score ??
    null;

  const phScore =
    soilHealth?.ph_score ??
    result.ph_score ??
    result.scores?.ph_score ??
    null;

  const organicScore =
    soilHealth?.organic_matter_score ??
    result.organic_matter_score ??
    result.scores?.organic_matter_score ??
    null;

  /*
   * Deficiencies
   */

  const deficiencies =
    result.nutrient_deficiencies ??
    result.deficiencies ??
    result.nutrientDeficiencies ??
    [];

  /*
   * Nutrient gaps
   */

  const gaps =
    result.predicted_nutrient_gaps ??
    result.nutrient_gaps ??
    result.nutrientGaps ??
    {};

  const nitrogenGap =
    gaps?.nitrogen ??
    gaps?.N ??
    result.nitrogen_gap ??
    0;

  const phosphorusGap =
    gaps?.phosphorus ??
    gaps?.P ??
    result.phosphorus_gap ??
    0;

  const potassiumGap =
    gaps?.potassium ??
    gaps?.K ??
    result.potassium_gap ??
    0;

  /*
   * Recommendations
   */

  const fertilizerRecommendations =
    result.fertilizer_recommendations ??
    result.fertilizerRecommendations ??
    [];

  const soilManagement =
    result.soil_management_recommendations ??
    result.soil_management ??
    result.soilManagement ??
    [];

  /*
   * Crops
   */

  const crops: Crop[] =
    result.suitable_crops ??
    result.crop_recommendations ??
    result.cropRecommendations ??
    [];

  /*
   * Data passed to Voice Assistant
   */

  const voiceData = {
    ...result,

    soil_type: soilType,

    score,

    nutrient_deficiencies: deficiencies,

    fertilizer_recommendations:
      fertilizerRecommendations,

    suitable_crops: crops,

    parameters: {
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture,
      organicMatter,
    },
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-3 py-6 md:px-6">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="text-center">
          <div className="text-5xl">🌱</div>

          <h1 className="mt-2 text-3xl font-bold text-[#082b55]">
            Soil Analysis Results
          </h1>

          <p className="mt-1 text-gray-600">
            Here is your soil assessment and recommendations
          </p>
        </div>

        {/* TOP BUTTONS */}

        <div className="mt-6 grid gap-3 md:grid-cols-2">

          <button
            onClick={() => {
              window.print();
            }}
            className="rounded-xl bg-purple-700 px-5 py-4 font-semibold text-white hover:bg-purple-800"
          >
            📄 Download / Print PDF
          </button>

          <button
            onClick={() => router.push("/analyze")}
            className="rounded-xl bg-green-700 px-5 py-4 font-semibold text-white hover:bg-green-800"
          >
            🔄 Analyze Another Soil
          </button>

        </div>

        {/* SOIL TYPE */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            🌍 Soil Type
          </h2>

          <div className="mt-3 rounded-xl bg-green-50 p-4 text-center text-lg font-bold text-green-700">
            {soilType}
          </div>

        </section>

        {/* SOIL HEALTH */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            💚 Soil Health
          </h2>

          <div className="mt-5 text-center">

            <div className="text-5xl font-bold text-green-700">
              {score !== null ? score : "—"}
            </div>

            <div className="mt-1 text-xl font-bold text-[#082b55]">
              {healthLabel}
            </div>

            <p className="text-sm text-gray-500">
              Overall soil health score
            </p>

          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">

            <ScoreCard
              title="Nutrient Score"
              value={nutrientScore}
            />

            <ScoreCard
              title="pH Score"
              value={phScore}
            />

            <ScoreCard
              title="Organic Matter"
              value={organicScore}
            />

          </div>

        </section>

        {/* SOIL PARAMETERS */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            🧪 Soil Parameters
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">

            <Parameter
              title="Nitrogen (N)"
              value={nitrogen}
            />

            <Parameter
              title="Phosphorus (P)"
              value={phosphorus}
            />

            <Parameter
              title="Potassium (K)"
              value={potassium}
            />

            <Parameter
              title="pH"
              value={ph}
            />

            <Parameter
              title="Moisture"
              value={
                moisture !== "Not available"
                  ? `${moisture}%`
                  : moisture
              }
            />

            <Parameter
              title="Organic Matter"
              value={
                organicMatter !== "Not available" &&
                organicMatter !== null
                  ? `${organicMatter}%`
                  : "Not available"
              }
            />

          </div>

          {ph !== "Not available" && (
            <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-700">
              pH Status:{" "}
              <b>
                {Number(ph) < 6.5
                  ? "Acidic"
                  : Number(ph) > 7.5
                    ? "Alkaline"
                    : "Neutral"}
              </b>
            </div>
          )}

        </section>

        {/* DEFICIENCIES */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            ⚠️ Nutrient Deficiencies
          </h2>

          {Array.isArray(deficiencies) &&
          deficiencies.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">

              {deficiencies.map(
                (item: any, index: number) => {

                  const name =
                    typeof item === "string"
                      ? item
                      : item?.name ||
                        item?.nutrient ||
                        item?.type ||
                        `Nutrient ${index + 1}`;

                  return (
                    <span
                      key={index}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      {name}
                    </span>
                  );
                }
              )}

            </div>
          ) : (
            <p className="mt-3 text-gray-500">
              No nutrient deficiencies returned by the analysis.
            </p>
          )}

        </section>

        {/* NUTRIENT GAPS */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            🤖 Predicted Nutrient Gaps
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-3">

            <GapCard
              title="Nitrogen"
              value={nitrogenGap}
            />

            <GapCard
              title="Phosphorus"
              value={phosphorusGap}
            />

            <GapCard
              title="Potassium"
              value={potassiumGap}
            />

          </div>

        </section>

        {/* FERTILIZER */}

        <RecommendationSection
          title="💡 Fertilizer Recommendations"
          items={fertilizerRecommendations}
        />

        {/* SOIL MANAGEMENT */}

        <RecommendationSection
          title="🌱 Soil Management"
          items={soilManagement}
        />

        {/* CROPS */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-[#082b55]">
            🌾 Suitable Crops
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Crops evaluated using your soil conditions.
          </p>

          {Array.isArray(crops) &&
          crops.length > 0 ? (

            <div className="mt-4 space-y-3">

              {crops.map(
                (crop: Crop, index: number) => {

                  const name =
                    typeof crop === "string"
                      ? crop
                      : crop?.name ||
                        crop?.crop ||
                        `Crop ${index + 1}`;

                  const suitability =
                    crop?.suitability ||
                    "Evaluated";

                  const cropScore =
                    crop?.score ??
                    crop?.suitability_score;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                    >

                      <div>
                        <p className="font-bold text-[#082b55]">
                          {name}
                        </p>

                        <p className="text-sm text-green-700">
                          {suitability}
                        </p>
                      </div>

                      {cropScore !== undefined && (
                        <div className="rounded-full bg-green-50 px-4 py-2 font-bold text-green-700">
                          {cropScore}
                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          ) : (
            <p className="mt-4 text-gray-500">
              No crop recommendations returned by the analysis.
            </p>
          )}

        </section>

        {/* BOTTOM BUTTONS */}

        <div className="mt-5 grid gap-3 md:grid-cols-2">

          <button
            onClick={() => router.push("/analyze")}
            className="rounded-xl bg-green-700 px-5 py-4 font-semibold text-white hover:bg-green-800"
          >
            📷 Analyze Another Soil Sample
          </button>

          <button
            onClick={() => router.push("/history")}
            className="rounded-xl bg-white px-5 py-4 font-semibold text-[#082b55] shadow-sm"
          >
            📋 View History
          </button>

        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-3 w-full rounded-xl bg-white px-5 py-4 text-[#082b55] shadow-sm"
        >
          ← Back to Home
        </button>

      </div>

      {/* VOICE ASSISTANT */}

      <VoiceAssistant soilData={voiceData} />

    </main>
  );
}


/* -------------------------------------------------------
   SMALL COMPONENTS
------------------------------------------------------- */

function ScoreCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-bold text-[#082b55]">
        {value !== null &&
        value !== undefined
          ? value
          : "—"}
      </p>

    </div>
  );
}


function Parameter({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-semibold text-[#082b55]">
        {value}
      </p>

    </div>
  );
}


function GapCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl bg-green-50 p-4 text-center">

      <p className="text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-bold text-green-700">
        {value ?? "—"}
      </p>

    </div>
  );
}


function RecommendationSection({
  title,
  items,
}: {
  title: string;
  items: any;
}) {
  const list = Array.isArray(items)
    ? items
    : items
      ? [items]
      : [];

  return (
    <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

      <h2 className="font-bold text-[#082b55]">
        {title}
      </h2>

      {list.length > 0 ? (

        <div className="mt-4 space-y-2">

          {list.map(
            (item: any, index: number) => {

              const text =
                typeof item === "string"
                  ? item
                  : item?.recommendation ||
                    item?.description ||
                    item?.message ||
                    item?.text ||
                    JSON.stringify(item);

              return (
                <div
                  key={index}
                  className="rounded-xl bg-green-50 p-3 text-sm text-[#082b55]"
                >
                  🌿 {text}
                </div>
              );
            }
          )}

        </div>

      ) : (

        <p className="mt-3 text-gray-500">
          No recommendations returned by the analysis.
        </p>

      )}

    </section>
  );
}