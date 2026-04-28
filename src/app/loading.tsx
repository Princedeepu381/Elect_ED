/**
 * Root loading skeleton — shown during page transitions and initial load.
 * Uses CSS animation for a smooth, branded experience.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-dark, #050b18)",
        gap: "1.5rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "2rem",
          fontWeight: 900,
          letterSpacing: "0.2em",
          color: "white",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      >
        ELECT<span style={{ color: "#f97316" }}>ED</span>
      </div>

      <div
        style={{
          width: "200px",
          height: "2px",
          background: "rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to right, transparent, #4f46e5, #f97316, transparent)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>

      <span style={{ color: "#6B7280", fontSize: "0.75rem", letterSpacing: "0.2em" }}>
        LOADING...
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
