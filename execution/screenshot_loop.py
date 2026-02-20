#!/usr/bin/env python3
"""
Screenshot loop for design iteration: before → modify → after → diff.

Serves a static HTML file locally, captures screenshots at key viewports,
and generates visual diffs to verify design changes without manual browser work.

Usage:
    python screenshot_loop.py --mode before              # Capture baseline
    python screenshot_loop.py --mode after               # Capture after changes
    python screenshot_loop.py --mode diff                # Generate diff report
    python screenshot_loop.py --mode serve (port 8082)   # Just serve, don't screenshot

Dependencies:
    pip install playwright pixelmatch Pillow
    playwright install chromium  (if not already done)
"""

import argparse
import asyncio
import http.server
import os
import socketserver
import sys
import threading
import time
from pathlib import Path
from typing import Optional

try:
    from playwright.async_api import async_playwright
    from PIL import Image, ImageChops
    import numpy as np
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install playwright pixelmatch Pillow")
    sys.exit(1)

# === CONFIGURATION ===

PROJECT_ROOT = Path(__file__).parent.parent
SCREENSHOTS_DIR = PROJECT_ROOT / ".tmp" / "screenshots"
HTML_FILE = PROJECT_ROOT / ".tmp" / "deploy" / "index.html"
HTML_URL_PATH = ".tmp/deploy/index.html"
PORT = 8082
TIMEOUT = 30000  # 30 seconds

# Sections to capture: (name, scroll_y_pixels, viewport_height)
SECTIONS = [
    ("hero", 0, 1080),           # top of page
    ("stats", 800, 800),         # stats section
    ("case_studies", 2200, 1000),  # case studies
    ("how_it_works", 3200, 1000),  # how it works timeline
    ("services", 4200, 1200),    # services grid
    ("cta", 5400, 800),          # final CTA section
]


def setup_dirs():
    """Create screenshot directories if they don't exist."""
    for mode in ["before", "after"]:
        (SCREENSHOTS_DIR / mode).mkdir(parents=True, exist_ok=True)


def start_server(port: int = PORT) -> socketserver.TCPServer:
    """Start a local HTTP server on the given port."""
    os.chdir(PROJECT_ROOT)
    handler = http.server.SimpleHTTPRequestHandler
    handler.log = lambda *args, **kwargs: None  # silence logs

    httpd = socketserver.TCPServer(("", port), handler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()

    print(f"  Server started on http://localhost:{port}")
    time.sleep(0.5)  # give server time to bind
    return httpd


async def capture_screenshots(mode: str = "before"):
    """Capture screenshots of key sections."""
    setup_dirs()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})

        print(f"\n  Navigating to http://localhost:{PORT}/{HTML_URL_PATH}...")
        await page.goto(f"http://localhost:{PORT}/{HTML_URL_PATH}", wait_until="load", timeout=TIMEOUT)

        # Wait for animations to settle
        await asyncio.sleep(1)

        for section_name, scroll_y, viewport_h in SECTIONS:
            print(f"  Capturing {section_name}...", end=" ")

            # Scroll to position
            await page.evaluate(f"window.scrollTo(0, {scroll_y})")
            await asyncio.sleep(0.3)  # let scroll settle

            # Take screenshot
            screenshot_path = SCREENSHOTS_DIR / mode / f"{section_name}.png"
            await page.screenshot(path=str(screenshot_path))
            print(f"[OK] {screenshot_path.name}")

        await browser.close()

    print(f"\n  Captured {len(SECTIONS)} sections to .tmp/screenshots/{mode}/")


def generate_diffs():
    """Compare before/after screenshots and generate diffs."""
    setup_dirs()

    try:
        from pixelmatch.contrib.PIL import pixelmatch
    except ImportError:
        print("  ERROR: pixelmatch not installed")
        print("  Install with: pip install pixelmatch")
        return False

    diff_report = []
    total_pixels = 0
    changed_pixels = 0

    for section_name, _, _ in SECTIONS:
        before_path = SCREENSHOTS_DIR / "before" / f"{section_name}.png"
        after_path = SCREENSHOTS_DIR / "after" / f"{section_name}.png"
        diff_path = SCREENSHOTS_DIR / f"diff_{section_name}.png"

        if not before_path.exists() or not after_path.exists():
            print(f"  Skipping {section_name}: before or after not found")
            continue

        print(f"  Diffing {section_name}...", end=" ")

        img_before = Image.open(before_path).convert("RGB")
        img_after = Image.open(after_path).convert("RGB")
        diff_img = Image.new("RGBA", img_before.size)

        mismatch = pixelmatch(img_before, img_after, diff_img, threshold=0.1)
        diff_img.save(str(diff_path))

        # Calculate stats
        image_pixels = img_before.size[0] * img_before.size[1]
        pct_changed = (mismatch / image_pixels * 100) if image_pixels > 0 else 0

        total_pixels += image_pixels
        changed_pixels += mismatch

        report_line = f"{section_name:20} {mismatch:6d} pixels ({pct_changed:5.1f}%)"
        diff_report.append(report_line)
        print(f"[OK] {pct_changed:.1f}% changed")

    # Write report
    report_path = SCREENSHOTS_DIR / "diff_report.txt"
    total_pct = (changed_pixels / total_pixels * 100) if total_pixels > 0 else 0

    report_content = (
        "Screenshot Diff Report\n"
        "=" * 50 + "\n\n"
        + "\n".join(diff_report) + "\n\n"
        f"Total: {changed_pixels} / {total_pixels} pixels changed ({total_pct:.2f}%)\n"
    )

    with open(report_path, "w") as f:
        f.write(report_content)

    print(f"\n  Report saved to {report_path}")
    print(f"\n{report_content}")

    return True


async def main():
    parser = argparse.ArgumentParser(
        description="Screenshot loop for design iteration",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python screenshot_loop.py --mode before    # Baseline
  python screenshot_loop.py --mode after     # After edits
  python screenshot_loop.py --mode diff      # Generate diffs
  python screenshot_loop.py --mode serve     # Just serve locally
        """
    )
    parser.add_argument(
        "--mode",
        choices=["before", "after", "diff", "serve"],
        default="before",
        help="Capture mode (default: before)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=PORT,
        help=f"Server port (default: {PORT})"
    )

    args = parser.parse_args()

    if not HTML_FILE.exists():
        print(f"ERROR: {HTML_FILE} not found")
        sys.exit(1)

    # Start server
    httpd = start_server(args.port)

    try:
        if args.mode in ["before", "after"]:
            print(f"\n=== Screenshot Mode: {args.mode.upper()} ===\n")
            await capture_screenshots(args.mode)

        elif args.mode == "diff":
            print(f"\n=== Generating Diffs ===\n")
            generate_diffs()

        elif args.mode == "serve":
            print(f"\n=== Serve Mode ===")
            print(f"  Server running. Press Ctrl+C to stop.")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\n  Shutting down...")

    finally:
        httpd.shutdown()


if __name__ == "__main__":
    asyncio.run(main())
