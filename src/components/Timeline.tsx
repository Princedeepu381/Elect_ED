"use client";

import styles from "./Timeline.module.css";
import * as Icons from "lucide-react";

interface TimelineEvent {
  id: string;
  title: string;
  period: string;
  phase: string;
  description: string;
  icon: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.line}>
        <div className={styles.linePulse} />
      </div>
      
      {events.map((event, index) => {
        const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[event.icon] || Icons.Circle;
        
        return (
          <div 
            key={event.id} 
            className={`${styles.eventWrapper} animate-fade-up`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`${styles.dot} ${styles[event.phase]}`}>
              <div className={styles.dotInner}>
                <IconComponent size={20} />
              </div>
              <div className={styles.glow} />
            </div>
            
            <div className={`${styles.content} glass-card`}>
              <div className={styles.header}>
                <span className={styles.period}>{event.period}</span>
                <span className={`${styles.badge} ${styles[event.phase]}`}>
                  {event.phase.replace("-", " ")}
                </span>
              </div>
              <h3 className={styles.title}>{event.title}</h3>
              <p className={styles.description}>{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
