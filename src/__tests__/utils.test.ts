import { getCountdown, getGrade, sanitizeInput, generateICSString } from "@/lib/utils";

// ═══════════════════════════════════════════════
// getCountdown — 8 comprehensive test cases
// ═══════════════════════════════════════════════
describe("getCountdown", () => {
  it("returns null for a past date", () => {
    expect(getCountdown("2000-01-01")).toBeNull();
  });

  it("returns null for today (exact boundary)", () => {
    const yesterday = new Date(Date.now() - 1000).toISOString();
    expect(getCountdown(yesterday)).toBeNull();
  });

  it("returns positive countdown for future date", () => {
    const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const cd = getCountdown(future);
    expect(cd).not.toBeNull();
    expect(cd!.days).toBeGreaterThanOrEqual(2);
  });

  it("days never exceed expected ceiling for 10-day future", () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    expect(getCountdown(future)!.days).toBeLessThanOrEqual(10);
  });

  it("hours are between 0 and 23", () => {
    const future = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString();
    const cd = getCountdown(future);
    if (cd) {
      expect(cd.hours).toBeGreaterThanOrEqual(0);
      expect(cd.hours).toBeLessThan(24);
    }
  });

  it("minutes are between 0 and 59", () => {
    const future = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const cd = getCountdown(future);
    if (cd) {
      expect(cd.minutes).toBeGreaterThanOrEqual(0);
      expect(cd.minutes).toBeLessThan(60);
    }
  });

  it("handles ISO string format", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(() => getCountdown(future)).not.toThrow();
  });

  it("handles YYYY-MM-DD format", () => {
    expect(() => getCountdown("2030-12-31")).not.toThrow();
    expect(getCountdown("2030-12-31")).not.toBeNull();
  });
});

// ═══════════════════════════════════════════════
// getGrade — 10 test cases covering all branches
// ═══════════════════════════════════════════════
describe("getGrade", () => {
  it("perfect score → ELECTION EXPERT", () => {
    expect(getGrade(5, 5).title).toBe("ELECTION EXPERT");
  });

  it("90% → ELECTION EXPERT", () => {
    expect(getGrade(9, 10).title).toBe("ELECTION EXPERT");
  });

  it("exactly 90% → ELECTION EXPERT", () => {
    expect(getGrade(90, 100).title).toBe("ELECTION EXPERT");
  });

  it("89% → INFORMED CITIZEN", () => {
    expect(getGrade(89, 100).title).toBe("INFORMED CITIZEN");
  });

  it("60% → INFORMED CITIZEN", () => {
    expect(getGrade(6, 10).title).toBe("INFORMED CITIZEN");
  });

  it("70% → INFORMED CITIZEN", () => {
    expect(getGrade(7, 10).title).toBe("INFORMED CITIZEN");
  });

  it("59% → NOVICE VOTER", () => {
    expect(getGrade(59, 100).title).toBe("NOVICE VOTER");
  });

  it("0 score → NOVICE VOTER", () => {
    expect(getGrade(0, 10).title).toBe("NOVICE VOTER");
  });

  it("zero total edge case → NOVICE VOTER", () => {
    expect(getGrade(0, 0).title).toBe("NOVICE VOTER");
  });

  it("correct colors for all grades", () => {
    expect(getGrade(10, 10).color).toBe("var(--accent-emerald)");
    expect(getGrade(6, 10).color).toBe("var(--accent-amber)");
    expect(getGrade(1, 10).color).toBe("var(--accent-rose)");
  });
});

// ═══════════════════════════════════════════════
// sanitizeInput — 7 security test cases
// ═══════════════════════════════════════════════
describe("sanitizeInput", () => {
  it("strips < character (XSS prevention)", () => {
    expect(sanitizeInput("<script>")).not.toContain("<");
  });

  it("strips > character (XSS prevention)", () => {
    expect(sanitizeInput(">alert</script>")).not.toContain(">");
  });

  it("strips full XSS payload", () => {
    const xss = '<img src=x onerror="alert(1)">';
    expect(sanitizeInput(xss)).not.toContain("<");
    expect(sanitizeInput(xss)).not.toContain(">");
  });

  it("caps at 4000 chars by default", () => {
    expect(sanitizeInput("a".repeat(5000)).length).toBe(4000);
  });

  it("respects custom maxLen", () => {
    expect(sanitizeInput("hello world", 5)).toBe("hello");
  });

  it("passes safe election question unchanged", () => {
    const q = "What is the voting age in India?";
    expect(sanitizeInput(q)).toBe(q);
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });
});

// ═══════════════════════════════════════════════
// generateICSString — 7 calendar format tests
// ═══════════════════════════════════════════════
describe("generateICSString", () => {
  it("starts with BEGIN:VCALENDAR", () => {
    const ics = generateICSString("Test", "2026-12-31", "desc");
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
  });

  it("ends with END:VCALENDAR", () => {
    const ics = generateICSString("Test", "2026-12-31", "desc");
    expect(ics.endsWith("END:VCALENDAR")).toBe(true);
  });

  it("contains VEVENT block", () => {
    const ics = generateICSString("T", "2026-01-01", "d");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("includes SUMMARY with title", () => {
    const ics = generateICSString("Vote Day", "2026-06-01", "d");
    expect(ics).toContain("SUMMARY:Vote Day");
  });

  it("formats DTSTART correctly", () => {
    const ics = generateICSString("T", "2026-06-01", "d");
    expect(ics).toContain("DTSTART:20260601T090000");
  });

  it("pads single-digit months", () => {
    const ics = generateICSString("T", "2026-01-05", "d");
    expect(ics).toContain("DTSTART:20260105T090000");
  });

  it("includes DESCRIPTION", () => {
    const ics = generateICSString("T", "2026-01-01", "Check your voter ID");
    expect(ics).toContain("DESCRIPTION:Check your voter ID");
  });
});
