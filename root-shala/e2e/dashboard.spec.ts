import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/login', async route => {
    const postData = JSON.parse(route.request().postData() || '{}');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { 
          id: postData.staffId, 
          name: 'Test User', 
          role: postData.staffId === 'EMP-739' ? 'Super Admin' : 
                postData.staffId === 'TCH-202' ? 'Class Teacher' : 
                postData.staffId === 'ACT-511' ? 'Accountant' : 'Staff', 
          mustResetPassword: false 
        },
        token: 'mock-session-token'
      })
    });
  });
});

test('Dashboard KPI: Super Admin sees all', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'EMP-739');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');

  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  // Wait for load and verify navigation
  await expect(page.locator('nav').filter({ hasText: 'Super Admin Panel' })).toBeVisible({ timeout: 10000 });
});

test('Dashboard KPI: Class Teacher sees own class only', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'TCH-202');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');

  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  // Verify KPIs
  const dashboardText = await page.locator('main').innerText();
  expect(dashboardText).toContain('My Class'); // In their class
  expect(dashboardText).toContain('Enrolled students');
  expect(dashboardText).not.toContain('Total Fees');
});

test('Dashboard KPI: Accountant sees fee data', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'ACT-511');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');

  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  // Verify KPIs
  const dashboardText = await page.locator('main').innerText();
  expect(dashboardText).toContain('Fees');
  expect(dashboardText).toContain('TOTAL COLLECTED');
});
