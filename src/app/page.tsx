"use client";

import Link from 'next/link';
import styles from './home.module.css';
import { BookOpen, Clock, MessageSquare, Map, HelpCircle, Bell, ArrowRight, Zap, Target, Vote } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'THE GUIDE', desc: 'A narrative-driven journey from registration to results day.', href: '/guide', color: 'blue' },
  { icon: Clock, title: 'TIMELINE', desc: 'Animated chronological visualization of every election milestone.', href: '/timeline', color: 'violet' },
  { icon: MessageSquare, title: 'AI ASSISTANT', desc: 'Your 24/7 expert on election laws, powered by Google Gemini.', href: '#', color: 'cyan' },
  { icon: Map, title: 'REGIONS', desc: 'Interactive data for every state and union territory in India.', href: '/regions', color: 'emerald' },
  { icon: HelpCircle, title: 'QUIZ', desc: 'Test your civic knowledge with gamified learning modules.', href: '/quiz', color: 'amber' },
  { icon: Bell, title: 'REMINDERS', desc: 'Never miss a deadline — countdown timers and calendar sync.', href: '/reminders', color: 'rose' },
];

const stats = [
  { value: '960M+', label: 'REGISTERED VOTERS' },
  { value: '543', label: 'LOK SABHA SEATS' },
  { value: '36', label: 'STATES & UTs' },
];

const steps = [
  { num: '01', icon: Zap, title: 'LEARN', desc: 'Explore our step-by-step guide and interactive timeline to understand the entire election lifecycle.' },
  { num: '02', icon: Target, title: 'QUIZ', desc: 'Test your knowledge with gamified quizzes. Earn badges from Novice to Election Expert.' },
  { num: '03', icon: Vote, title: 'PARTICIPATE', desc: 'Register to vote, set reminders for deadlines, and become an active citizen of democracy.' },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      {/* ═══ LIVE TICKER ═══ */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          <span>LIVE PULSE 2026</span>
          <span>•</span>
          <span>960M+ REGISTERED VOTERS</span>
          <span>•</span>
          <span>1.4B DESTINIES SHAPED</span>
          <span>•</span>
          <span>VIRTUAL POLLING READY</span>
          <span>•</span>
          <span>LIVE PULSE 2026</span>
          <span>•</span>
          <span>960M+ REGISTERED VOTERS</span>
        </div>
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>FUTURE OF DEMOCRACY 2026</div>
            <h1 className={styles.title}>
              YOUR <span className={styles.accentText}>VOTE</span><br />
              YOUR <span className={styles.accentText}>POWER</span>
            </h1>
            <p className={styles.subtitle}>
              Step into the future of the Indian democratic process. 
              Discover how every vote shapes the destiny of 1.4 billion lives.
            </p>
            
            <div className={styles.actions}>
              <Link href="/guide">
                <button className="btn-primary">BEGIN YOUR JOURNEY</button>
              </Link>
              <Link href="/quiz">
                <button className="btn-outline">TEST YOUR KNOWLEDGE</button>
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.statCard}>
              <span className={styles.statVal}>960M+</span>
              <span className={styles.statLab}>REGISTERED VOTERS</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statVal}>543</span>
              <span className={styles.statLab}>LOK SABHA SEATS</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statVal}>36</span>
              <span className={styles.statLab}>STATES & UTS</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statVal}>1.4B</span>
              <span className={styles.statLab}>CITIZENS</span>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>EXPLORE THE WORLD</span>
          <div className={styles.line} />
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>FEATURES</div>
          <h2 className={styles.sectionTitle}>MISSION <span className={styles.accentText}>CONTROL</span></h2>
          <p className={styles.sectionSubtitle}>Six tools designed to transform you from voter to informed citizen.</p>
        </div>
        
        <div className={styles.featureGrid}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const isAI = f.title === 'AI ASSISTANT';
            
            return (
              <div 
                key={i} 
                className={styles.featureCard} 
                style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (isAI) {
                    window.dispatchEvent(new CustomEvent('open-chatbot'));
                  } else {
                    window.location.href = f.href;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (isAI) {
                      window.dispatchEvent(new CustomEvent('open-chatbot'));
                    } else {
                      window.location.href = f.href;
                    }
                  }
                }}
                aria-label={`Explore ${f.title}: ${f.desc}`}
              >
                <div className={`${styles.featureIcon} ${styles[f.color]}`}>
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className={styles.cardArrow}>
                  <ArrowRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ QUICK TOOLKIT ═══ */}
      <section className={styles.toolkitSection}>
        <div className={styles.toolkitContent}>
          <div className={styles.toolkitHeader}>
            <div className={styles.sectionBadge}>TOOLKIT</div>
            <h2 className={styles.sectionTitle}>VOTER <span className={styles.accentText}>EQUIPMENT</span></h2>
          </div>
          <div className={styles.toolkitGrid}>
            <a href="https://voters.eci.gov.in/signup" target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
              <div className={styles.toolIcon}><Zap size={24} /></div>
              <h4>REGISTER TO VOTE</h4>
              <p>Step-by-step guidance for Form 6 submission.</p>
            </a>
            <a href="https://electorallisting.eci.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
              <div className={styles.toolIcon}><Target size={24} /></div>
              <h4>VERIFY DETAILS</h4>
              <p>Check your name in the electoral rolls instantly.</p>
            </a>
            <a href="https://voterportal.eci.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
              <div className={styles.toolIcon}><Map size={24} /></div>
              <h4>FIND MY BOOTH</h4>
              <p>Interactive maps to locate your nearest polling station.</p>
            </a>
            <a href="https://affidavit.eci.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
              <div className={styles.toolIcon}><Vote size={24} /></div>
              <h4>KNOW CANDIDATES</h4>
              <p>Review affidavits and track records of candidates.</p>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className={styles.statsSection}>
        <div className={styles.statGrid}>
          {stats.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statNum}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className={styles.howSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>PROTOCOL</div>
          <h2 className={styles.sectionTitle}>HOW IT <span className={styles.accentText}>WORKS</span></h2>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}><Icon size={28} /></div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ CTA MISSION ═══ */}
      <section className={styles.missionSection}>
        <div className={styles.missionCard}>
          <h2>DEMOCRACY NEEDS YOU</h2>
          <p>Every citizen who understands the process strengthens the foundation of democracy. Start your journey today.</p>
          <Link href="/guide">
            <button className="btn-primary">START NOW</button>
          </Link>
        </div>
      </section>

    </div>
  );
}
