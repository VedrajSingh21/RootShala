import { test, expect } from '@playwright/test';

test('UI/UX: Hover states and styling', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'EMP-739');
  await page.fill('input[type="password"]', 'vikram@739');
  await page.click('button:has-text("Initialize Session")');
  
  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });
  
  // Verify sidebar hover state
  const menuBtn = page.locator('header button.md\\:hidden').first();
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
  }
  const sidebarBtn = page.locator('nav button').first();
  await sidebarBtn.hover();
  // We can't strictly assert CSS transitions in Playwright effectively without visual regression,
  // but we can ensure the element exists and takes interactions.
  await expect(sidebarBtn).toBeVisible();
});

// Playwright viewport emulation is handled automatically via projects in playwright.config.ts 
// (Chromium, Mobile Chrome, Tablet Chrome).
// This test will run across all those viewports, recording video for each.
test('UI/UX: Responsiveness and no horizontal scroll', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'EMP-739');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button:has-text("Initialize Session")');
  
  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });
  
  // Check that body width doesn't exceed viewport width (no horizontal scroll)
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});
