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
          role: postData.staffId === 'TCH-202' ? 'Class Teacher' : 
                postData.staffId === 'ACT-511' ? 'Accountant' : 
                postData.staffId === 'REC-114' ? 'Receptionist' : 'Staff', 
          mustResetPassword: false 
        },
        token: 'mock-session-token'
      })
    });
  });
});

test('RBAC Data-Layer: Class Teacher cannot write to fees', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'TCH-202');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');
  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  const result = await page.evaluate(async () => {
    try {
      // @ts-ignore
      await window.firebaseSet(window.firebaseRef(window.db, 'fees/test-unauthorized'), { amount: 100 });
      return 'success';
    } catch (e: any) {
      return e.message;
    }
  });

  expect(result.toLowerCase()).toContain('permission denied');
});

test('RBAC Data-Layer: Receptionist cannot write to fees', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'REC-114');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');
  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  const result = await page.evaluate(async () => {
    try {
      // @ts-ignore
      await window.firebaseSet(window.firebaseRef(window.db, 'fees/test-unauthorized-2'), { amount: 200 });
      return 'success';
    } catch (e: any) {
      return e.message;
    }
  });

  expect(result.toLowerCase()).toContain('permission denied');
});

test('RBAC Data-Layer: Accountant cannot write to timetable', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'ACT-511');
  await page.fill('input[type="password"]', 'password');
  await page.click('button:has-text("Initialize Session")');
  await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

  const result = await page.evaluate(async () => {
    try {
      // @ts-ignore
      await window.firebaseSet(window.firebaseRef(window.db, 'timetable/test-unauthorized-3'), { subject: 'Math' });
      return 'success';
    } catch (e: any) {
      return e.message;
    }
  });

  expect(result.toLowerCase()).toContain('permission denied');
});
