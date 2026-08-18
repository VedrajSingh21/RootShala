const { chromium } = require('playwright-core');
const fs = require('fs');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log("BROWSER:", msg.text()));
  page.on('pageerror', error => console.log("BROWSER ERROR:", error));

  try {
    console.log("Navigating to http://localhost:5174/app");
    const response = await page.goto('http://localhost:5174/app');
    console.log("Status:", response.status());
    
    await page.waitForTimeout(2000);
    
    console.log("Logging in...");
    await page.waitForSelector('input[type="text"]');
    await page.fill('input[type="text"]', 'EMP-739');
    await page.fill('input[type="password"]', 'vikram@739');
    await page.click('button:has-text("Initialize Session")');
    
    console.log("Wait for dashboard...");
    await page.waitForSelector('text=Fee & Bank Ledger', { timeout: 10000 });
    console.log("Dashboard loaded, navigating to Fees...");
    await page.click('text=Fee & Bank Ledger');
    
    await page.waitForTimeout(3000);
    console.log("Saved test_fees_tab.png");
    await page.screenshot({ path: 'test_fees_tab.png' });

    console.log("Clicking Upload Receipt OCR...");
    await page.click('button:has-text("Upload Receipt OCR")');
    
    await page.waitForTimeout(1000);
    console.log("Uploading file...");
    await page.setInputFiles('input[type="file"]', 'receipt.png');
    
    await page.waitForTimeout(1000);
    console.log("Clicking AI Receipt Extraction...");
    await page.click('button:has-text("AI Receipt Extraction")');
    
    console.log("Waiting for extraction (20s)...");
    await page.waitForTimeout(20000);
    
    console.log("Navigating to AI Command Center / Document Center to check the extracted result...");
    await page.click('text=Admission OCR & Docs');
    
    await page.waitForTimeout(3000);
    console.log("Test completed. Extracting text from page to verify.");
    const finalContent = await page.innerText('body');
    fs.writeFileSync('final_content.txt', finalContent);
    
    console.log("Saving screenshot...");
    await page.screenshot({ path: 'test_final.png' });
    
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
})();
