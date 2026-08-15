import { test, expect } from '@playwright/test';

const ACCOUNTS = [
  { role: 'Super Admin', id: 'EMP-739', pass: 'vikram@739', name: 'Vikram Sharma' },
  { role: 'Principal', id: 'EMP-902', pass: 'anjali@902', name: 'Anjali Desai' },
  { role: 'Class Teacher', id: 'TCH-202', pass: 'priya@202', name: 'Priya Patel' },
  { role: 'Accountant', id: 'ACT-511', pass: 'rahul@511', name: 'Rahul Verma' },
  { role: 'Receptionist', id: 'REC-114', pass: 'sneha@114', name: 'Sneha Reddy' }
];

test.describe('Live RBAC Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      const postData = JSON.parse(route.request().postData() || '{}');
      const user = ACCOUNTS.find(u => u.id === postData.staffId);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { 
            id: postData.staffId, 
            name: user ? user.name : 'Test User', 
            role: user ? user.role : 'Staff', 
            mustResetPassword: false 
          },
          token: 'mock-session-token'
        })
      });
    });
  });

  for (const acc of ACCOUNTS) {
    test(`Login and verify ${acc.role}`, async ({ page }) => {
      await page.goto('/app');
      
      await page.fill('input[type="text"]', acc.id);
      await page.fill('input[type="password"]', acc.pass);
      await page.click('button:has-text("Initialize Session")');
      
      // Wait for login to complete and UI to load
      await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 15000 });
      
      // Get all navigation links
      const navText = await page.locator('aside').innerText();
      
      // Take a screenshot of their dashboard
      await page.screenshot({ path: `rbac-screenshots/${acc.id}-${acc.role.replace(' ', '')}-dashboard.png` });
      
      // Basic assertions based on role
      if (acc.role === 'Super Admin' || acc.role === 'Principal') {
        expect(navText).toContain('Super Admin Panel');
      } else if (acc.role === 'Class Teacher') {
        expect(navText).toContain('Students & Roster');
        expect(navText).toContain('Attendance');
        expect(navText).toContain('Timetable');
        expect(navText).not.toContain('Fee & Bank Ledger');
      } else if (acc.role === 'Accountant') {
        expect(navText).toContain('Fee & Bank Ledger');
        expect(navText).not.toContain('Attendance');
      } else if (acc.role === 'Receptionist') {
        expect(navText).toContain('Student Directory');
        expect(navText).not.toContain('Fee & Bank Ledger');
      }
      
      await page.click('button:has-text("Log out securely")');
      await expect(page.locator('text="Initialize Session"')).toBeVisible({ timeout: 10000 });
    });
  }
});
