import { sanitizeInput, getGrade, getCountdown } from "@/lib/utils";

describe("Chat API — input validation guards", () => {
  it("sanitizeInput removes script injection attempts", () => {
    const malicious = '<img src=x onerror="alert(1)">';
    const result = sanitizeInput(malicious);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("sanitizeInput allows normal election questions", () => {
    const q = "What is the voting age in India?";
    expect(sanitizeInput(q)).toBe(q);
  });

  it("sanitizeInput enforces 4000 char limit", () => {
    const q = "a".repeat(10_000);
    expect(sanitizeInput(q).length).toBe(4000);
  });
});

describe("Quiz scoring integrity", () => {
  const cases: [number, number, string][] = [
    [5, 5,  "ELECTION EXPERT"],
    [9, 10, "ELECTION EXPERT"],
    [6, 10, "INFORMED CITIZEN"],
    [8, 10, "INFORMED CITIZEN"],
    [5, 10, "NOVICE VOTER"],
    [0, 10, "NOVICE VOTER"],
  ];

  test.each(cases)(
    "score %i/%i → %s",
    (score, total, expected) => {
      expect(getGrade(score, total).title).toBe(expected);
    }
  );
});

describe("Reminder countdown logic", () => {
  it("past dates return null (deadline missed)", () => {
    expect(getCountdown("2020-01-01")).toBeNull();
  });

  it("future dates return a valid countdown object", () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const cd = getCountdown(future);
    expect(cd).toBeDefined();
    expect(cd!.days).toBeGreaterThan(0);
  });
});
