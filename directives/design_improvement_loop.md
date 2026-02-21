# Design Improvement Loop

## Goal
Iteratively improve the Jinxa website (`index.html`) with visual verification at each step. Use automated screenshots to catch regressions and validate improvements before deploying.

## Workflow

The loop is: **baseline → modify → verify → diff → iterate**.

### Step 1: Capture Before State
```bash
python execution/screenshot_loop.py --mode before
```

This captures 6 viewport-specific screenshots into `.tmp/screenshots/before/`:
- `hero.png` — viewport height, top of page
- `stats.png` — stats section in view
- `case_studies.png` — case studies section
- `how_it_works.png` — process section with timeline
- `services.png` — services grid
- `cta.png` — final CTA section

### Step 2: Edit `index.html`
Make design changes per the improvement checklist (see below).

### Step 3: Capture After State
```bash
python execution/screenshot_loop.py --mode after
```

Captures the same 6 sections into `.tmp/screenshots/after/`.

### Step 4: Generate Diff Report
```bash
python execution/screenshot_loop.py --mode diff
```

Produces:
- `diff_hero.png`, `diff_stats.png`, ... (red diff overlay showing pixels that changed)
- `diff_report.txt` (summary: `hero: 412 pixels changed (3.2%)`, etc.)

### Step 5: Inspect Diffs
Open `.tmp/screenshots/diff_*.png` in your image viewer. Red areas = changes. If the changes match your intent, move forward. If not, tweak and re-run steps 2–4.

### Step 6: Deploy & Verify Live
```bash
python execution/deploy_vercel.py --deploy --site jinxa --production
```

Visit https://jinxa.vercel.app and do a visual spot-check on desktop + mobile (375px).

---

## Design Improvement Checklist

### Phase 1: Hero Refactoring
- [ ] Add subtext "For B2B companies & growing teams" below the main badge (color: `--text-muted`)
- [ ] Increase H1 `font-size` clamp from `3.8rem` to `4.5rem` desktop
- [ ] Add 1-sentence client testimonial card floating right of hero (initials avatar + quote + company)
- [ ] Add context labels to hero stats: "42+ clients" → "across 6 industries", "10+" → "since 2014"
- [ ] Change secondary CTA from "See How It Works" to "View Case Studies"
- [ ] Add horizontal ticker band below hero with proof points: "Guide Michelin · Autorigin · LockData · 10+ years"

### Phase 2: Visual Depth & Typography
- [ ] Add subtle SVG noise filter to background (in `<style>`)
- [ ] Add thin gradient dividers between sections (`transparent → --accent-primary → transparent`)
- [ ] Reduce H1 `letter-spacing` to `-.02em` (premium look)
- [ ] Add animated green dot (pulsing) before section label pills

### Phase 3: Social Proof
- [ ] Add compact testimonial block directly under hero CTAs (horizontal: quote + avatar + name + company)
- [ ] Change "Tools I work with..." to "Trusted by teams at" with client logos/badges
- [ ] Add industry tag (colored pill) to top of each case study card
- [ ] Increase case study client name from `1.1rem` to `1.4rem`

### Phase 4: Case Studies Visual Weight
- [ ] Display major stat (30%, 2x, 50%) in large `3.5rem` bold before client name
- [ ] Style Challenge/Solution labels with left green border (2px) + subtle background
- [ ] Add `border-top: 3px solid --accent-primary` to case card hover state

### Phase 5: How It Works Clarity
- [ ] Add duration emoji/icon to each step pill: ⏱ "Free. No commitment." / 📄 "Full transparency." / 🗓 "Done in 4-8 weeks"
- [ ] Add 2-3 bullet points under each step description (concrete activities)
- [ ] Animate timeline line fill on scroll (top → bottom)

### Phase 6: Services Detail
- [ ] Expand each service card: 1 intro sentence + 3 bullet points (deliverables, not features)
- [ ] Example: "Workflow Automation" → "• Make & Zapier scenario design\n• Custom API connectors\n• Email/Slack alerts"
- [ ] Add subtle link at card bottom: "→ See an example"

### Phase 7: CTA Final Touch
- [ ] Add "What happens after you book:" section with 3 inline micro-steps
- [ ] Repeat "No sales pitch. No commitment." as secondary copy under main CTA button
- [ ] Add subtle animated radial gradient background to CTA card

---

## Screenshot Loop Dependencies

**Required:** `pixelmatch` library for diff generation.

```bash
pip install pixelmatch Pillow
```

(Playwright is already installed; confirmed in `execution/capture_screenshots.py`)

---

## When to Run

- **After each HTML section refactor:** capture before → edit → capture after → inspect diff
- **Before every Vercel deployment:** run a final `--mode before` to confirm current state
- **Weekly visual regression check:** baseline → time passes → capture after → check for unexpected changes

---

## Troubleshooting

**Screenshots are blurry or colors are off:**
- Playwright may be using system fonts. Add `font-family` fallbacks to CSS.
- Ensure `localhost:8082` is serving the correct `index.html` file.

**Diff shows hundreds of pixels changed when you only changed text:**
- Anti-aliasing or font rendering differences between runs. This is expected.
- Look at the actual diff images to confirm the changes match your intent.

**Script fails with "Connection refused":**
- The local server may not have started. Check that port 8082 is not in use.
- Run `screenshot_loop.py` in a fresh terminal.

---

## Files Involved

| File | Role |
|---|---|
| `index.html` | Site being improved |
| `execution/screenshot_loop.py` | Automation script (serves locally, captures, diffs) |
| `.tmp/screenshots/before/` | Baseline screenshots |
| `.tmp/screenshots/after/` | Modified screenshots |
| `.tmp/screenshots/diff_*.png` | Visual diffs (red overlay) |
| `.tmp/screenshots/diff_report.txt` | Summary stats |
