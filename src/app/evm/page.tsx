"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, ShieldCheck } from 'lucide-react';
import styles from './evm.module.css';

interface EVMCandidate {
  id: string;
  name: string;
  party: string;
  symbol: React.ReactNode;
  isNota?: boolean;
  color: string;
  portrait: React.ReactNode;
}

// ─── CANDIDATE DATA (using real image files) ─────────────────────────────────
const candidatesData: EVMCandidate[] = [
  {
    id: '1', name: 'Narendra Modi', party: 'BJP', color: '#ff9933',
    symbol: <Image src="/symbols/lotus.png" alt="Lotus" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/modi.png" alt="Modi" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '2', name: 'Rahul Gandhi', party: 'INC', color: '#19aaed',
    symbol: <Image src="/symbols/hand.png" alt="Hand" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/rahul.png" alt="Rahul" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '3', name: 'Mamata Banerjee', party: 'TMC', color: '#20c040',
    symbol: <Image src="/symbols/flowers.png" alt="Flowers" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/mamata.png" alt="Mamata" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '4', name: 'Arvind Kejriwal', party: 'AAP', color: '#0066ff',
    symbol: <Image src="/symbols/broom.png" alt="Broom" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/kejriwal.png" alt="Kejriwal" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '5', name: 'Akhilesh Yadav', party: 'SP', color: '#ff0000',
    symbol: <Image src="/symbols/bicycle.png" alt="Bicycle" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/akhilesh.png" alt="Akhilesh" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '6', name: 'Mayawati', party: 'BSP', color: '#000066',
    symbol: <Image src="/symbols/elephant.png" alt="Elephant" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/mayawati.png" alt="Mayawati" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '7', name: 'M. K. Stalin', party: 'DMK', color: '#cc0000',
    symbol: <Image src="/symbols/sun.svg" alt="Sun" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/stalin.png" alt="Stalin" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '8', name: 'Nikhil Kumaraswamy', party: 'JDS', color: '#2d6a2d',
    symbol: <Image src="/symbols/farmer.svg" alt="Farmer" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/nikhil.png" alt="Nikhil" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '9', name: 'Uddhav Thackeray', party: 'SS(UBT)', color: '#ff4500',
    symbol: <Image src="/symbols/torch.svg" alt="Torch" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: <Image src="/candidates/uddhav.png" alt="Uddhav" width={45} height={55} style={{ objectFit: 'cover', borderRadius: 4 }} />,
  },
  {
    id: '10', name: 'NOTA', party: 'None of the Above', color: '#334155',
    symbol: <Image src="/symbols/nota.svg" alt="NOTA" width={44} height={44} style={{ objectFit: 'contain' }} />,
    portrait: (
      <svg width="45" height="55" viewBox="0 0 45 55" xmlns="http://www.w3.org/2000/svg">
        <rect width="45" height="55" fill="#e2e8f0" rx="4" />
        <circle cx="22.5" cy="20" r="10" fill="#94a3b8" />
        <path d="M8 50c0-8 6-14 14.5-14s14.5 6 14.5 14v5H8v-5z" fill="#94a3b8" />
        <line x1="12" y1="38" x2="33" y2="52" stroke="#cc2200" strokeWidth="3" />
        <line x1="33" y1="38" x2="12" y2="52" stroke="#cc2200" strokeWidth="3" />
      </svg>
    ),
    isNota: true,
  },
];

export default function EVMPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<EVMCandidate | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showSlip, setShowSlip] = useState(false);

  const playBeep = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Audio playback failed (e.g. user hasn't interacted with document yet)
    }
  }, []);

  const handleVote = (candidate: EVMCandidate) => {
    if (isVoting) return;
    setIsVoting(true);
    setSelectedCandidate(candidate);
    playBeep();
    setTimeout(() => setShowSlip(true), 1000);
    setTimeout(() => {
      setShowSlip(false);
      setIsVoting(false);
      setSelectedCandidate(null);
    }, 8000); // 1000ms delay + 7000ms VVPAT display = 8000ms total
  };

  return (
    <main className={`container main-container ${styles.evmPage}`}>
      <div className={styles.header}>
        <h1>EVM & VVPAT SIMULATION</h1>
        <p className="text-secondary">Experience the secure, standalone, and verifiable voting process of the Election Commission of India.</p>
      </div>

      <div className={styles.simulationGrid}>
        <section className={styles.ballotingUnit} aria-label="Balloting Unit">
          <div className={styles.unitHeader}>
            <h3>BALLOTING UNIT</h3>
            <div className={styles.readyLight}>
              <div className={`${styles.light} ${!isVoting ? styles.lightGreen : ''}`} />
              <span>READY</span>
            </div>
          </div>
          
          <div className={styles.candidatesList}>
            {candidatesData.map((c) => (
              <div key={c.id} className={styles.candidateRow}>
                <span className={styles.candidateSlNo}>{c.id}</span>
                <div className={styles.candidatePhoto}>
                  {c.portrait}
                </div>
                <div className={styles.candidateDetails}>
                  <div className={styles.candidateName}>{c.name}</div>
                  <div className={styles.candidateParty}>{c.party}</div>
                </div>
                <div className={styles.candidateSymbol}>
                  {c.symbol}
                </div>
                <div className={styles.votingControls}>
                  <div className={`${styles.redLight} ${selectedCandidate?.id === c.id ? styles.lightRedOn : ''}`} />
                  <button 
                    className={styles.blueButton}
                    onClick={() => handleVote(c)}
                    disabled={isVoting}
                    aria-label={`Vote for ${c.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.vvpatColumn}>
          <section className={styles.vvpatUnit}>
            <h3>VVPAT SLIP</h3>
            <div className={styles.vvpatWindow}>
              <span className={styles.windowLabel}>VVPAT PRINTER WINDOW</span>
              <div className={styles.slipContainer}>
                {showSlip && selectedCandidate && (
                  <div className={styles.slip}>
                    <div className={styles.slipContent}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{selectedCandidate.id}</span>
                      <span className={styles.slipName}>{selectedCandidate.name}</span>
                      <div className={styles.slipSymbol}>
                        {selectedCandidate.symbol}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className={styles.boxLabel}>SEALED DROP BOX BELOW</span>
            </div>
          </section>

          <div className={`glass-card ${styles.statusCard}`}>
            {!isVoting ? (
              <div className={styles.statusIdle}>
                <Volume2 size={24} className={styles.muteIcon} />
                <span>Live Status: Please cast your vote by pressing the blue button.</span>
              </div>
            ) : showSlip ? (
              <div className={styles.statusWarning}>
                <ShieldCheck size={24} className={styles.pulseIcon} />
                <span>Verification: Confirming your selection on the VVPAT slip.</span>
              </div>
            ) : (
              <div className={styles.statusSuccess}>
                <ShieldCheck size={24} />
                <span>Processing: Registering your vote securely in the control unit.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
