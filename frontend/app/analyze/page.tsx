"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [nitrogen, setNitrogen] = useState("");
  const [phosphorus, setPhosphorus] = useState("");
  const [potassium, setPotassium] = useState("");
  const [ph, setPh] = useState("");
  const [moisture, setMoisture] = useState("");
  const [organicMatter, setOrganicMatter] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setImage(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const validateForm = () => {
    if (!image) {
      setError("Please upload or capture a soil image.");
      return false;
    }

    if (!nitrogen || !phosphorus || !potassium || !ph || !moisture) {
      setError("Please enter all required soil parameters.");
      return false;
    }

    const n = Number(nitrogen);
    const p = Number(phosphorus);
    const k = Number(potassium);
    const phValue = Number(ph);
    const moistureValue = Number(moisture);

    if (
      Number.isNaN(n) ||
      Number.isNaN(p) ||
      Number.isNaN(k) ||
      Number.isNaN(phValue) ||
      Number.isNaN(moistureValue)
    ) {
      setError("Please enter valid numeric values.");
      return false;
    }

    if (phValue < 0 || phValue > 14) {
      setError("pH must be between 0 and 14.");
      return false;
    }

    if (moistureValue < 0 || moistureValue > 100) {
      setError("Moisture must be between 0 and 100%.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", image as File);
      formData.append("nitrogen", nitrogen);
      formData.append("phosphorus", phosphorus);
      formData.append("potassium", potassium);
      formData.append("pH", ph);
      formData.append("moisture", moisture);

      if (organicMatter.trim() !== "") {
        formData.append("organic_matter", organicMatter);
      }

      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Analysis failed.");
      }

      const result = await response.json();

      console.log("================================");
      console.log("ACTUAL BACKEND RESULT");
      console.log(result);
      console.log("================================");

      /*
       * IMPORTANT:
       * Store the EXACT backend response.
       * The Results page reads this object.
       */
      sessionStorage.setItem(
        "soilAnalysisResult",
        JSON.stringify(result)
      );

      /*
       * Also store the values entered by the farmer.
       * This guarantees that the Results page can show
       * exactly what was entered.
       */
      sessionStorage.setItem(
        "soilInputParameters",
        JSON.stringify({
          nitrogen: Number(nitrogen),
          phosphorus: Number(phosphorus),
          potassium: Number(potassium),
          ph: Number(ph),
          moisture: Number(moisture),
          organicMatter:
            organicMatter.trim() === ""
              ? null
              : Number(organicMatter),
        })
      );

      router.push("/results");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to analyze soil. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/")}
          className="mb-6 font-semibold text-green-700"
        >
          ← Back to Home
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="text-center">
            <div className="text-5xl">🌱</div>

            <h1 className="mt-3 text-3xl font-bold text-[#082b55]">
              Analyze Your Soil
            </h1>

            <p className="mt-2 text-gray-600">
              Upload a soil image and enter your soil parameters
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* IMAGE */}
            <section>
              <h2 className="mb-3 text-lg font-bold text-[#082b55]">
                📷 Soil Image
              </h2>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-8 text-center transition hover:bg-green-100"
              >
                <div className="text-4xl">📸</div>

                <p className="mt-2 font-semibold text-green-800">
                  Upload or Capture Soil Image
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  JPG, PNG or JPEG up to 10 MB
                </p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />

              {preview && (
                <div className="mt-4 overflow-hidden rounded-2xl border bg-white p-3">
                  <img
                    src={preview}
                    alt="Soil preview"
                    className="mx-auto max-h-72 rounded-xl object-contain"
                  />

                  <p className="mt-2 text-center text-sm text-gray-600">
                    {image?.name}
                  </p>
                </div>
              )}
            </section>

            {/* PARAMETERS */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-[#082b55]">
                🧪 Soil Parameters
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Nitrogen (N)"
                  value={nitrogen}
                  onChange={setNitrogen}
                  placeholder="Enter nitrogen"
                />

                <InputField
                  label="Phosphorus (P)"
                  value={phosphorus}
                  onChange={setPhosphorus}
                  placeholder="Enter phosphorus"
                />

                <InputField
                  label="Potassium (K)"
                  value={potassium}
                  onChange={setPotassium}
                  placeholder="Enter potassium"
                />

                <InputField
                  label="pH"
                  value={ph}
                  onChange={setPh}
                  placeholder="0 - 14"
                  step="0.1"
                />

                <InputField
                  label="Moisture (%)"
                  value={moisture}
                  onChange={setMoisture}
                  placeholder="Enter moisture"
                  step="0.1"
                />

                <InputField
                  label="Organic Matter (%)"
                  value={organicMatter}
                  onChange={setOrganicMatter}
                  placeholder="Optional"
                  step="0.1"
                  required={false}
                />
              </div>
            </section>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "🔄 Analyzing Soil..." : "🌱 Analyze My Soil"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  step = "1",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#082b55]">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type="number"
        step={step}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}