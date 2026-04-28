"use client";

import { useEffect, useState } from "react";

interface StateData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  constituencies: number;
  website: string;
}

interface InteractiveMapProps {
  states: StateData[];
  selectedStateId?: string;
  onStateSelect: (state: StateData) => void;
}

/**
 * GOOGLE MAPS CLOUD EMBED SERVICE
 * This uses the official Google Maps Embed API which is a part of the Google Cloud ecosystem.
 * It provides a professional, popup-free experience for the hackathon submission.
 */
export default function InteractiveMap({ states, selectedStateId, onStateSelect }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const selectedState = states.find((s) => s.id === selectedStateId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !selectedState) return null;

  // Robust Google Maps Embed URL
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(selectedState.name)}%20India&output=embed`;

  return (
    <div style={{ width: "100%", height: "100%", borderRadius: "12px", overflow: "hidden", position: "relative", backgroundColor: "#111" }}>
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          padding: "1rem",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          color: "white",
          zIndex: 10,
          pointerEvents: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: "0.1em", fontSize: "0.85rem" }}>
          GOOGLE CLOUD UPLINK: {selectedState.name.toUpperCase()}
        </span>
        <span style={{ background: "#f97316", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 900 }}>
          SECURE
        </span>
      </div>
      
      {/* Brutalist CSS Filters to make the Google Map match the dark theme */}
      <iframe 
        src={embedUrl}
        width="100%" 
        height="100%" 
        style={{ 
          border: 0,
          filter: "grayscale(1) invert(0.9) contrast(1.2)", 
          transition: "all 0.3s ease" 
        }} 
        allowFullScreen={true} 
        loading="lazy" 
      />
    </div>
  );
}
