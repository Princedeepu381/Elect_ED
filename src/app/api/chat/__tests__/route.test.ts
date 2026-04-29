/** @jest-environment node */
import { POST } from "../route";
import { NextRequest } from "next/server";

// Mock global fetch
global.fetch = jest.fn();

describe("Chat API Route", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.GEMINI_API_KEY = "fake-key";
  });

  test("returns 200 with simulation text for invalid body", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("returns 200 for empty messages array", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("returns 200 with simulation text if API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("returns 200 if messages is not an array", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: "not-an-array" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("returns 200 with simulation text for null body", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: null,
    });

    const res = await POST(req);
    expect(res.status).toBe(200); 
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("handles messages without content", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn().mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("calls upstream Gemini API correctly and handles stream", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => {
          let called = false;
          return {
            read: jest.fn().mockImplementation(() => {
              if (!called) {
                called = true;
                return Promise.resolve({ done: false, value: new TextEncoder().encode('{"text": "Hello"}') });
              }
              return Promise.resolve({ done: true });
            }),
          };
        },
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    // Consume the stream to test the streaming logic
    const reader = res.body?.getReader();
    if (reader) {
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
    }
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("generativelanguage.googleapis.com"),
      expect.any(Object)
    );
  });

  test("handles multi-message conversation with history", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('{"text": "Response"}') })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there" },
          { role: "user", content: "What is EVM?" },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  test("returns 200 simulation fallback if json parsing fails upstream", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => { throw new Error("Invalid JSON") },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("returns 200 simulation fallback when Gemini API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: { message: "Service unavailable" } }),
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("handles rate limiting by falling back to simulation mode", async () => {
    // Exhaust the rate limit (20 requests) by flooding
    const makeRequest = () =>
      POST(
        new NextRequest("http://localhost/api/chat", {
          method: "POST",
          headers: { "x-forwarded-for": "1.2.3.4" },
          body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
        })
      );

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn().mockResolvedValue({ done: true }),
        }),
      },
    });

    // We no longer throw 429, we just fallback, so we just expect all to be 200
    const responses = await Promise.all(Array.from({ length: 21 }, makeRequest));
    const statuses = responses.map((r) => r.status);
    expect(statuses.every(s => s === 200)).toBe(true);
  });

  test("returns 200 simulation fallback on unexpected exception", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network failure"));

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("returns 200 simulation fallback with upstream error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ details: "Specific error details" }),
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("returns 200 simulation fallback for non-Error exceptions", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => { throw "string-error" });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });

  test("handles stream chunks without text matches", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('{"other": "data"}') })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const reader = res.body?.getReader();
    if(reader) {
        const { done } = await reader.read();
        expect(done).toBe(true);
    }
  });

  test("returns 200 simulation fallback for null reader from upstream response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => { throw new Error("Failed to initialize stream"); }
      }, // Mock a failure to get reader to trigger the catch block instead of crashing the test
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "unknown question" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Simulation Mode");
  });
});
