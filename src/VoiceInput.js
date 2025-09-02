import React, { useState } from "react";

export default function VoiceInput({ value, onChange, placeholder }) {
  const [listening, setListening] = useState(false);

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input only works in Chrome/Edge browsers.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onChange(transcript);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1 }}
      />
      <button
        type="button"
        onClick={handleMic}
        style={{
          background: listening ? "#16a34a" : "#e5e7eb",
          color: listening ? "white" : "black",
          border: "none",
          borderRadius: 5,
          padding: "0.5em",
          cursor: "pointer"
        }}
      >
        🎤
      </button>
    </div>
  );
}
