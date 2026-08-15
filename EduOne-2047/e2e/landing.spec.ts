import { test, expect } from '@playwright/test';

test('Landing Page: Basic visibility and navigation', async ({ page }) => {
  await page.goto('/');
  
  // Verify standard landing UI elements
  await expect(page.locator('text="RootShala"').first()).toBeVisible();
  await expect(page.locator('text="Autonomous School Operating System"').first()).toBeVisible();
  
  // Check that clicking Login goes to the login form
  const loginButton = page.locator('button:has-text("Login")').first();
  if (await loginButton.isVisible()) {
    await loginButton.click();
    await expect(page.locator('text="Secure Staff Authentication"').first()).toBeVisible({ timeout: 5000 });
  }
});
