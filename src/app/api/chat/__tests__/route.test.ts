/** @jest-environment node */
import { POST } from "../route";
import { NextRequest } from "next/server";

// Mock global fetch
global.fetch = jest.fn();

describe("Chat API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = "fake-key";
  });

  test("returns 400 for invalid body", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.details).toBe("Invalid request body.");
  });

  test("returns 400 for empty messages array", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("returns 500 if API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.details).toBe("API Key is missing from .env.local");
  });

  test("calls upstream Gemini API correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('{"text": "Hello"}') })
            .mockResolvedValueOnce({ done: true }),
        }),
      },
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
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

  test("returns upstream error status when Gemini API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: { message: "Service unavailable" } }),
    });

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.details).toBe("Service unavailable");
  });

  test("handles rate limiting", async () => {
    // Exhaust the rate limit (20 requests) by flooding
    const makeRequest = () =>
      POST(
        new NextRequest("http://localhost/api/chat", {
          method: "POST",
          headers: { "x-forwarded-for": "1.2.3.4" },
          body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
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

    // Make 21 requests to trigger rate limit
    const responses = await Promise.all(Array.from({ length: 21 }, makeRequest));
    const statuses = responses.map((r) => r.status);
    expect(statuses).toContain(429);
  });

  test("returns 500 with error message on unexpected exception", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network failure"));

    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.details).toBe("Network failure");
  });
});
