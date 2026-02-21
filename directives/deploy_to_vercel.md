# Deploy Website to Vercel

## Goal
Deploy a static HTML website (single-file, no build step) to Vercel. Supports multiple sites in the same repo by configuring which HTML file to deploy.

## Prerequisites
- Node.js installed (for Vercel CLI)
- Vercel CLI installed (`npm i -g vercel`) or use the execution script to install it
- Vercel account (free tier works)
- Vercel auth token stored in `.env` as `VERCEL_TOKEN` (for CI/headless deploys)

## Inputs
| Input | Description | Default |
|---|---|---|
| `site` | Which site to deploy: `jinxa` or `automai` | `jinxa` |
| `production` | Deploy to production (vs preview) | `false` |
| `custom_domain` | Custom domain to assign (optional) | — |

## Workflow

### Step 1 — Pre-flight checks
Run `execution/deploy_vercel.py --preflight` to verify:
- Vercel CLI is installed (installs if missing)
- `VERCEL_TOKEN` is set in `.env`
- Target HTML file exists
- Git repo is clean (warn if not)

### Step 2 — Prepare deployment directory
The script creates a clean `.tmp/deploy/` folder with:
- The target `index.html` (copied from root or renamed from `automai.html`)
- A `vercel.json` config for static hosting + SPA routing

### Step 3 — Deploy
Run `execution/deploy_vercel.py --deploy [--production]`
- Uses Vercel CLI with token auth
- Deploys `.tmp/deploy/` as a static site
- Returns the deployment URL

### Step 4 — Custom domain (optional)
If `custom_domain` is provided, run `execution/deploy_vercel.py --domain <domain>`
- Adds the domain alias to the Vercel project
- Outputs DNS records the user needs to configure

## Outputs
- Deployment URL (e.g. `https://jinxa-xxx.vercel.app`)
- Production URL if `--production` flag used
- DNS instructions if custom domain requested

## Edge Cases & Learnings
- **First deploy:** Vercel CLI will prompt for project setup. The script uses `--yes` flag to auto-confirm with defaults.
- **Token auth:** For headless/CI deploys, always use `VERCEL_TOKEN`. Interactive login also works for manual deploys.
- **OneDrive path:** The repo lives in OneDrive. The deploy script copies to `.tmp/` first to avoid path issues with Vercel CLI.
- **No build step:** These are static HTML files. `vercel.json` explicitly sets `buildCommand` to empty and `outputDirectory` to `.` to skip any framework detection.

## Related Files
- `execution/deploy_vercel.py` — Main deployment script
- `execution/setup_vercel.py` — One-time Vercel project setup
- `.env` — Contains `VERCEL_TOKEN`
- `vercel.json` — Generated per-deploy in `.tmp/deploy/`
