"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          border: "1px solid var(--border-bold)",
          padding: "4rem",
          background: "white",
          boxShadow: "12px 12px 0 var(--accent-secondary)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            marginBottom: "1rem",
            fontWeight: 900,
          }}
        >
          SYSTEM <span style={{ color: "var(--accent-primary)" }}>ERR</span>
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            fontSize: "1.1rem",
            maxWidth: "400px",
          }}
        >
          A geographic or processing error has occurred. The democracy data
          remains secure.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            className="btn-primary"
            style={{ clipPath: "none" }}
          >
            REBOOT SYSTEM
          </button>
          <Link href="/" className="btn-outline">
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
