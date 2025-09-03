import React from "react";

export default function Toast({ message, onClose }) {
  if (!message) return null; // If no message, do not show toast

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        background: "#222",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow: "0 6px 32px rgba(0,0,0,0.12)",
        minWidth: "220px",
        zIndex: 9999,
      }}
    >
      <span style={{ marginRight: "16px" }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

