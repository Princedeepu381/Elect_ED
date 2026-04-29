"use client";

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
}

/**
 * OFFICIAL GOOGLE MAPS EMBED SERVICE
 * Using Google Cloud Maps Embed API for the hackathon submission.
 */
export default function InteractiveMap({ states, selectedStateId }: InteractiveMapProps) {
  const selectedState = states.find((s) => s.id === selectedStateId);
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  if (!selectedState) {
    return (
      <div style={{ width: "100%", height: "400px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#111", color: "#666" }}>
        SELECT A STATE TO VIEW GOOGLE MAP
      </div>
    );
  }

  // Official Google Maps Embed API URL (Place Mode)
  // This is the most stable and professional way to embed Google Maps.
  const embedUrl = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(selectedState.name)}%20India`
    : `https://www.google.com/maps?q=${encodeURIComponent(selectedState.name)}%20India&output=embed`;

  return (
    <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", position: "relative", backgroundColor: "#111", border: "1px solid #334155" }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
      ></iframe>
      <div style={{ position: "absolute", bottom: "10px", right: "10px", padding: "4px 8px", background: "rgba(0,0,0,0.6)", color: "white", fontSize: "10px", borderRadius: "4px", pointerEvents: "none" }}>
        GOOGLE MAPS | {selectedState.name.toUpperCase()}
      </div>
    </div>
  );
}
