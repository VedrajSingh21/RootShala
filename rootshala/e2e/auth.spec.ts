import { test, expect } from '@playwright/test';

const USERS = [
  { id: 'EMP-739', name: 'Vikram Sharma', role: 'Super Admin', password: 'vikram@739' },
  { id: 'EMP-902', name: 'Anjali Desai', role: 'Principal', password: 'anjali@902' },
  { id: 'TCH-202', name: 'Priya Patel', role: 'Class Teacher', password: 'priya@202' },
  { id: 'ACT-511', name: 'Rahul Verma', role: 'Accountant', password: 'rahul@511' },
  { id: 'REC-114', name: 'Sneha Reddy', role: 'Receptionist', password: 'sneha@114' }
];

for (const user of USERS) {
  test(`Login Flow: ${user.name}`, async ({ page }) => {
    await page.goto('/app');

    // Fill credentials
    await page.fill('input[type="text"]', user.id);
    await page.fill('input[type="password"]', user.password);
    await page.click('button:has-text("Initialize Session")');

    // Confirm correct dashboard/role appears
    await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

    // Confirm auth persistence (re-navigating doesn't logout)
    await page.goto('/app');
    await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });

    // Check claims logic (in this case mock auth local storage)
    const storedUser = await page.evaluate(() => localStorage.getItem('eduone_user'));
    expect(storedUser).toContain(user.id);
    expect(storedUser).toContain(user.role);

    // Logout
    await page.click('button[title="Log out securely"]');

    // Confirm logged out
    await expect(page.locator('text="Initialize Session"')).toBeVisible();

    // Confirm session clears by navigating back
    await page.goto('/app');
    await expect(page.locator('text="Initialize Session"')).toBeVisible();
  });
}

test('Login Flow: Invalid Password', async ({ page }) => {
  await page.goto('/app');
  await page.fill('input[type="text"]', 'EMP-739');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button:has-text("Initialize Session")');

  await expect(page.locator('text="Invalid credentials."')).toBeVisible({ timeout: 5000 });
});
