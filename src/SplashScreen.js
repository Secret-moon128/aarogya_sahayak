import React from "react";
import "./SplashScreen.css";

export default function SplashScreen() {
  return (
<div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
        <div style={{
        width: 120,
        height: 120,
        borderRadius: "60px",
        background: "rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        boxShadow: "0 0 32px 6px #56CCF2",
        position: "relative",
      }}>
        <img
          src="/logo512.png"
          alt="Logo"
          style={{
            width: 90,
            height: 90,
            animation: "spin 2.5s linear infinite"
          }}
        />
      </div>
      <div
        style={{
          color: "#ffffff",
          fontSize: "2rem",
          fontWeight: 800,
          textShadow: "0 2px 16px #2F80ED, 0 1px 4px #fff",
          marginBottom: "12px"
        }}
      >
        Aarogya Sahayak
      </div>
      <div style={{
        color: "#d2eaf9",
        fontSize: "1.2rem",
        fontWeight: 500,
        marginBottom: "32px",
        textShadow: "0 1px 4px #fff",
      }}>
        by CODE4CARE
      </div>
      <div
        style={{
          color: "#fff",
          fontSize: "1.5rem",
          animation: "fadeinout 1.6s linear infinite"
        }}
      >
        Loading...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes fadeinout {
          0% { opacity: 1;}
          50% { opacity: 0.3;}
          100% { opacity: 1;}
        }
      `}</style>
    </div>
  );
}
