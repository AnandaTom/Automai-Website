from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    
    # Navigate to page
    page.goto('http://localhost:8082')
    page.wait_for_load_state('networkidle')
    
    # List all buttons
    buttons = page.locator('button').all()
    print(f'Found {len(buttons)} buttons')
    for i, btn in enumerate(buttons):
        text = btn.text_content()
        print(f'Button {i}: "{text}"')
    
    # Try to find EN button with different selectors
    selectors = [
        'button >> text=EN',
        'button:has-text("EN")',
        '[data-lang="en"]',
        'button.lang-btn',
        '.language-switcher button'
    ]
    
    for selector in selectors:
        try:
            count = page.locator(selector).count()
            print(f'Selector "{selector}" found {count} matches')
            if count > 0:
                elem = page.locator(selector).first
                text = elem.text_content()
                print(f'  Text: "{text}"')
        except Exception as e:
            print(f'Selector "{selector}" error: {e}')
    
    browser.close()
