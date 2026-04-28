const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.error("No API key"); process.exit(1); }
fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
}).then(r => r.json()).then(console.log).catch(console.error);
