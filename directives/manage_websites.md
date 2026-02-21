# Manage Websites

## Goal
Manage the static website files in this repo. Currently two sites exist:
- **Jinxa** (`jinxa.html`) — Leslie Guilbert's B2B digital transformation consultancy
- **Automai** (`automai.html`) — Tom Randeau's AI automation agency

## Site Registry

| Site | File | Domain | Vercel Project | Status |
|---|---|---|---|---|
| Jinxa | `jinxa.html` | jinxa.vercel.app | jinxa | Active |
| Automai | `automai.html` | TBD | TBD | Active |

## Jinxa — Chatbot Integration

Jinxa has a live chatbot widget (bottom-right floating bubble) backed by N8N.

| Config | Value |
|--------|-------|
| N8N instance | `https://jinxa.app.n8n.cloud` |
| Workflow ID | `MAbBdvHt-2k6zpqt43Or2` |
| Webhook URL | `https://jinxa.app.n8n.cloud/webhook/91dc8835-b699-4ff9-81ff-df4e2018f52f/chat` |
| Model | `gpt-4o-mini` |
| Memory window | 10 exchanges |
| Credentials key | `LESLIE_N8N_API_KEY` in `.env` |

To update the chatbot system prompt or model parameters, use `directives/n8n_chatbot.md`.

## Workflow: Edit a Site

1. Open the target HTML file
2. Make changes (all CSS/JS is inline — single file per site)
3. Test locally by opening the file in a browser
4. Deploy via `execution/deploy_vercel.py --site <name>`

## Workflow: Add a New Site

1. Create a new HTML file at root (e.g., `newclient.html`)
2. Update this directive's Site Registry table
3. Register the site name in `execution/deploy_vercel.py` SITE_MAP
4. Deploy with `--site newclient`

## Architecture Notes
- Each site is a **single self-contained HTML file** (inline CSS + JS)
- No build tools, no npm dependencies for the sites themselves
- External dependencies: Google Fonts only (loaded via CDN)
- Images: Unsplash URLs or local files
- Deployment: Vercel (static hosting, free tier)

## Quality Checklist (run before deploy)
- [ ] HTML validates (no broken tags)
- [ ] All links work (no 404s)
- [ ] CTA links point to correct Calendly/Cal URLs
- [ ] Mobile responsive (test at 375px, 768px, 1024px widths)
- [ ] Animations smooth on mobile
- [ ] Fonts loading correctly
- [ ] No console errors in browser devtools
