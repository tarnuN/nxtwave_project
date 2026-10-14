# Bharosa: NIAT parent conversion agent

A multilingual AI system that takes hesitant NIAT leads (parents who filled a form and went quiet) and moves them to a campus visit or a counsellor call, over WhatsApp-style chat.

## What's inside

| Part | Where | What it does |
|---|---|---|
| Lead inbox | `index.html` | Hesitant leads with city, language and context |
| Bharosa agent | `index.html` + `api/claude.js` | Claude with 5 tools: look up facts, find a student from the same state, compare costs, book a campus visit, hand off to a counsellor. Replies in Telugu, Hindi, Tamil, Kannada, Malayalam or English |
| Insight engine | `index.html` | Second model call: tags objections, readiness 0-100, 10-second counsellor brief |
| Counsellor desk | `index.html` | Live queue, funnel, objection chart, activity feed |
| Facts | `index.html` | Editable knowledge base; the agent can only quote what's here |
| Parent simulator | `index.html` | Third model plays a skeptical parent so you can demo end to end |

`api/claude.js` is a serverless function that keeps your Anthropic API key on the server. The browser never sees it.

Data is saved in each visitor's browser (localStorage), so every judge gets their own clean demo.

## Deploy to Vercel (about 5 minutes)

1. Get an API key at https://console.anthropic.com and set a monthly spend limit there.
2. Push this folder to a GitHub repo.
3. On https://vercel.com, click **Add New > Project** and import the repo. No build settings needed.
4. In **Settings > Environment Variables**, add `ANTHROPIC_API_KEY` with your key. Redeploy.
5. Open the URL, click **Load demo leads**, pick a parent, press **Simulate parent**.

### Run locally

```bash
npm i -g vercel
cp .env.example .env.local   # paste your key
vercel dev
```

Opening `index.html` directly from disk will show the UI, but the AI needs `/api/claude`, so use `vercel dev`.

## Before you show it to anyone

- All fees, degree details, student stories and cost numbers are **placeholders**. Replace them in the Facts tab (or in `DEFAULT_KB`, `ALUMNI`, `COSTS` inside `index.html`) with NIAT's verified data.
- The demo link spends your API credits. Keep the spend limit on.

## Going live at NIAT

- WhatsApp Business Cloud API webhook sends real parent messages to the same agent and posts replies back.
- Leads sync from the CRM: anyone with no response after 2 call attempts enters the inbox automatically.
- Handoffs and visit bookings become CRM tasks with the brief attached.

## Other version

`claude-artifact/bharosa-artifact.html` is the original build that runs inside Claude (uses Claude's built-in AI and shared database instead of the API route).
