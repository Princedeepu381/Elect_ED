/**
 * @jest-environment jsdom
 */
import { POST } from "../app/api/chat/route";

if (typeof Response === 'undefined') {
  // @ts-expect-error - polyfilling for test environment
  global.Response = class {
    constructor(body: string, init?: { status?: number }) {
      // @ts-expect-error - internal mock state
      this.status = init?.status || 200;
      // @ts-expect-error - internal mock state
      this.json = () => Promise.resolve(JSON.parse(body));
    }
  };
}
if (typeof fetch === 'undefined') {
  // @ts-expect-error - polyfilling for test environment
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
  });
}
if (typeof TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TextEncoder: TE, TextDecoder: TD } = require('util');
  global.TextEncoder = TE;
  global.TextDecoder = TD;
}
if (typeof ReadableStream === 'undefined') {
  // @ts-expect-error - polyfilling for test environment
  global.ReadableStream = class {
    constructor(opts: unknown) {
      // @ts-expect-error - internal mock state
      this.opts = opts;
    }
  };
}

describe("Chat API Route", () => {
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    process.env.GEMINI_API_KEY = mockApiKey;
    jest.clearAllMocks();
  });

  const createMockReq = (body: unknown, headers: Record<string, string> = {}) => ({
    json: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name.toLowerCase()] || null,
    },
  } as unknown as Request);

  test("should return 200 with simulation text for invalid request body", async () => {
    const req = createMockReq({});
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("should return 200 if API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = createMockReq({ messages: [{ role: "user", content: "unknown question" }] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("should return 200 fallback when rate limited", async () => {
    const makeRequest = () =>
      POST(
        createMockReq(
          { messages: [{ role: "user", content: "unknown question" }] },
          { "x-forwarded-for": "1.1.1.1" }
        )
      );

    const responses = await Promise.all(Array.from({ length: 25 }, makeRequest));
    const statuses = responses.map((r: Response) => r.status);
    expect(statuses.every((s: number) => s === 200)).toBe(true);
  });

  test("should handle upstream API errors with 200 simulation fallback", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "Unauthorized" } }),
    });

    const req = createMockReq({ messages: [{ role: "user", content: "unknown question" }] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
