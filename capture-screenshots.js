const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  // Navigate and hard reload
  await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  
  console.log('Page loaded successfully');
  
  // 1. Hero section with centered header, new fonts, gradient text, and floating elements
  await page.screenshot({ 
    path: '.playwright-mcp/hero-section-full.png',
    fullPage: false
  });
  console.log('Hero section screenshot saved');
  
  // 2. Close-up of the centered floating navbar with glassmorphism
  const navbar = await page.locator('nav').first();
  await navbar.screenshot({ 
    path: '.playwright-mcp/navbar-glassmorphism.png'
  });
  console.log('Navbar screenshot saved');
  
  // 3. Service cards - scroll to services section
  await page.evaluate(() => {
    const servicesSection = document.querySelector('.services-grid');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await page.waitForTimeout(1000);
  
  // Take screenshot of service cards
  const servicesGrid = await page.locator('.services-grid').first();
  await servicesGrid.screenshot({ 
    path: '.playwright-mcp/service-cards.png'
  });
  console.log('Service cards screenshot saved');
  
  // 4. Hover over first service card to show glassmorphism effect
  const firstCard = await page.locator('.service-card').first();
  await firstCard.hover();
  await page.waitForTimeout(500); // Wait for hover animation
  await firstCard.screenshot({ 
    path: '.playwright-mcp/service-card-hover.png'
  });
  console.log('Service card hover screenshot saved');
  
  await browser.close();
  console.log('All screenshots captured successfully!');
})();
