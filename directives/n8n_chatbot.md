# N8N Chatbot Integration

## Goal
Configure and maintain N8N-backed AI chatbot widgets embedded in client websites. Each chatbot is a floating bubble (bottom-right) that qualifies B2B leads, answers service questions, and drives toward a Calendly booking.

---

## Architecture

```
Site visitor (browser)
  ↓ POST {action, chatInput, sessionId}
Chat Trigger node (N8N public webhook)
  ↓
AI Agent node (GPT-4o-mini + system prompt)
  ├─ Simple Memory (session window)
  └─ OpenAI Chat Model (tuned params)
  ↓ {output: "..."}
Browser widget renders response
```

**Payload format (browser → N8N):**
```json
{ "action": "sendMessage", "chatInput": "user text", "sessionId": "j-abc123-1700000000" }
```

**Response format (N8N → browser):**
```json
{ "output": "Bot response text" }
```

---

## Client: Jinxa (Leslie Guilbert)

| Config | Value |
|--------|-------|
| N8N instance | `https://jinxa.app.n8n.cloud` |
| Workflow ID | `MAbBdvHt-2k6zpqt43Or2` |
| Webhook ID | `91dc8835-b699-4ff9-81ff-df4e2018f52f` |
| Webhook URL | `https://jinxa.app.n8n.cloud/webhook/91dc8835-b699-4ff9-81ff-df4e2018f52f/chat` |
| Credentials key | `LESLIE_N8N_URL` + `LESLIE_N8N_API_KEY` in `.env` |

---

## Updating the Workflow via N8N API

All changes go via `PUT /api/v1/workflows/{id}`. Always fetch current state first, modify nodes in memory, then PUT.

```python
import urllib.request, json

url = f'{N8N_URL}/api/v1/workflows/{WORKFLOW_ID}'
headers = {'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json'}

# Fetch
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as r:
    wf = json.loads(r.read())

# Modify nodes in wf['nodes']...

# PUT — settings MUST be minimal (extra fields cause 400 error)
payload = {
    'name': wf['name'],
    'nodes': wf['nodes'],
    'connections': wf['connections'],
    'settings': {'executionOrder': 'v1'},
    'staticData': wf.get('staticData')
}
data = json.dumps(payload).encode()
req2 = urllib.request.Request(url, data=data, headers=headers, method='PUT')
with urllib.request.urlopen(req2) as r:
    resp = json.loads(r.read())
```

**Critical gotchas:**
- `settings` must only contain `{executionOrder: 'v1'}`. Other fields (`binaryMode`, `availableInMCP`, etc.) cause `400 additional properties`.
- `systemMessage` must be in `parameters.options.systemMessage` (not `parameters.systemMessage`). Wrong level = invisible in UI and may not apply.
- The N8N API key has an expiry (`exp` field in JWT). If you get 401, the user must regenerate it in N8N Settings → API.

---

## Node Reference

### AI Agent (`@n8n/n8n-nodes-langchain.agent`)
```json
{
  "options": {
    "systemMessage": "...",
    "maxIterations": 10
  }
}
```

### OpenAI Chat Model (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
```json
{
  "model": { "__rl": true, "value": "gpt-4o-mini", "mode": "list" },
  "options": {
    "temperature": 0.65,
    "maxTokens": 400,
    "frequencyPenalty": 0.7,
    "presencePenalty": 0.7
  }
}
```
**Why these values:**
- `temperature 0.65`: warm and natural without hallucinating
- `maxTokens 400`: enforces concise 2–3 sentence responses
- `frequencyPenalty 0.7`: prevents repeating the same question/phrase
- `presencePenalty 0.7`: drives the bot forward through conversation stages

### Simple Memory (`@n8n/n8n-nodes-langchain.memoryBufferWindow`)
```json
{ "contextWindowLength": 10 }
```
10 exchanges (~20 messages) = covers a full BANT qualification flow without token bloat.

---

## System Prompt Architecture (BANT Framework)

Best-in-class prompts for B2B qualification chatbots follow this structure (~400–500 words):

1. **Identity & Voice** — name, persona, language (auto-detect FR/EN)
2. **About the company** — services, results with numbers, process
3. **Conversation stages** — labeled STAGE 1–5 so the model knows where it is
   - STAGE 1: Opening
   - STAGE 2: Discovery (current tools, pain, business impact)
   - STAGE 3: Qualification (BANT: Need / Authority / Budget / Timeline)
   - STAGE 4: Value Bridge (connect pain → service + case study)
   - STAGE 5: CTA (Calendly link, collect name + email first)
4. **Objection handling** — canned redirects for 5 common objections
5. **Hard rules** — 1 question at a time, 3 sentences max, no pricing promises

**Prompt length sweet spot:** 400–500 words. Below 200 = model goes off-script. Above 700 = nuance ignored.

---

## Testing the Webhook

Before deploying, always test the webhook with 3 representative messages:

```python
import urllib.request, json, time

WEBHOOK = 'https://[host]/webhook/[id]/chat'
SESSION = 'test-' + str(int(time.time()))

def chat(msg):
    payload = json.dumps({'action': 'sendMessage', 'chatInput': msg, 'sessionId': SESSION}).encode()
    req = urllib.request.Request(WEBHOOK, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read()).get('output', '')

r1 = chat('Hello, I want to automate my sales process')   # → should open warmly + ask one question
time.sleep(2)
r2 = chat('We use HubSpot but leads get lost')            # → should reflect back + dig deeper
time.sleep(2)
r3 = chat('Book a call')                                  # → should ask for name/email, then Calendly
```

**Quality gates:**
- ≤ 50 words per response
- Single question per turn (not multiple)
- Language detection correct (EN input → EN response, FR input → FR response)
- Stage 5 collects name + email before surfacing Calendly link

---

## Widget (jinxa.html)

The chatbot widget lives entirely in `jinxa.html` (inline HTML + CSS + JS, ~200 lines).

**Key identifiers:**
- `#chat-widget` — outer container
- `#chat-bubble` — floating button (58px, green pulse)
- `#chat-window` — 380×520px panel
- `#chat-messages` — scrollable message list
- `#chat-quick-replies` — quick reply button strip
- `WEBHOOK` variable (line ~2603) — must match workflow webhook URL
- `QR_FR` / `QR_EN` arrays (line ~2604) — quick reply labels per language

**Session ID:** stored in `localStorage('jinxa_chat_session')` as `j-[random]-[timestamp]`. Persists across page refreshes within the same browser.

---

## Future Improvements (require credentials)

| Feature | What it does | Requires |
|---------|-------------|----------|
| Google Sheets lead capture | Auto-log name + email + BANT signals at Stage 5 | Google OAuth credentials |
| Email alert to Leslie | Instant hot lead notification | SMTP or Gmail credentials in N8N |
| SerpAPI company research | Agent looks up prospect's company before responding | SerpAPI key |
| Contextual quick replies | Re-render stage-appropriate buttons after each bot turn | JS change in jinxa.html only (no credentials) |
| Auto-open trigger | Open chat after 30s on page (scroll or time trigger) | JS change in jinxa.html only |
| localStorage message history | Restore conversation on page refresh | JS change in jinxa.html only |
