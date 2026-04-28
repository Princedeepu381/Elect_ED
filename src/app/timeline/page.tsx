"use client";

import { useState } from "react";
import styles from "./timeline.module.css";
import timelineEvents from "@/data/timeline-events.json";
import * as Icons from "lucide-react";

const phaseColors: Record<string, string> = {
  "pre-election": "var(--accent-blue)",
  "election": "var(--accent-emerald)",
  "post-election": "var(--accent-amber)",
};

const phaseLabels: Record<string, string> = {
  "pre-election": "PRE-ELECTION",
  "election": "ELECTION DAY",
  "post-election": "POST-ELECTION",
};

export default function TimelinePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      
      <header className={styles.header}>
        <div className={styles.badge}>CHRONOLOGY</div>
        <h1 className={styles.title}>THE ELECTION <span className={styles.accent}>CLOCK</span></h1>
        <p className={styles.subtitle}>A step-by-step timeline of the legal and procedural milestones in an Indian election.</p>
      </header>
      {/* Phase Legend */}
      <div className={styles.legend}>
        {Object.entries(phaseLabels).map(([key, label]) => (
          <div key={key} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: phaseColors[key] }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <main className={styles.timelineContainer}>
        <div className={styles.line} />
        
        {timelineEvents.map((item, i) => {
          const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[item.icon] || Icons.Circle;
          const color = phaseColors[item.phase] || "var(--accent-secondary)";
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`${styles.milestone} fade-in-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <div className={styles.markerContainer}>
                <div className={styles.dot} style={{ borderColor: color, boxShadow: `0 0 20px ${color}33` }}>
                  <div className={styles.innerDot} style={{ background: color }}>
                    <IconComponent size={16} />
                  </div>
                </div>
              </div>
              
              <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.contentHeader}>
                  <span className={styles.date} style={{ color }}>{item.period}</span>
                  <span className={styles.phaseBadge} style={{ color, borderColor: `${color}44` }}>{phaseLabels[item.phase]}</span>
                </div>
                <h3 className={styles.eventName}>{item.title}</h3>
                <p className={styles.desc}>{item.description}</p>
              </div>
            </div>
          );
        })}
      </main>

    </div>
  );
}
