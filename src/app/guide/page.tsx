"use client";

import { useState } from "react";
import styles from "./guide.module.css";
import guideSteps from "@/data/guide-steps.json";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GuidePage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = guideSteps[currentStepIdx];
  const progress = ((currentStepIdx + 1) / guideSteps.length) * 100;

  const nextStep = () => {
    if (currentStepIdx < guideSteps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      
      {/* Narrative Progress Header */}
      <header className={styles.header}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.stepCounter}>
            PHASE {currentStepIdx + 1} OF {guideSteps.length}
          </div>
          <h1 className={styles.stepTitle}>{currentStep.title}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.narrativeContainer}>
          <div className={`${styles.contentCard} fade-in-up`} key={currentStep.id}>
            <p className={styles.description}>{currentStep.description}</p>
            
            <div className={styles.mainText}>
              {currentStep.content}
            </div>

            <div className={styles.factsGrid}>
              {currentStep.keyFacts.map((fact, i) => (
                <div key={i} className={styles.factItem}>
                  <div className={styles.factDot} />
                  <span>{fact}</span>
                </div>
              ))}
            </div>

            {currentStep.tip && (
              <div className={styles.tipBox}>
                <span className={styles.tipLabel}>PRO TIP</span>
                <p>{currentStep.tip}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation HUD */}
      <footer className={styles.footerHUD}>
        <button 
          className={styles.navBtn} 
          onClick={prevStep} 
          disabled={currentStepIdx === 0}
        >
          <ChevronLeft size={20} />
          <span>PREVIOUS</span>
        </button>

        <div className={styles.journeyIndicator}>
          {guideSteps.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.dot} ${i === currentStepIdx ? styles.activeDot : ''} ${i < currentStepIdx ? styles.completedDot : ''}`}
            />
          ))}
        </div>

        {currentStepIdx < guideSteps.length - 1 ? (
          <button className={styles.navBtn} onClick={nextStep}>
            <span>CONTINUE JOURNEY</span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <Link href="/regions">
            <button className={`${styles.navBtn} ${styles.finishBtn}`}>
              <span>EXPLORE THE MAP</span>
              <ArrowRight size={20} />
            </button>
          </Link>
        )}
      </footer>
    </div>
  );
}
