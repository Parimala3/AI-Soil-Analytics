"use client";

import { useState } from "react";

type Props = {
  text: string;
  language?: "English" | "Hindi" | "Kannada";
};

export default function VoiceOutput({
  text,
  language = "English",
}: Props) {
  const [speaking, setSpeaking] = useState(false);

  function getVoiceLanguage() {
    if (language === "Hindi") {
      return "hi-IN";
    }

    if (language === "Kannada") {
      return "kn-IN";
    }

    return "en-IN";
  }

  function speak() {
    if (!("speechSynthesis" in window)) {
      alert("Voice output is not supported by this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = getVoiceLanguage();
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return (
    <div className="flex flex-wrap gap-3">

      <button
        onClick={speak}
        disabled={speaking}
        className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white disabled:opacity-50"
      >
        🔊 {speaking ? "Speaking..." : "Listen"}
      </button>

      {speaking && (
        <button
          onClick={stop}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white"
        >
          ⏹ Stop
        </button>
      )}

    </div>
  );
}