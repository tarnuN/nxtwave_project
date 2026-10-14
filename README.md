# Bharosa: NIAT parent conversion agent

A multilingual AI system that takes hesitant NIAT leads (parents who filled a form and went quiet) and moves them to a campus visit or a counsellor call, over WhatsApp-style chat.

## What's inside

| Part | Where | What it does |
|---|---|---|
| Public landing page and visitor agent | `index.html` + `api/claude.js` | Multilingual AI admissions agent with fact lookup, consent-gated lead capture, and counsellor follow-up tools |
| Lead inbox | `index.html` | Hesitant leads with city, language and context |
| Bharosa agent | `index.html` + `api/claude.js` | Claude with 5 tools: look up facts, find a student from the same state, compare costs, book a campus visit, hand off to a counsellor. Replies in Telugu, Hindi, Tamil, Kannada, Malayalam or English |
| Insight engine | `index.html` | Second model call: tags objections, readiness 0-100, 10-second counsellor brief |
| Counsellor desk | `index.html` | Live queue, funnel, objection chart, activity feed |
| Facts | `index.html` | Editable knowledge base; the agent can only quote what's here |
| Parent simulator | `index.html` | Third model plays a skeptical parent so you can demo end to end |

`api/claude.js` is a serverless function that keeps your OpenRouter API key on the server. The browser never sees it.
The public visitor agent uses the fast model tier and real tool calls: it reads the current knowledge base, writes an opted-in prospect into the shared lead inbox, and records a follow-up request for the counsellor demo desk. A second AI call scores captured conversations and creates a counsellor brief. Tool actions appear in the chat and in the dashboard's lead/activity views.

The public visitor lead, conversation, and follow-up are saved in that visitor's browser (localStorage), so each judge gets a clean, isolated demo. The visitor must explicitly request the action and enable the consent checkbox before details or a follow-up are saved. The demo does not collect phone numbers or email addresses, and it does not contact a real counsellor. The seeded lead profiles, alumni stories, and cost figures are illustrative placeholders, not NIAT-verified information.

## Deploy to Vercel (about 5 minutes)

1. Get an API key at https://openrouter.ai/keys and set an appropriate credit limit.
2. Push this folder to a GitHub repo.
3. On https://vercel.com, click **Add New > Project** and import the repo. No build settings needed.
4. In **Settings > Environment Variables**, add `OPENROUTER_API_KEY` with your key. Redeploy.
5. Open the URL and ask Bharosa a factual question. Then opt in using the checkbox and share a parent name and city; the AI agent adds that prospect to the dashboard inbox. Ask for a counsellor follow-up and verify the request in the desk/activity feed.
6. To demo the re-engagement workflow, open the dashboard, click **Load demo leads**, select a parent, then press **Simulate parent**.

### Run locally

```bash
npm i -g vercel
cp .env.example .env.local   # add your OpenRouter key
vercel dev
```

Opening `index.html` directly from disk will show the UI, but the AI needs `/api/claude`, so use `vercel dev`.

## Before you show it to anyone

- All fees, degree details, student stories and cost numbers are **placeholders**. Replace them in the Facts tab (or in `DEFAULT_KB`, `ALUMNI`, `COSTS` inside `index.html`) with NIAT's verified data.
- The demo link spends your API credits. Keep the spend limit on.
- The lead inbox and counsellor follow-up queue are browser-local demo tools, not a CRM or live notification service. Do not use real family data until persistent storage, access controls, consent wording, and the CRM/WhatsApp integrations are implemented and approved.

## Three-minute demo recording outline

- **0:00–0:30:** Open the public site, launch Bharosa, and ask a question about fees or the program. Show the knowledge-base lookup receipt and explain that demo facts are labeled for counsellor confirmation.
- **0:30–1:15:** Enable the consent checkbox, share a parent name and city, and accept the agent's offer to save the lead. Show the new lead in the counsellor inbox.
- **1:15–1:45:** Ask for a counsellor follow-up. Show the tool receipt and the follow-up in the desk/activity queue; call out that it is a local demo action, not a real notification.
- **1:45–2:40:** Load the seeded leads, start a multilingual outreach simulation, and show the agent's fact/student/cost tools and the insight engine updating readiness and the counsellor brief.
- **2:40–3:00:** Show the Facts editor and explain that production facts and CRM/WhatsApp connections must be supplied before real use.

## Going live at NIAT

- WhatsApp Business Cloud API webhook sends real parent messages to the same agent and posts replies back.
- Leads sync from the CRM: anyone with no response after 2 call attempts enters the inbox automatically.
- Handoffs and visit bookings become CRM tasks with the brief attached.

## Other version

`claude-artifact/bharosa-artifact.html` is the original build that runs inside Claude (uses Claude's built-in AI and shared database instead of the API route).
