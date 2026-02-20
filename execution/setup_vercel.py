#!/usr/bin/env python3
"""
One-time setup for Vercel deployments.

This script:
1. Checks if Node.js is installed
2. Installs Vercel CLI globally
3. Guides user through Vercel login and token generation
4. Updates .env with VERCEL_TOKEN

Usage:
    python setup_vercel.py
"""

import os
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
ENV_FILE = PROJECT_ROOT / ".env"


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


def check_node():
    """Check if Node.js is installed."""
    print("\n[1/4] Checking Node.js...")
    try:
        result = run_cmd(["node", "--version"], check=False, capture=True)
        if result.returncode == 0:
            print(f"  Node.js: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("\n  ERROR: Node.js not found!")
    print("  Please install Node.js from: https://nodejs.org/")
    return False


def check_npm():
    """Check if npm is available."""
    print("\n[2/4] Checking npm...")
    try:
        result = run_cmd(["npm", "--version"], check=False, capture=True)
        if result.returncode == 0:
            print(f"  npm: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("  ERROR: npm not found!")
    return False


def install_vercel_cli():
    """Install Vercel CLI globally."""
    print("\n[3/4] Installing Vercel CLI...")
    try:
        result = run_cmd(["vercel", "--version"], check=False, capture=True)
        if result.returncode == 0:
            print(f"  Vercel CLI already installed: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("  Installing vercel globally...")
    run_cmd(["npm", "install", "-g", "vercel"])

    # Verify installation
    result = run_cmd(["vercel", "--version"], check=False, capture=True)
    if result.returncode == 0:
        print(f"  Vercel CLI installed: {result.stdout.strip()}")
        return True
    else:
        print("  ERROR: Vercel CLI installation failed!")
        return False


def setup_token():
    """Guide user through token setup."""
    print("\n[4/4] Setting up VERCEL_TOKEN...")

    # Check if token already exists
    if ENV_FILE.exists():
        with open(ENV_FILE, "r") as f:
            content = f.read()
            if "VERCEL_TOKEN=" in content and not "VERCEL_TOKEN=\n" in content:
                lines = content.split("\n")
                for line in lines:
                    if line.startswith("VERCEL_TOKEN=") and len(line) > 13:
                        print("  VERCEL_TOKEN already set in .env")
                        return True

    print("\n  To deploy without interactive prompts, you need a Vercel token.")
    print("\n  Steps to get your token:")
    print("  1. Go to: https://vercel.com/account/tokens")
    print("  2. Click 'Create' to generate a new token")
    print("  3. Copy the token")
    print()

    token = input("  Paste your VERCEL_TOKEN (or press Enter to skip): ").strip()

    if token:
        # Update .env file
        env_content = ""
        if ENV_FILE.exists():
            with open(ENV_FILE, "r") as f:
                env_content = f.read()

        # Remove existing VERCEL_TOKEN line if present
        lines = env_content.split("\n")
        lines = [l for l in lines if not l.startswith("VERCEL_TOKEN=")]

        # Add new token
        lines.append(f"VERCEL_TOKEN={token}")

        with open(ENV_FILE, "w") as f:
            f.write("\n".join(lines))

        print(f"\n  VERCEL_TOKEN saved to .env")
        return True
    else:
        print("\n  Skipped. You can still deploy interactively with 'vercel login'")
        return True


def main():
    print("=" * 50)
    print("  Vercel Setup")
    print("=" * 50)

    # Step 1: Check Node.js
    if not check_node():
        sys.exit(1)

    # Step 2: Check npm
    if not check_npm():
        sys.exit(1)

    # Step 3: Install Vercel CLI
    if not install_vercel_cli():
        sys.exit(1)

    # Step 4: Setup token
    setup_token()

    print("\n" + "=" * 50)
    print("  Setup Complete!")
    print("=" * 50)
    print("\n  Next steps:")
    print("  1. Run: python execution/deploy_vercel.py --preflight")
    print("  2. Deploy: python execution/deploy_vercel.py --deploy --site jinxa")
    print()


if __name__ == "__main__":
    main()
