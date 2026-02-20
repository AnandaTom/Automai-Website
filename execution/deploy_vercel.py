#!/usr/bin/env python3
"""
Deploy static HTML website to Vercel.

Usage:
    python deploy_vercel.py --preflight              # Check prerequisites
    python deploy_vercel.py --deploy --site jinxa    # Deploy preview
    python deploy_vercel.py --deploy --site jinxa --production  # Deploy to production
    python deploy_vercel.py --domain example.com     # Add custom domain

Environment:
    VERCEL_TOKEN: Vercel API token (required for headless deploys)
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

# === CONFIGURATION ===

# Map site names to their HTML files
SITE_MAP = {
    "jinxa": "index.html",
    "automai": "automai.html",
}

# Project root (where this script lives in execution/)
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent
TMP_DIR = PROJECT_ROOT / ".tmp"
DEPLOY_DIR = TMP_DIR / "deploy"
ENV_FILE = PROJECT_ROOT / ".env"


def load_env():
    """Load environment variables from .env file."""
    if ENV_FILE.exists():
        with open(ENV_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ.setdefault(key.strip(), value.strip())


def get_vercel_token():
    """Get Vercel token from environment."""
    return os.environ.get("VERCEL_TOKEN", "")


def run_cmd(cmd, check=True, capture=False):
    """Run a shell command."""
    print(f"  $ {' '.join(cmd)}")
    result = subprocess.run(
        cmd,
        check=check,
        capture_output=capture,
        text=True,
        shell=(sys.platform == "win32"),
    )
    return result


def check_vercel_cli():
    """Check if Vercel CLI is installed, install if not."""
    try:
        result = run_cmd(["vercel", "--version"], check=False, capture=True)
        if result.returncode == 0:
            print(f"  Vercel CLI: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("  Vercel CLI not found. Installing...")
    run_cmd(["npm", "install", "-g", "vercel"])
    return True


def preflight(site: str):
    """Run pre-flight checks."""
    print("\n=== Pre-flight Checks ===\n")

    errors = []

    # 1. Check Vercel CLI
    print("[1/4] Checking Vercel CLI...")
    try:
        check_vercel_cli()
    except Exception as e:
        errors.append(f"Vercel CLI: {e}")

    # 2. Check token
    print("\n[2/4] Checking VERCEL_TOKEN...")
    token = get_vercel_token()
    if token:
        print(f"  VERCEL_TOKEN: {'*' * 8}...{token[-4:] if len(token) > 4 else '****'}")
    else:
        print("  VERCEL_TOKEN: Not set (will use interactive login)")

    # 3. Check HTML file exists
    print(f"\n[3/4] Checking site file for '{site}'...")
    if site not in SITE_MAP:
        errors.append(f"Unknown site: {site}. Available: {list(SITE_MAP.keys())}")
    else:
        html_file = PROJECT_ROOT / SITE_MAP[site]
        if html_file.exists():
            print(f"  File: {html_file} (exists)")
        else:
            errors.append(f"HTML file not found: {html_file}")

    # 4. Check git status
    print("\n[4/4] Checking git status...")
    try:
        result = run_cmd(["git", "status", "--porcelain"], check=False, capture=True)
        if result.stdout.strip():
            print("  Warning: Uncommitted changes detected")
        else:
            print("  Git working tree clean")
    except Exception:
        print("  Git check skipped (not a git repo or git not available)")

    # Summary
    print("\n=== Summary ===")
    if errors:
        print("\nErrors found:")
        for e in errors:
            print(f"  - {e}")
        return False
    else:
        print("\nAll checks passed! Ready to deploy.")
        return True


def prepare_deploy(site: str):
    """Prepare the deployment directory."""
    print(f"\n=== Preparing deployment for '{site}' ===\n")

    # Create clean deploy directory
    if DEPLOY_DIR.exists():
        shutil.rmtree(DEPLOY_DIR)
    DEPLOY_DIR.mkdir(parents=True)

    # Copy HTML file as index.html
    src_file = PROJECT_ROOT / SITE_MAP[site]
    dst_file = DEPLOY_DIR / "index.html"
    shutil.copy2(src_file, dst_file)
    print(f"  Copied: {src_file.name} -> {dst_file}")

    # Create vercel.json for static site
    vercel_config = {
        "version": 2,
        "name": site,
        "builds": [
            {
                "src": "index.html",
                "use": "@vercel/static"
            }
        ],
        "routes": [
            {
                "src": "/(.*)",
                "dest": "/index.html"
            }
        ]
    }

    config_file = DEPLOY_DIR / "vercel.json"
    with open(config_file, "w") as f:
        json.dump(vercel_config, f, indent=2)
    print(f"  Created: vercel.json")

    return DEPLOY_DIR


def deploy(site: str, production: bool = False):
    """Deploy to Vercel."""
    print(f"\n=== Deploying '{site}' to Vercel ===\n")

    # Prepare deployment directory
    deploy_dir = prepare_deploy(site)

    # Build vercel command
    cmd = ["vercel", str(deploy_dir), "--yes"]

    # Add token if available
    token = get_vercel_token()
    if token:
        cmd.extend(["--token", token])

    # Add production flag
    if production:
        cmd.append("--prod")
        print("  Mode: PRODUCTION")
    else:
        print("  Mode: Preview")

    # Run deploy
    print(f"\n  Deploying from: {deploy_dir}\n")

    try:
        result = run_cmd(cmd, capture=True)

        # Extract URL from output
        output_lines = result.stdout.strip().split("\n")
        deploy_url = None
        for line in output_lines:
            if "http" in line:
                deploy_url = line.strip()
                break

        print(f"\n=== Deployment Complete ===")
        if deploy_url:
            print(f"\n  URL: {deploy_url}")
        print(f"\n  Full output:\n{result.stdout}")

        return deploy_url

    except subprocess.CalledProcessError as e:
        print(f"\nDeployment failed!")
        print(f"Error: {e.stderr if e.stderr else e}")
        return None


def add_domain(domain: str):
    """Add a custom domain to the Vercel project."""
    print(f"\n=== Adding domain: {domain} ===\n")

    token = get_vercel_token()
    if not token:
        print("Error: VERCEL_TOKEN required for domain operations")
        return False

    cmd = ["vercel", "domains", "add", domain, "--token", token]

    try:
        result = run_cmd(cmd, capture=True)
        print(result.stdout)

        print(f"\n=== DNS Configuration Required ===")
        print(f"\nAdd the following DNS records for {domain}:")
        print(f"  Type: CNAME")
        print(f"  Name: @ (or subdomain)")
        print(f"  Value: cname.vercel-dns.com")
        print(f"\nOr for apex domain:")
        print(f"  Type: A")
        print(f"  Name: @")
        print(f"  Value: 76.76.21.21")

        return True

    except subprocess.CalledProcessError as e:
        print(f"Failed to add domain!")
        print(f"Error: {e.stderr if e.stderr else e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Deploy website to Vercel")
    parser.add_argument("--preflight", action="store_true", help="Run pre-flight checks")
    parser.add_argument("--deploy", action="store_true", help="Deploy to Vercel")
    parser.add_argument("--site", default="jinxa", choices=SITE_MAP.keys(),
                       help="Site to deploy (default: jinxa)")
    parser.add_argument("--production", action="store_true", help="Deploy to production")
    parser.add_argument("--domain", help="Add custom domain")

    args = parser.parse_args()

    # Load environment
    load_env()

    if args.preflight:
        success = preflight(args.site)
        sys.exit(0 if success else 1)

    if args.deploy:
        url = deploy(args.site, args.production)
        sys.exit(0 if url else 1)

    if args.domain:
        success = add_domain(args.domain)
        sys.exit(0 if success else 1)

    # No action specified
    parser.print_help()


if __name__ == "__main__":
    main()
