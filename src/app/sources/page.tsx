import React from 'react';
import { ExternalLink, Database, ShieldCheck, Info } from 'lucide-react';
import styles from './sources.module.css';

export default function SourcesPage() {
  const sources = [
    { title: "Election Commission of India (ECI)", url: "https://eci.gov.in/", desc: "Primary source for all election laws, procedures, and official announcements." },
    { title: "Voters' Service Portal", url: "https://voters.eci.gov.in/", desc: "Official portal for voter registration, EPIC downloads, and roll verification." },
    { title: "ECI Affidavit Portal", url: "https://affidavit.eci.gov.in/", desc: "Source for candidate criminal records, assets, and educational qualifications." },
    { title: "Digital Sansad / Lok Sabha", url: "https://loksabha.nic.in/", desc: "Source for parliamentary seat data and constitutional frameworks." },
  ];

  return (
    <main className="container main-container">
      <div className={styles.header}>
        <Database size={40} className={styles.headerIcon} />
        <h1>Authoritative Data Sources</h1>
        <p className="text-secondary">ElectEd strictly relies on verified government portals to ensure 100% accuracy in civic education.</p>
      </div>

      <div className={styles.grid}>
        {sources.map((s, i) => (
          <div key={i} className="glass-card p-6">
            <h3 className="flex items-center gap-2 mb-2">
              <ShieldCheck size={20} className="text-accent-emerald" />
              {s.title}
            </h3>
            <p className="text-secondary mb-4">{s.desc}</p>
            <a 
              href={s.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline text-sm py-2"
            >
              Verify Source <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        ))}
      </div>

      <div className="glass-card mt-8 p-6">
        <div className="flex gap-4">
          <Info size={32} className="text-accent-blue flex-shrink-0" />
          <div>
            <h3 className="mb-2">AI Accuracy & Verification</h3>
            <p className="text-secondary">
              Our AI Assistant is grounded in the latest ECI manuals and constitutional documents. 
              While we strive for absolute accuracy, always refer to the official portals listed above for legal or administrative actions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
