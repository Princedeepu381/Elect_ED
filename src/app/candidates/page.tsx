"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, BarChart3 } from 'lucide-react';
import styles from './candidates.module.css';

interface PromiseItem {
  id: string;
  text: string;
  delivered: boolean;
}

interface Candidate {
  id: string;
  name: string;
  party: string;
  education: string;
  assetsStr: string;
  liabilitiesStr: string;
  assetsRaw: number;
  liabilitiesRaw: number;
  cases: number;
  promises: PromiseItem[];
  affidavitUrl: string;
}

export default function CandidatesPage() {
  const [candidates] = useState<Candidate[]>([
    {
      id: '1', name: 'Narendra Modi', party: 'Bharatiya Janata Party (BJP)', education: 'M.A.', assetsStr: '₹ 3.02 Crores', liabilitiesStr: '₹ 0', assetsRaw: 30200000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p1', text: 'Ram Mandir Construction', delivered: true }, { id: 'p2', text: 'Article 370 Abrogation', delivered: true }]
    },
    {
      id: '2', name: 'Rahul Gandhi', party: 'Indian National Congress (INC)', education: 'M.Phil', assetsStr: '₹ 20.4 Crores', liabilitiesStr: '₹ 49.7 Lakhs', assetsRaw: 204000000, liabilitiesRaw: 4970000, cases: 18, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p4', text: 'NYAY Scheme', delivered: false }, { id: 'p5', text: 'Caste Census', delivered: false }]
    },
    {
      id: '3', name: 'Mamata Banerjee', party: 'All India Trinamool Congress', education: 'M.A., L.L.B', assetsStr: '₹ 16.7 Lakhs', liabilitiesStr: '₹ 0', assetsRaw: 1670000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p6', text: 'Kanyashree Prakalpa', delivered: true }]
    },
    {
      id: '4', name: 'Arvind Kejriwal', party: 'Aam Aadmi Party (AAP)', education: 'B.Tech', assetsStr: '₹ 3.4 Crores', liabilitiesStr: '₹ 0', assetsRaw: 34000000, liabilitiesRaw: 0, cases: 47, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p7', text: 'Free Electricity (200 units)', delivered: true }, { id: 'p8', text: 'Mohalla Clinics', delivered: true }]
    },
    {
      id: '5', name: 'Akhilesh Yadav', party: 'Samajwadi Party (SP)', education: 'M.Tech', assetsStr: '₹ 42.1 Crores', liabilitiesStr: '₹ 2.8 Crores', assetsRaw: 421000000, liabilitiesRaw: 28000000, cases: 2, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p9', text: 'Agra-Lucknow Expressway', delivered: true }]
    },
    {
      id: '6', name: 'Mayawati', party: 'Bahujan Samaj Party (BSP)', education: 'B.A., L.L.B', assetsStr: '₹ 111.6 Crores', liabilitiesStr: '₹ 0', assetsRaw: 1116000000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p10', text: 'Dalit Empowerment', delivered: true }]
    },
    {
      id: '7', name: 'M. K. Stalin', party: 'Dravida Munnetra Kazhagam', education: 'B.A.', assetsStr: '₹ 8.8 Crores', liabilitiesStr: '₹ 0', assetsRaw: 88000000, liabilitiesRaw: 0, cases: 4, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p11', text: 'Free Bus Travel for Women', delivered: true }]
    },
    {
      id: '8', name: 'Nikhil Kumaraswamy', party: 'Janata Dal (Secular)', education: 'B.A.', assetsStr: '₹ 105.2 Crores', liabilitiesStr: '₹ 45.3 Crores', assetsRaw: 1052000000, liabilitiesRaw: 453000000, cases: 1, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p12', text: 'Farmers Loan Waiver Support', delivered: false }]
    },
    {
      id: '9', name: 'Uddhav Thackeray', party: 'Shiv Sena (UBT)', education: 'B.A.', assetsStr: '₹ 143.2 Crores', liabilitiesStr: '₹ 15.5 Crores', assetsRaw: 1432000000, liabilitiesRaw: 155000000, cases: 23, affidavitUrl: 'https://affidavit.eci.gov.in/',
      promises: [{ id: 'p13', text: 'Farm Loan Waiver (Mahatma Jyotirao Phule)', delivered: true }]
    }
  ]);
  const [loading] = useState(false);

  return (
    <main className={`container main-container ${styles.candidatesPage}`}>
      <div className={styles.header}>
        <h1>Candidate Intel & Analytics</h1>
        <p className="text-secondary">Analyze wealth distributions, criminal records, and official ECI affidavits before casting your vote.</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Analyzing candidate intel...</div>
      ) : (
        <div className={styles.candidateGrid}>
          {candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </main>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  // Analytics calculations
  const totalFinancials = candidate.assetsRaw + candidate.liabilitiesRaw;
  const assetPercentage = totalFinancials === 0 ? 0 : (candidate.assetsRaw / totalFinancials) * 100;
  const liabilityPercentage = totalFinancials === 0 ? 0 : (candidate.liabilitiesRaw / totalFinancials) * 100;

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div className={styles.candidateInfo}>
          <h3>{candidate.name}</h3>
          <span className={styles.party}>{candidate.party}</span>
          <span className={styles.education}>Education: {candidate.education}</span>
        </div>
        <div className={`${styles.casesBadge} ${candidate.cases > 0 ? styles.hasCases : styles.noCases}`}>
          <AlertCircle size={18} />
          <span>CASES: {candidate.cases}</span>
        </div>
      </div>

      {/* Analytics Section */}
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsHeader}>
          <BarChart3 size={16} />
          <span>FINANCIAL ANALYTICS</span>
        </div>
        
        <div className={styles.financialStats}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Assets</span>
            <span className={styles.statValue}>{candidate.assetsStr}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Liabilities</span>
            <span className={`${styles.statValue} ${styles.liabilityValue}`}>{candidate.liabilitiesStr}</span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className={styles.chartBar}>
          <div 
            className={styles.assetBar} 
            style={{ width: `${assetPercentage}%` }} 
            title={`Assets: ${assetPercentage.toFixed(1)}%`}
          />
          <div 
            className={styles.liabilityBar} 
            style={{ width: `${liabilityPercentage}%` }} 
            title={`Liabilities: ${liabilityPercentage.toFixed(1)}%`}
          />
        </div>
      </div>

      <div className={styles.promises}>
        <h4 className={styles.promisesTitle}>PROMISE TRACKER</h4>
        <ul className={styles.promiseList}>
          {candidate.promises.map(p => (
            <li key={p.id} className={styles.promiseItem}>
              {p.delivered ? (
                <CheckCircle size={18} className={styles.iconDelivered} />
              ) : (
                <XCircle size={18} className={styles.iconPending} />
              )}
              <span className={p.delivered ? styles.textDelivered : styles.textPending}>{p.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Direct ECI Link per candidate */}
      <a 
        href={candidate.affidavitUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.eciButton}
      >
        View ECI Affidavit <ExternalLink size={16} />
      </a>
    </div>
  );
}
