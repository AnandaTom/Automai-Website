"""
Capture screenshots of the website improvements using Playwright
"""
import os
import time
from playwright.sync_api import sync_playwright

# Base directory
BASE_DIR = r"c:\Users\tomra\OneDrive\Dokumente\Agence IA Automatisation\Agentic Workflows\Website Builder"
TMP_DIR = os.path.join(BASE_DIR, ".tmp")

# Ensure .tmp directory exists
os.makedirs(TMP_DIR, exist_ok=True)

def capture_screenshots():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        # Navigate to the website with hard reload
        print("1. Capturing hero section...")
        page.goto("http://localhost:8082", wait_until="networkidle")
        page.reload(timeout=10000)
        time.sleep(1)
        page.screenshot(path=os.path.join(TMP_DIR, "1-hero-section.png"), full_page=False)
        print("   [OK] Hero section captured")
        
        # Scroll down to show progress bar
        print("2. Capturing scroll progress bar...")
        page.evaluate("window.scrollTo(0, 800)")
        time.sleep(0.5)
        page.screenshot(path=os.path.join(TMP_DIR, "2-scroll-progress.png"), full_page=False)
        print("   [OK] Scroll progress bar captured")
        
        # Navigate to process section
        print("3. Capturing process section...")
        page.goto("http://localhost:8082#process", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(TMP_DIR, "3-process-section.png"), full_page=False)
        print("   [OK] Process section captured")
        
        # Navigate to FAQ and click on first question
        print("4. Capturing FAQ section...")
        page.goto("http://localhost:8082#faq", wait_until="networkidle")
        time.sleep(1)
        
        # Click on the first FAQ question to expand it
        faq_questions = page.query_selector_all(".faq-question")
        if faq_questions:
            faq_questions[0].click()
            time.sleep(0.5)
        
        page.screenshot(path=os.path.join(TMP_DIR, "4-faq-section.png"), full_page=False)
        print("   [OK] FAQ section captured")
        
        # Close browser
        browser.close()
        
        print("\nAll screenshots captured successfully!")
        print(f"Screenshots saved to: {TMP_DIR}")

if __name__ == "__main__":
    capture_screenshots()
