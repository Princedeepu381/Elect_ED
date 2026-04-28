"use client";

import React, { useState } from 'react';
import { FileText, FileBadge, Image as ImageIcon, ExternalLink, CheckCircle } from 'lucide-react';
import styles from './registration.module.css';

type FormType = 'form6' | 'form8' | 'form7';

/**
 * Allows users to select a form, understand required documents, and securely proceed to the official ECI portal.
 */
export default function RegistrationPage() {
  const [activeForm, setActiveForm] = useState<FormType>('form6');

  const forms = {
    form6: { title: "Form 6: New Voter", desc: "Use this to get added to the Electoral Roll and get your new Voter ID (EPIC card).", icon: <FileBadge className={styles.icon} /> },
    form8: { title: "Form 8: Shift / Correction", desc: "Use this to correct details or shift your constituency.", icon: <FileText className={styles.icon} /> },
    form7: { title: "Form 7: Deletion", desc: "Use this to object to inclusion or seek deletion of name.", icon: <FileText className={styles.icon} /> },
  };

  return (
    <main className={`container main-container ${styles.registrationPage}`}>
      <div className={styles.header}>
        <h1>Smart Registration Guide</h1>
        <p className="text-secondary">Your TL;DR guide to getting registered on the Electoral Roll. Demystifying forms and documents.</p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {/* Form Selection */}
          <section className={`glass-card ${styles.section}`}>
            <h2 className={styles.sectionTitle}><span className={styles.stepNum}>1</span> Which Form Do You Need?</h2>
            
            <div className={styles.formSelector}>
              {(Object.keys(forms) as FormType[]).map((key) => (
                <button 
                  key={key} 
                  className={`${styles.formTab} ${activeForm === key ? styles.activeTab : ''}`}
                  onClick={() => setActiveForm(key)}
                  aria-pressed={activeForm === key}
                >
                  {forms[key].icon}
                  <span>{key.replace('form', 'Form ')}</span>
                </button>
              ))}
            </div>

            <div className={styles.formDetails}>
              <h3>{forms[activeForm].title}</h3>
              <p>{forms[activeForm].desc}</p>
            </div>
          </section>

          {/* Required Documents */}
          <section className={`glass-card ${styles.section}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><span className={styles.stepNum}>2</span> Required Documents</h2>
              <span className={styles.formBadge}>For {activeForm.replace('form', 'Form ')}</span>
            </div>

            <div className={styles.documentsList}>
              <DocumentInfoItem 
                title="Passport Size Photograph" 
                desc="Recent color photo with white background (max 2MB)" 
                icon={<ImageIcon />} 
              />
              <DocumentInfoItem 
                title="Age Proof" 
                desc="Birth Certificate, 10th/12th Marksheet, PAN, or Aadhaar" 
                icon={<FileText />} 
              />
              <DocumentInfoItem 
                title="Address Proof" 
                desc="Water/Electricity Bill, Aadhaar, Passport, or Rent Agreement" 
                icon={<FileBadge />} 
              />
            </div>

            <div className={styles.proTip}>
              <strong>Pro Tip:</strong> Ensure all documents are clear and ready as high-resolution scans before starting the ECI application.
            </div>
          </section>
        </div>

        <div className={styles.sideColumn}>
          {/* ECI Portal Card */}
          <aside className={`glass-card ${styles.eciCard}`}>
            <div className={styles.eciIcon} aria-hidden="true"><CheckCircle size={32} /></div>
            <h2>Ready to Register?</h2>
            <p>Registration is free, fully online, and takes only 10 minutes on the official Election Commission of India portal.</p>
            <a 
              href="https://voters.eci.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              aria-label="Go to official ECI portal"
            >
              Go to ECI Portal <ExternalLink size={18} />
            </a>
            <span className={styles.redirectNote}>Redirects to voters.eci.gov.in (Official Gov Portal)</span>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface DocumentInfoItemProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function DocumentInfoItem({ title, desc, icon }: DocumentInfoItemProps) {
  return (
    <div className={styles.docItem}>
      <div className={styles.docIcon}>{icon}</div>
      <div className={styles.docInfo}>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}
