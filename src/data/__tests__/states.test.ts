import statesData from "../states.json";

describe("States Data Integrity", () => {
  test("should have all 36 States and Union Territories", () => {
    expect(statesData.length).toBe(36);
  });

  test("should have unique IDs for all entries", () => {
    const ids = statesData.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(statesData.length);
  });

  test("all entries should have valid official portal links", () => {
    statesData.forEach((state) => {
      expect(state.website).toMatch(/^https:\/\//);
      expect(state.website).not.toBe("");
    });
  });

  test("all entries should have essential geographic and administrative data", () => {
    statesData.forEach((state) => {
      expect(state.name).toBeTruthy();
      expect(state.capital).toBeTruthy();
      expect(state.constituencies).toBeGreaterThanOrEqual(1);
      expect(state.lat).toBeDefined();
      expect(state.lng).toBeDefined();
    });
  });

  test("should correctly identify types as State or UT", () => {
    statesData.forEach((state) => {
      expect(["State", "UT"]).toContain(state.type);
    });
  });
});
