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

  test("should return 400 for invalid request body", async () => {
    const req = createMockReq({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("should return 500 if API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = createMockReq({ messages: [{ role: "user", content: "hi" }] });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  test("should return 429 when rate limited", async () => {
    const req = createMockReq(
      { messages: [{ role: "user", content: "hi" }] },
      { "x-forwarded-for": "1.2.3.4" }
    );

    // Exhaust rate limit (20 requests)
    for (let i = 0; i < 20; i++) {
      await POST(req);
    }

    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  test("should handle upstream API errors", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: "Unauthorized" } }),
    } as Response);

    const req = createMockReq(
      { messages: [{ role: "user", content: "hi" }] },
      { "x-forwarded-for": "5.6.7.8" }
    );

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.details).toBe("Unauthorized");
    
    fetchSpy.mockRestore();
  });
});
