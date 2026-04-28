"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./regions.module.css";
import statesData from "@/data/states.json";
import { ExternalLink, Info, MapPin, Building2, Users, Landmark, Map } from "lucide-react";

// Dynamically import map to avoid SSR issues
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
      LOADING MAP...
    </div>
  ),
});

const MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";

export default function RegionsPage() {
  const [selectedState, setSelectedState] = useState(statesData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(true);

  const filteredStates = statesData.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mapStates = statesData.map((s) => ({
    id: s.id,
    name: s.name,
    lat: s.lat,
    lng: s.lng,
    constituencies: s.constituencies,
    website: s.website,
  }));

  return (
    <div className={styles.wrapper}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      <header className={styles.header}>
        <div className={styles.badge}>GEOGRAPHIC INSIGHTS</div>
        <h1 className={styles.title}>
          REGIONAL <span className={styles.accent}>PORTALS</span>
        </h1>
        <p className={styles.subtitle}>
          Navigate through India&apos;s diverse electoral landscape and access
          official state-specific resources.
        </p>

        {/* Map toggle */}
        <button
          className={styles.mapToggle}
          onClick={() => setShowMap(!showMap)}
          aria-label={showMap ? "Hide map" : "Show interactive map"}
        >
          <Map size={16} />
          {showMap ? "HIDE MAP" : "SHOW INDIA MAP"}
        </button>
      </header>

      {/* Map Panel */}
      {showMap && (
        <div className={styles.mapPanel} aria-label="Interactive map of India">
          <InteractiveMap
            states={mapStates}
            selectedStateId={selectedState.id}
            onStateSelect={(s) => {
              const full = statesData.find((st) => st.id === s.id);
              if (full) setSelectedState(full);
            }}
          />
        </div>
      )}

      <main className={styles.main}>
        {/* State Selector Sidebar */}
        <aside className={styles.sidebar} aria-label="State selection panel">
          <div className={styles.sidebarHeader}>SELECT STATE</div>
          <div className={styles.searchBox}>
            <input
              type="search"
              placeholder="Search state..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search states and union territories"
            />
          </div>
          <div className={styles.stateList} role="listbox" aria-label="States list">
            {filteredStates.map((state) => (
              <button
                key={state.id}
                role="option"
                aria-selected={selectedState.id === state.id}
                className={`${styles.stateBtn} ${
                  selectedState.id === state.id ? styles.activeState : ""
                }`}
                onClick={() => setSelectedState(state)}
              >
                <MapPin size={14} aria-hidden="true" />
                <span>{state.name}</span>
                <span className={styles.stateType}>{state.type}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Detail View */}
        <section className={styles.detailView} aria-live="polite" aria-label="State details">
          <div
            className={`${styles.detailCard} fade-in-up`}
            key={selectedState.id}
          >
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.stateName}>{selectedState.name}</h2>
                <span className={styles.stateTypeBadge}>
                  {selectedState.type === "UT" ? "Union Territory" : "State"}
                </span>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>CAPITAL</span>
                <span className={styles.statValue}>
                  <Building2 size={16} aria-hidden="true" style={{ opacity: 0.5 }} />
                  {selectedState.capital}
                </span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>LOK SABHA SEATS</span>
                <span className={styles.statValue}>
                  <Users size={16} aria-hidden="true" style={{ opacity: 0.5 }} />
                  {selectedState.constituencies}
                </span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>ELECTION COMMISSION</span>
                <span className={styles.statValueSm}>{selectedState.commissioner}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>REGIONAL PORTAL</span>
                <a
                  href={selectedState.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.portalLink}
                  aria-label={`Visit official website for ${selectedState.name}`}
                >
                  VISIT SITE <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className={styles.factSection} role="note">
              <div className={styles.infoTitle}>
                <Landmark size={18} aria-hidden="true" />
                DID YOU KNOW?
              </div>
              <p className={styles.factText}>{selectedState.fact}</p>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoTitle}>
                <Info size={18} aria-hidden="true" />
                STATE GUIDELINES
              </div>
              <p className={styles.infoText}>
                The Election Commission of India (ECI) manages the voting
                process in {selectedState.name}. Ensure you check the local
                holiday declaration for polling day and verify your name in the
                final published electoral roll for your specific constituency.
              </p>
            </div>

            <div className={styles.ctaBox}>
              <a
                href="https://voters.eci.gov.in/signup"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Register to vote — redirected to official ECI portal`}
              >
                <button className="btn-primary">
                  REGISTER IN {selectedState.name.toUpperCase()}
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
