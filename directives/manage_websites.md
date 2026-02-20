# Manage Websites

## Goal
Manage the static website files in this repo. Currently two sites exist:
- **Jinxa** (`index.html`) — Leslie Guilbert's digital transformation agency
- **Automai** (`automai.html`) — Tom Randeau's AI automation agency

## Site Registry

| Site | File | Domain | Vercel Project | Status |
|---|---|---|---|---|
| Jinxa | `index.html` | TBD | TBD | Active |
| Automai | `automai.html` | TBD | TBD | Active |

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
