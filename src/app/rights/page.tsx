"use client";

import React from 'react';
import { EyeOff, AlertOctagon, Scale, BadgeHelp, ShieldAlert } from 'lucide-react';
import styles from './rights.module.css';

export default function RightsPage() {
  return (
    <main className={`container main-container ${styles.rightsPage}`}>
      <div className={styles.header}>
        <h1>Know Your Rights</h1>
        <p className="text-secondary">Most voters are unaware of their legal rights at the polling booth. Familiarize yourself and don&apos;t let anyone scam or force you.</p>
      </div>

      <div className={styles.rightsGrid}>
        
        <div className={`glass-card ${styles.rightCard}`}>
          <div className={`${styles.iconContainer} ${styles.blueIcon}`}>
            <EyeOff size={32} />
          </div>
          <h3>Right to Secret Ballot</h3>
          <p>Nobody can force you to reveal who you voted for. Your vote is completely confidential.</p>
        </div>

        <div className={`glass-card ${styles.rightCard}`}>
          <div className={`${styles.iconContainer} ${styles.roseIcon}`}>
            <AlertOctagon size={32} />
          </div>
          <h3>NOTA (None of the Above)</h3>
          <p>If you do not like any of the candidates, you have the right to press the NOTA button at the end of the EVM.</p>
        </div>

        <div className={`glass-card ${styles.rightCard}`}>
          <div className={`${styles.iconContainer} ${styles.emeraldIcon}`}>
            <Scale size={32} />
          </div>
          <h3>Right against Denial</h3>
          <p>If your name is on the electoral roll, you cannot be denied the right to vote, even if your name has a minor spelling error.</p>
        </div>

        <div className={`glass-card ${styles.rightCard}`}>
          <div className={`${styles.iconContainer} ${styles.violetIcon}`}>
            <BadgeHelp size={32} />
          </div>
          <h3>Right to Assistance</h3>
          <p>Disabled or elderly voters have the right to bring a companion to the voting booth to help them cast their vote.</p>
        </div>

        <div className={`glass-card ${styles.rightCard}`}>
          <div className={`${styles.iconContainer} ${styles.amberIcon}`}>
            <ShieldAlert size={32} />
          </div>
          <h3>Right to Complain</h3>
          <p>If someone offers you money or liquor for your vote, or if you spot any violations, you have the right to report it via the cVIGIL app.</p>
        </div>
      </div>

      <div className={`glass-card ${styles.warningCard}`}>
        <h2>WARNING</h2>
        <p>If anyone tries to bribe you or force you to vote for a specific candidate, consider them an unfit candidate trying to scam the democratic process. <a href="https://cvigil.eci.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: 'bold' }}>Legal Complaints</a></p>
      </div>

    </main>
  );
}
