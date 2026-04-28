"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Fingerprint, Lock, CheckCircle2, Volume2, Info } from 'lucide-react';
import styles from './evm.module.css';

interface EVMCandidate {
  id: string;
  name: string;
  party: string;
  symbol: React.ReactNode; 
  image?: string;
  isNota?: boolean;
}

const candidatesData: EVMCandidate[] = [
  { id: '1', name: 'Narendra Modi', party: 'Bharatiya Janata Party (BJP)', symbol: <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png" alt="Lotus" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/modi.jpg' },
  { id: '2', name: 'Rahul Gandhi', party: 'Indian National Congress (INC)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Indian_National_Congress_hand_logo.svg/1200px-Indian_National_Congress_hand_logo.svg.png" alt="Hand" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/rahul.jpg' },
  { id: '3', name: 'Mamata Banerjee', party: 'All India Trinamool Congress', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/All_India_Trinamool_Congress_logo.svg/1200px-All_India_Trinamool_Congress_logo.svg.png" alt="Flowers" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/mamata.jpg' },
  { id: '4', name: 'Arvind Kejriwal', party: 'Aam Aadmi Party (AAP)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Aam_Aadmi_Party_Logo.svg/1200px-Aam_Aadmi_Party_Logo.svg.png" alt="Broom" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/kejriwal.jpg' },
  { id: '5', name: 'Akhilesh Yadav', party: 'Samajwadi Party (SP)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Samajwadi_Party_logo.svg/1200px-Samajwadi_Party_logo.svg.png" alt="Bicycle" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/akhilesh.jpg' },
  { id: '6', name: 'Mayawati', party: 'Bahujan Samaj Party (BSP)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Bahujan_Samaj_Party_symbol.svg/1200px-Bahujan_Samaj_Party_symbol.svg.png" alt="Elephant" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/mayawati.jpg' },
  { id: '7', name: 'M. K. Stalin', party: 'Dravida Munnetra Kazhagam', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Dravida_Munnetra_Kazhagam_Rising_Sun.svg/1200px-Dravida_Munnetra_Kazhagam_Rising_Sun.svg.png" alt="Rising Sun" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/stalin.jpg' },
  { id: '8', name: 'Nikhil Kumaraswamy', party: 'Janata Dal (Secular)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Janata_Dal_%28Secular%29_logo.svg/1200px-Janata_Dal_%28Secular%29_logo.svg.png" alt="Farmer" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/nikhil.jpg' },
  { id: '9', name: 'Uddhav Thackeray', party: 'Shiv Sena (UBT)', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Shiv_Sena_Logo.svg/1200px-Shiv_Sena_Logo.svg.png" alt="Torch" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, image: '/candidates/uddhav.jpg' },
  { id: '10', name: 'NOTA', party: 'None of the Above', symbol: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/None_of_the_above_symbol.svg/1200px-None_of_the_above_symbol.svg.png" alt="NOTA" style={{width: '80%', height: '80%', objectFit: 'contain', display: 'inline-block', filter: 'brightness(0) invert(1)'}} />, isNota: true },
];

export default function EVMPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<EVMCandidate | null>(null);
  const [vvpatActive, setVvpatActive] = useState(false);
  const [voteCasted, setVoteCasted] = useState(false);
  const [vvpatTimer, setVvpatTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playEVMBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      // EVM beep is typically around 800-1000Hz
      osc.frequency.setValueAtTime(850, ctx.currentTime); 
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05); // Fade in
      gain.gain.setValueAtTime(0.5, ctx.currentTime + 3.0); // Hold for 3 seconds (EVM long beep)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.1); // Fade out
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.1);
    } catch (e) {
      console.error("Audio API not supported", e);
    }
  };

  const handleVote = (candidate: EVMCandidate) => {
    if (voteCasted || vvpatActive) return; // Prevent multiple votes during cycle

    setSelectedCandidate(candidate);
    setVvpatActive(true);
    setVvpatTimer(7);

    // 7-second VVPAT rule
    let currentTimer = 7;
    timerRef.current = setInterval(() => {
      currentTimer -= 1;
      setVvpatTimer(currentTimer);
      
      if (currentTimer <= 0) {
        clearInterval(timerRef.current!);
        setVvpatActive(false);
        setVoteCasted(true);
        
        // Play the audible EVM Beep
        playEVMBeep();

        setTimeout(() => {
          setSelectedCandidate(null);
          setVoteCasted(false);
        }, 3500); // Reset after showing "vote casted" success
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <main className={`container main-container ${styles.evmPage}`}>
      <div className={styles.header}>
        <h1>EVM & VVPAT Simulation</h1>
        <p className="text-secondary">Experience how the Electronic Voting Machine (EVM) and Voter Verifiable Paper Audit Trail (VVPAT) work. Your vote is secure, standalone, and verifiable.</p>
      </div>

      <div className={styles.simulationGrid}>
        
        {/* Balloting Unit */}
        <div className={styles.ballotingUnit}>
          <div className={styles.unitHeader}>
            <h3>BALLOTING UNIT</h3>
            <div className={styles.readyLight}>
              <div className={`${styles.light} ${!voteCasted && !vvpatActive ? styles.lightGreen : ''}`} />
              <span>READY</span>
            </div>
          </div>
          
          <div className={styles.candidatesList}>
            {candidatesData.map((c) => (
              <div key={c.id} className={styles.candidateRow}>
                <div className={styles.candidatePhoto}>
                  {c.image && !c.isNota ? (
                    <img src={c.image} alt={c.name} />
                  ) : (
                    <div className={styles.noPhoto} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.candidateDetails}>
                  <div className={styles.candidateName}>{c.name}</div>
                  <div className={styles.candidateParty}>{c.party}</div>
                </div>
                <div className={styles.candidateSymbol}>{c.symbol}</div>
                <div className={styles.votingControls}>
                  <div className={`${styles.redLight} ${selectedCandidate?.id === c.id ? styles.lightRedOn : ''}`} />
                  <button 
                    className={styles.blueButton}
                    onClick={() => handleVote(c)}
                    disabled={voteCasted || vvpatActive}
                    aria-label={`Vote for ${c.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VVPAT Unit */}
        <div className={styles.vvpatColumn}>
          <div className={styles.vvpatUnit}>
            <h3>VVPAT Slip</h3>
            <div className={styles.vvpatWindow}>
              <div className={styles.windowLabel}>VVPAT PRINTER WINDOW</div>
              <div className={styles.slipContainer}>
                {vvpatActive && selectedCandidate && (
                  <div className={styles.slip}>
                    <div className={styles.slipContent}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Sl. No: {selectedCandidate.id}</div>
                      <span className={styles.slipName}>{selectedCandidate.name}</span>
                      <div style={{ fontSize: '0.65rem', color: '#333', textAlign: 'center', marginBottom: '4px' }}>{selectedCandidate.party}</div>
                      <div className={styles.slipSymbol}>{selectedCandidate.symbol}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.boxLabel}>SEALED DROP BOX BELOW</div>
            </div>
          </div>

          {/* Status Feedback */}
          <div className={`glass-card ${styles.statusCard}`}>
            {voteCasted ? (
              <div className={styles.statusSuccess}>
                <Volume2 size={24} className={styles.pulseIcon} />
                <div>
                  <strong>BEEEEEEP!</strong>
                  <p>Vote successfully recorded.</p>
                </div>
              </div>
            ) : vvpatActive ? (
              <div className={styles.statusWarning}>
                <Info size={24} />
                <div>
                  <strong>Verify your slip ({vvpatTimer}s)</strong>
                  <p>The slip is visible for 7 seconds before dropping.</p>
                </div>
              </div>
            ) : (
              <div className={styles.statusIdle}>
                <Volume2 size={24} className={styles.muteIcon} />
                <div>
                  <strong>Live Status</strong>
                  <p>Please cast your vote by pressing the blue button.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.infoRow}>
        <div className={`glass-card ${styles.infoCard}`}>
          <ShieldAlert size={20} className={styles.infoIcon} />
          <h4>Standalone System</h4>
          <p>EVMs are not connected to the internet, Bluetooth, or any network. They physically cannot be hacked remotely.</p>
        </div>
        <div className={`glass-card ${styles.infoCard}`}>
          <Fingerprint size={20} className={styles.infoIcon} />
          <h4>The 7-Second Rule</h4>
          <p>The VVPAT slip is visible for exactly 7 seconds behind a glass window before it falls into the sealed drop box.</p>
        </div>
        <div className={`glass-card ${styles.infoCard}`}>
          <Lock size={20} className={styles.infoIcon} />
          <h4>Audit Trail</h4>
          <p>VVPAT slips from randomly selected booths are hand-counted and matched against the EVM digital count on result day.</p>
        </div>
      </div>
    </main>
  );
}
