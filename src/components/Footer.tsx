import Link from "next/link";
import { Shield, Lock, Globe, Mail } from 'lucide-react';
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Elect<span>Ed</span>
          </Link>
          <div className={styles.authoritativeBadge}>AUTHORITATIVE ELECTION DATA</div>
          <p className={styles.description}>
            Empowering citizens to innovate, protect, and participate in the world&apos;s largest democracy.
          </p>
          <div className={styles.securitySealGroup}>
            <div className={styles.sealCircle} title="GLOBAL NETWORK"><Globe size={18} aria-hidden="true" /></div>
            <div className={styles.sealCircle} title="SECURE CONTACT"><Mail size={18} aria-hidden="true" /></div>
            <div className={styles.sealCircle} title="ENCRYPTED DATA"><Lock size={18} aria-hidden="true" /></div>
          </div>
        </div>
        
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h3>QUICK LINKS</h3>
            <Link href="/">Home</Link>
            <Link href="/guide">Election Guide</Link>
            <Link href="/timeline">Timeline</Link>
            <Link href="/quiz">Quizzes</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3>CONTROL PANEL</h3>
            <Link href="/regions">Regional Portals</Link>
            <Link href="/reminders">Incident Reminders</Link>
            <Link href="/sources">Data Sources</Link>
            <a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer">ECI Official</a>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.securitySeal}>
          <Shield size={14} className={styles.securityIcon} />
          <span className={styles.copyrightText}>
            &copy; 2026 ELECT_ED ALL RIGHTS RESERVED. &nbsp;&nbsp;&nbsp;&nbsp; MADE WITH ❤️ BY DEEPAK_M
          </span>
        </div>
      </div>
    </footer>
  );
}
