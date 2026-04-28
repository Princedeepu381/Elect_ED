"use client";

import { useState, useEffect } from "react";
import styles from "./reminders.module.css";
import { Bell, Calendar, Plus, Trash2, Clock, Download } from "lucide-react";
import remindersData from "@/data/reminders.json";

interface Reminder {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

function getCountdown(dateStr: string) {
  const now = new Date().getTime();
  const target = new Date(dateStr).getTime();
  const diff = target - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

function generateICS(reminder: Reminder) {
  const date = new Date(reminder.date);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dtStart = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T090000`;
  const dtEnd = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}T100000`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ElectEd//EN',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${reminder.title}`,
    `DESCRIPTION:${reminder.description}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reminder.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(remindersData);
  const [newTitle, setNewTitle] = useState("");
  const [countdowns, setCountdowns] = useState<Record<string, ReturnType<typeof getCountdown>>>({});

  useEffect(() => {
    const update = () => {
      const cds: Record<string, ReturnType<typeof getCountdown>> = {};
      reminders.forEach(r => {
        cds[r.id] = getCountdown(r.date);
      });
      setCountdowns(cds);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const addReminder = () => {
    if (!newTitle.trim()) return;
    const newId = `custom-${Date.now()}`;
    setReminders([...reminders, {
      id: newId,
      title: newTitle.trim(),
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: "custom",
      description: "Custom reminder added by user."
    }]);
    setNewTitle("");
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const upcoming = reminders
    .filter(r => getCountdown(r.date) !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const past = reminders.filter(r => getCountdown(r.date) === null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'election': return 'var(--accent-rose)';
      case 'deadline': return 'var(--accent-amber)';
      case 'event': return 'var(--accent-cyan)';
      default: return 'var(--accent-secondary)';
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      
      <header className={styles.header}>
        <div className={styles.badge}>NOTIFICATIONS</div>
        <h1 className={styles.title}>VOTER <span className={styles.accent}>REMINDERS</span></h1>
        <p className={styles.subtitle}>Stay informed about critical deadlines and election events. Never miss your democratic duty.</p>
      </header>

      <main className={styles.main}>
        <div className={styles.addSection}>
          <input 
            type="text" 
            placeholder="ADD NEW DEADLINE..." 
            className={styles.input}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addReminder()}
            aria-label="Add new reminder"
          />
          <button className={styles.addBtn} onClick={addReminder}>
            <Plus size={20} />
            ADD
          </button>
        </div>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <>
            <div className={styles.sectionLabel}>
              <Bell size={16} />
              UPCOMING ({upcoming.length})
            </div>
            <div className={styles.list}>
              {upcoming.map((r, i) => {
                const cd = countdowns[r.id];
                const isNearest = i === 0;
                return (
                  <div
                    key={r.id}
                    className={`${styles.card} ${isNearest ? styles.nearestCard : ''} fade-in-up`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={styles.typeTag} style={{ color: getTypeColor(r.type) }}>
                      {r.type.toUpperCase()}
                      {isNearest && <span className={styles.nextBadge}>NEXT</span>}
                    </div>
                    <h3 className={styles.cardTitle}>{r.title}</h3>
                    <p className={styles.cardDesc}>{r.description}</p>
                    
                    {cd && (
                      <div className={styles.countdown}>
                        <div className={styles.countItem}>
                          <span className={styles.countNum}>{cd.days}</span>
                          <span className={styles.countLabel}>DAYS</span>
                        </div>
                        <div className={styles.countSep}>:</div>
                        <div className={styles.countItem}>
                          <span className={styles.countNum}>{cd.hours}</span>
                          <span className={styles.countLabel}>HRS</span>
                        </div>
                        <div className={styles.countSep}>:</div>
                        <div className={styles.countItem}>
                          <span className={styles.countNum}>{cd.minutes}</span>
                          <span className={styles.countLabel}>MIN</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      <div className={styles.meta}>
                        <div className={styles.metaItem}>
                          <Calendar size={14} />
                          <span>{r.date}</span>
                        </div>
                      </div>
                      <div className={styles.actionBtns}>
                        <button className={styles.calBtn} onClick={() => generateICS(r)} title="Add to Calendar">
                          <Download size={16} />
                          .ICS
                        </button>
                        <button className={styles.deleteBtn} onClick={() => deleteReminder(r.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <>
            <div className={styles.sectionLabel} style={{ opacity: 0.5 }}>
              <Clock size={16} />
              PAST EVENTS ({past.length})
            </div>
            <div className={styles.list}>
              {past.map((r) => (
                <div key={r.id} className={`${styles.card} ${styles.pastCard}`}>
                  <div className={styles.typeTag} style={{ color: 'var(--text-muted)' }}>
                    {r.type.toUpperCase()}
                  </div>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

    </div>
  );
}
