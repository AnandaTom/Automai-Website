from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    
    # Navigate to page
    page.goto('http://localhost:8082')
    page.wait_for_load_state('networkidle')
    page.reload()
    time.sleep(2)
    
    # Click EN span in nav-lang
    en_span = page.locator('.nav-lang span:not(.active):has-text("EN")')
    print(f'Found EN spans: {en_span.count()}')
    
    if en_span.count() > 0:
        print('Clicking EN...')
        en_span.click()
        time.sleep(2)
        
        # Take screenshot after switch
        page.screenshot(path='.playwright-mcp/hero-section-en.png')
        print('EN screenshot saved')
        
        # Get button text
        button = page.locator('a.cta-button').first
        button_text = button.text_content()
        print(f'Button text after switch: "{button_text}"')
    else:
        print('EN span not found')
    
    browser.close()
