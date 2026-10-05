"use client";

import { useState } from "react";

type VoiceAssistantProps = {
  soilData: any;
};

export default function VoiceAssistant({
  soilData,
}: VoiceAssistantProps) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Hello! I am your Soil Voice Assistant. Ask me about your soil, nutrients, fertilizer or crops."
  );

  const speak = (text: string) => {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const getResponse = (text: string) => {
    const q = text.toLowerCase();

    const soilType =
      soilData?.soil_type ||
      soilData?.soilType ||
      "not available";

    const score =
      soilData?.score ??
      soilData?.soil_health?.score ??
      soilData?.soil_health_score ??
      "not available";

    const deficiencies =
      soilData?.deficiencies ||
      soilData?.nutrient_deficiencies ||
      [];

    const fertilizer =
      soilData?.fertilizer_recommendations ||
      [];

    const crops =
      soilData?.suitable_crops ||
      [];

    const params = soilData?.parameters || {};

    const nitrogen =
      params.nitrogen ??
      soilData?.nitrogen ??
      "not available";

    const phosphorus =
      params.phosphorus ??
      soilData?.phosphorus ??
      "not available";

    const potassium =
      params.potassium ??
      soilData?.potassium ??
      "not available";

    const ph =
      params.ph ??
      soilData?.ph ??
      soilData?.pH ??
      "not available";

    if (
      q.includes("soil type") ||
      q.includes("what type") ||
      q.includes("soil")
    ) {
      return `Your detected soil type is ${soilType}.`;
    }

    if (
      q.includes("score") ||
      q.includes("health") ||
      q.includes("healthy")
    ) {
      return `Your soil health score is ${score} out of 100.`;
    }

    if (
      q.includes("nitrogen") ||
      q === "n"
    ) {
      return `Your nitrogen value is ${nitrogen}.`;
    }

    if (
      q.includes("phosphorus") ||
      q === "p"
    ) {
      return `Your phosphorus value is ${phosphorus}.`;
    }

    if (
      q.includes("potassium") ||
      q === "k"
    ) {
      return `Your potassium value is ${potassium}.`;
    }

    if (q.includes("ph")) {
      return `Your soil pH value is ${ph}.`;
    }

    if (
      q.includes("deficien") ||
      q.includes("nutrient")
    ) {
      if (Array.isArray(deficiencies) && deficiencies.length > 0) {
        const names = deficiencies
          .map((item: any) =>
            typeof item === "string"
              ? item
              : item?.name || item?.nutrient || ""
          )
          .filter(Boolean)
          .join(", ");

        return `The detected nutrient deficiencies are ${names}.`;
      }

      return "No nutrient deficiencies were returned by the analysis.";
    }

    if (
      q.includes("fertilizer") ||
      q.includes("fertiliser")
    ) {
      if (Array.isArray(fertilizer) && fertilizer.length > 0) {
        return `The fertilizer recommendation is: ${fertilizer
          .map((item: any) =>
            typeof item === "string"
              ? item
              : item?.recommendation || item?.name || ""
          )
          .filter(Boolean)
          .join(". ")}`;
      }

      return "No fertilizer recommendations were returned by the analysis.";
    }

    if (
      q.includes("crop") ||
      q.includes("grow") ||
      q.includes("suitable")
    ) {
      if (Array.isArray(crops) && crops.length > 0) {
        const names = crops
          .map((crop: any) =>
            typeof crop === "string"
              ? crop
              : crop?.name || crop?.crop || ""
          )
          .filter(Boolean)
          .join(", ");

        return `The suitable crops are ${names}.`;
      }

      return "No suitable crop recommendations were returned by the analysis.";
    }

    if (
      q.includes("summary") ||
      q.includes("tell me everything") ||
      q.includes("result")
    ) {
      return `Your soil analysis shows a soil health score of ${score}. The soil type is ${soilType}. Nitrogen is ${nitrogen}, phosphorus is ${phosphorus}, potassium is ${potassium}, and pH is ${ph}.`;
    }

    return "You can ask me about your soil type, health score, nitrogen, phosphorus, potassium, pH, nutrient deficiencies, fertilizer recommendations, or suitable crops.";
  };

  const processQuestion = (text: string) => {
    if (!text.trim()) return;

    setQuestion(text);

    const response = getResponse(text);

    setAnswer(response);
    speak(response);
  };

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const message =
        "Voice recognition is not supported in this browser. Please use Google Chrome on Android or desktop.";

      setAnswer(message);
      speak(message);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setAnswer("Listening... Please ask your question.");
    };

    recognition.onresult = (event: any) => {
      const text =
        event.results[0][0].transcript;

      processQuestion(text);
    };

    recognition.onerror = () => {
      setListening(false);
      setAnswer(
        "I could not hear you clearly. Please try again."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const closeAssistant = () => {
    window.speechSynthesis.cancel();
    setOpen(false);
    setListening(false);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-3xl text-white shadow-xl transition hover:scale-105"
          aria-label="Open Soil Voice Assistant"
        >
          🤖
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[340px] max-w-[calc(100vw-32px)] rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
                🤖
              </div>

              <div>
                <h2 className="font-bold text-[#082b55]">
                  Soil Voice Assistant
                </h2>

                <p className="text-sm text-gray-500">
                  Ask about your soil
                </p>
              </div>
            </div>

            <button
              onClick={closeAssistant}
              className="rounded-full px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
            >
              ×
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm leading-6 text-[#082b55]">
              {answer}
            </p>
          </div>

          {question && (
            <div className="mt-3 rounded-xl bg-green-50 p-3">
              <p className="text-xs text-gray-500">
                You asked
              </p>

              <p className="text-sm font-semibold text-green-800">
                {question}
              </p>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={startListening}
              disabled={listening}
              className="flex-1 rounded-xl bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
            >
              {listening
                ? "🎙️ Listening..."
                : "🎙️ Speak"}
            </button>

            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setAnswer("Voice output stopped.");
              }}
              className="rounded-xl bg-gray-200 px-4 py-3 text-gray-700"
            >
              🔇
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            Try: "What is my soil health score?"
          </p>
        </div>
      )}
    </>
  );
}