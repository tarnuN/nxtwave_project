// Vercel serverless function: proxies the browser's requests to OpenRouter's Anthropic-compatible API.
// The API key stays on the server (set OPENROUTER_API_KEY in Vercel > Project > Settings > Environment Variables).

const MODELS = {
  quick: process.env.MODEL_QUICK || "anthropic/claude-haiku-5.5",
  default: process.env.MODEL_DEFAULT || "anthropic/claude-sonnet-4",
  complex: process.env.MODEL_COMPLEX || process.env.MODEL_DEFAULT || "anthropic/claude-sonnet-4",
};

// Very small guard against abuse of your key on a public demo link.
const MAX_BODY_BYTES = 200_000;
const MAX_MESSAGES = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST" });
  }
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not set on the server" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (JSON.stringify(body).length > MAX_BODY_BYTES) return res.status(413).json({ error: "Request too large" });

  const { tier = "default", messages, tools, json, system } = body;
  if (!Array.isArray(messages) || !messages.length || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }

  const payload = {
    model: MODELS[tier] || MODELS.default,
    max_tokens: 1024,
    messages,
  };
  if (typeof system === "string" && system.trim()) payload.system = system.slice(0, 20_000);
  if (Array.isArray(tools) && tools.length) payload.tools = tools.slice(0, 10);
  if (json) payload.system = "Reply with only valid JSON. No prose, no code fences.";

  try {
    const r = await fetch("https://openrouter.ai/api/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.OPENROUTER_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || "OpenRouter API error" });
    }
    return res.status(200).json({ content: data.content, stop_reason: data.stop_reason, model: data.model });
  } catch (e) {
    console.error("OpenRouter request failed:", e);
    return res.status(502).json({ error: "OpenRouter request failed. Please try again." });
  }
}
