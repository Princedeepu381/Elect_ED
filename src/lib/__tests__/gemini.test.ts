import { SYSTEM_PROMPT, model } from "../gemini";

// Mock the entire module since it initializes on import
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        model: "gemini-1.5-flash-latest"
      }),
    })),
  };
});

describe("Gemini Lib", () => {
  test("SYSTEM_PROMPT should contain core instructions", () => {
    expect(SYSTEM_PROMPT).toContain("ElectEd AI Assistant");
    expect(SYSTEM_PROMPT).toContain("Brevity is Key");
    expect(SYSTEM_PROMPT).toContain("Neutrality");
  });

  test("model should be initialized", () => {
    expect(model).toBeDefined();
  });
});
