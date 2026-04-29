"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, BarChart3 } from 'lucide-react';
import styles from './candidates.module.css';

// ─── CANDIDATE PORTRAITS (Avataaars SVG files in /public/candidates/) ─────────
const portraits: Record<string, React.ReactNode> = {
  '1': <Image src="/candidates/modi.png"     alt="Narendra Modi"      width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '2': <Image src="/candidates/rahul.png"    alt="Rahul Gandhi"       width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '3': <Image src="/candidates/mamata.png"   alt="Mamata Banerjee"    width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '4': <Image src="/candidates/kejriwal.png" alt="Arvind Kejriwal"    width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '5': <Image src="/candidates/akhilesh.png" alt="Akhilesh Yadav"     width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '6': <Image src="/candidates/mayawati.png" alt="Mayawati"           width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '7': <Image src="/candidates/stalin.png"   alt="M. K. Stalin"       width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '8': <Image src="/candidates/nikhil.png"   alt="Nikhil Kumaraswamy" width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
  '9': <Image src="/candidates/uddhav.png"   alt="Uddhav Thackeray"   width={80} height={80} style={{ borderRadius: 8, objectFit: 'cover' }} />,
};


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
  color: string;
}

export default function CandidatesPage() {
  const [candidates] = useState<Candidate[]>([
    {
      id: '1', name: 'Narendra Modi', party: 'Bharatiya Janata Party (BJP)', education: 'M.A.', assetsStr: '₹ 3.02 Crores', liabilitiesStr: '₹ 0', assetsRaw: 30200000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#ff9933',
      promises: [{ id: 'p1', text: 'Ram Mandir Construction', delivered: true }, { id: 'p2', text: 'Article 370 Abrogation', delivered: true }]
    },
    {
      id: '2', name: 'Rahul Gandhi', party: 'Indian National Congress (INC)', education: 'M.Phil', assetsStr: '₹ 20.4 Crores', liabilitiesStr: '₹ 49.7 Lakhs', assetsRaw: 204000000, liabilitiesRaw: 4970000, cases: 18, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#19aaed',
      promises: [{ id: 'p4', text: 'NYAY Scheme', delivered: false }, { id: 'p5', text: 'Caste Census', delivered: false }]
    },
    {
      id: '3', name: 'Mamata Banerjee', party: 'All India Trinamool Congress', education: 'M.A., L.L.B', assetsStr: '₹ 16.7 Lakhs', liabilitiesStr: '₹ 0', assetsRaw: 1670000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#20c040',
      promises: [{ id: 'p6', text: 'Kanyashree Prakalpa', delivered: true }]
    },
    {
      id: '4', name: 'Arvind Kejriwal', party: 'Aam Aadmi Party (AAP)', education: 'B.Tech', assetsStr: '₹ 3.4 Crores', liabilitiesStr: '₹ 0', assetsRaw: 34000000, liabilitiesRaw: 0, cases: 47, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#0066ff',
      promises: [{ id: 'p7', text: 'Free Electricity (200 units)', delivered: true }, { id: 'p8', text: 'Mohalla Clinics', delivered: true }]
    },
    {
      id: '5', name: 'Akhilesh Yadav', party: 'Samajwadi Party (SP)', education: 'M.Tech', assetsStr: '₹ 42.1 Crores', liabilitiesStr: '₹ 2.8 Crores', assetsRaw: 421000000, liabilitiesRaw: 28000000, cases: 2, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#ff0000',
      promises: [{ id: 'p9', text: 'Agra-Lucknow Expressway', delivered: true }]
    },
    {
      id: '6', name: 'Mayawati', party: 'Bahujan Samaj Party (BSP)', education: 'B.A., L.L.B', assetsStr: '₹ 111.6 Crores', liabilitiesStr: '₹ 0', assetsRaw: 1116000000, liabilitiesRaw: 0, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#000066',
      promises: [{ id: 'p10', text: 'Dalit Empowerment', delivered: true }]
    },
    {
      id: '7', name: 'M. K. Stalin', party: 'Dravida Munnetra Kazhagam', education: 'B.A.', assetsStr: '₹ 8.9 Crores', liabilitiesStr: '₹ 0', assetsRaw: 89000000, liabilitiesRaw: 0, cases: 1, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#ffcc00',
      promises: [{ id: 'p11', text: 'Morning Breakfast Scheme', delivered: true }]
    },
    {
      id: '8', name: 'Nikhil Kumaraswamy', party: 'Janata Dal (Secular)', education: 'B.Com', assetsStr: '₹ 75 Crores', liabilitiesStr: '₹ 35 Crores', assetsRaw: 750000000, liabilitiesRaw: 350000000, cases: 0, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#00aa00',
      promises: []
    },
    {
      id: '9', name: 'Uddhav Thackeray', party: 'Shiv Sena (UBT)', education: 'B.F.A.', assetsStr: '₹ 143.3 Crores', liabilitiesStr: '₹ 15.5 Crores', assetsRaw: 1433000000, liabilitiesRaw: 155000000, cases: 1, affidavitUrl: 'https://affidavit.eci.gov.in/',
      color: '#ff4500',
      promises: [{ id: 'p13', text: 'Farm Loan Waiver', delivered: true }]
    }
  ]);

  return (
    <main className={`container main-container ${styles.candidatesPage}`}>
      <div className={styles.header}>
        <h1>Candidate Intel & Analytics</h1>
        <p className="text-secondary">Analyze wealth distributions, criminal records, and official ECI affidavits before casting your vote.</p>
      </div>

      <div className={styles.candidateGrid}>
        {candidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </main>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const totalFinancials = candidate.assetsRaw + candidate.liabilitiesRaw;
  const assetPercentage = totalFinancials === 0 ? 0 : (candidate.assetsRaw / totalFinancials) * 100;
  const liabilityPercentage = totalFinancials === 0 ? 0 : (candidate.liabilitiesRaw / totalFinancials) * 100;

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div className={styles.candidateImage}>
          {portraits[candidate.id]}
        </div>
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

        <div className={styles.chartBar}>
          <div className={styles.assetBar} style={{ width: `${assetPercentage}%` }} />
          <div className={styles.liabilityBar} style={{ width: `${liabilityPercentage}%` }} />
        </div>
      </div>

      <div className={styles.promises}>
        <h4 className={styles.promisesTitle}>PROMISE TRACKER</h4>
        <ul className={styles.promiseList}>
          {candidate.promises.map(p => (
            <li key={p.id} className={styles.promiseItem}>
              {p.delivered ? <CheckCircle size={18} className={styles.iconDelivered} /> : <XCircle size={18} className={styles.iconPending} />}
              <span className={p.delivered ? styles.textDelivered : styles.textPending}>{p.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <a href={candidate.affidavitUrl} target="_blank" rel="noopener noreferrer" className={styles.eciButton}>
        View ECI Affidavit <ExternalLink size={16} />
      </a>
    </div>
  );
}
