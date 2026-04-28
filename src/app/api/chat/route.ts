import { SYSTEM_PROMPT } from "@/lib/gemini";
import { NextRequest } from "next/server";

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;        // max requests
const WINDOW_MS  = 60_000;    // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

// ─── Input sanitisation ───────────────────────────────────────────────────────
function sanitizeInput(text: string): string {
  return text.slice(0, 4000).replace(/[<>]/g, ""); // cap length, strip HTML chars
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ details: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Parse & validate body
    const body = await req.json();
    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ details: "Invalid request body." }),
        { status: 400 }
      );
    }

    const { messages } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ details: "API Key is missing from .env.local" }),
        { status: 500 }
      );
    }

    const lastMessage = sanitizeInput(messages[messages.length - 1].content ?? "");

    // Streaming call to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Understood. I am the ElectEd AI assistant." }] },
            ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: sanitizeInput(m.content) }],
            })),
            { role: "user", parts: [{ text: lastMessage }] },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errMsg = errorData?.error?.message || errorData?.details || "Upstream error";
      console.error("[Chat API Error]: response not ok:", response.status, errMsg);
      return new Response(
        JSON.stringify({ details: errMsg }),
        { status: response.status }
      );
    }

    // Stream Gemini response back to client
    const reader  = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          
          // Use a robust global regex to find all "text": "..." matches
          const textMatches = Array.from(buffer.matchAll(/"text":\s*"((?:[^"\\]|\\.)*)"/g));
          
          for (const match of textMatches) {
            let text = match[1];
            // Unescape characters (\n, \", etc)
            text = text.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
            controller.enqueue(encoder.encode(text));
          }

          // Clear buffer of processed parts to avoid duplication
          if (textMatches.length > 0) {
            const lastMatch = textMatches[textMatches.length - 1];
            const endOfLastMatch = (lastMatch.index ?? 0) + lastMatch[0].length;
            buffer = buffer.substring(endOfLastMatch);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Chat API Error]:", msg);
    return new Response(JSON.stringify({ details: msg }), { status: 500 });
  }
}
