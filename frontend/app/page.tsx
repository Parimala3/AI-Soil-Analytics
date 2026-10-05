"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("soilLanguage");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    setLanguage(value);

    localStorage.setItem(
      "soilLanguage",
      value
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3]">

      {/* LANGUAGE */}

      <div className="mx-auto flex max-w-6xl justify-end px-6 pt-6">

        <div className="flex items-center gap-3">

          <label className="text-lg text-[#082b55]">
            Language
          </label>

          <select
            value={language}
            onChange={changeLanguage}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-lg text-[#082b55] outline-none"
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              हिंदी
            </option>

            <option value="Kannada">
              ಕನ್ನಡ
            </option>
          </select>

        </div>

      </div>

      {/* HERO */}

      <section className="px-6 pb-12 pt-10 text-center">

        <div className="text-6xl">
          🌱
        </div>

        <h1 className="mt-3 text-4xl font-bold text-[#082b55]">
          AI Soil Analytics
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
          Smart soil analysis and crop recommendations for farmers
        </p>

        <button
          onClick={() => router.push("/analyze")}
          className="mt-7 rounded-xl bg-green-700 px-8 py-4 font-bold text-white shadow-sm hover:bg-green-800"
        >
          📷 Analyze My Soil
        </button>

      </section>

      {/* FEATURES */}

      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">

        <FeatureCard
          icon="🧪"
          title="Soil Analysis"
          description="Analyze soil type and nutrient conditions."
          onClick={() => router.push("/analyze")}
        />

        <FeatureCard
          icon="🌾"
          title="Crop Suggestions"
          description="Find crops suitable for your soil conditions."
          onClick={() => router.push("/analyze")}
        />

        <FeatureCard
          icon="💡"
          title="Smart Recommendations"
          description="Get fertilizer and soil-management guidance."
          onClick={() => router.push("/analyze")}
        />

      </section>

      {/* QUICK LINKS */}

      <section className="mx-auto mt-8 flex max-w-6xl gap-4 px-6 pb-12">

        <button
          onClick={() => router.push("/analyze")}
          className="flex-1 rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          🔎

          <span className="ml-2 font-bold text-[#082b55]">
            New Analysis
          </span>

          <p className="mt-1 text-sm text-gray-500">
            Analyze your soil
          </p>

        </button>

        <button
          onClick={() => router.push("/history")}
          className="flex-1 rounded-xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          📋

          <span className="ml-2 font-bold text-[#082b55]">
            Analysis History
          </span>

          <p className="mt-1 text-sm text-gray-500">
            View previous analyses
          </p>

        </button>

      </section>

    </main>
  );
}


function FeatureCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl bg-white p-8 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >

      <div className="text-5xl">
        {icon}
      </div>

      <h2 className="mt-8 text-2xl font-bold text-[#082b55]">
        {title}
      </h2>

      <p className="mt-4 leading-8 text-gray-600">
        {description}
      </p>

      <p className="mt-6 font-semibold text-green-700">
        Open →
      </p>

    </button>
  );
}