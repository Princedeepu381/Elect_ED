/**
 * Utility: compute countdown from a future ISO date string.
 * Returns null if the date has passed.
 */
export function getCountdown(dateStr: string): { days: number; hours: number; minutes: number } | null {
  const now = new Date().getTime();
  const target = new Date(dateStr).getTime();
  const diff = target - now;
  if (diff <= 0) return null;

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

/**
 * Utility: derive grade label and colour from a quiz score.
 */
export function getGrade(score: number, total: number): { title: string; color: string } {
  if (total === 0) return { title: "NOVICE VOTER", color: "var(--accent-rose)" };
  const pct = (score / total) * 100;
  if (pct >= 90) return { title: "ELECTION EXPERT",  color: "var(--accent-emerald)" };
  if (pct >= 60) return { title: "INFORMED CITIZEN", color: "var(--accent-amber)" };
  return          { title: "NOVICE VOTER",            color: "var(--accent-rose)" };
}

/**
 * Utility: sanitize user input — strips HTML-dangerous chars and caps length.
 */
export function sanitizeInput(text: string, maxLen = 4000): string {
  return text.replace(/[<>]/g, "").slice(0, maxLen);
}

/**
 * Utility: generate an .ics calendar string for a reminder.
 */
export function generateICSString(title: string, dateStr: string, description: string): string {
  const date  = new Date(dateStr);
  const pad   = (n: number) => String(n).padStart(2, "0");
  const ymd   = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const dtStart = `${ymd}T090000`;
  const dtEnd   = `${ymd}T100000`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ElectEd//EN",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
