import { test, expect } from '@playwright/test';

const USERS = [
  { id: 'EMP-739', name: 'Super Admin', role: 'Super Admin' },
  { id: 'EMP-902', name: 'Principal', role: 'Principal' },
  { id: 'TCH-202', name: 'Class Teacher', role: 'Class Teacher' },
  { id: 'ACT-511', name: 'Accountant', role: 'Accountant' },
  { id: 'REC-114', name: 'Receptionist', role: 'Receptionist' }
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/login', async route => {
    const postData = JSON.parse(route.request().postData() || '{}');
    const user = USERS.find(u => u.id === postData.staffId);
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

for (const user of USERS) {
  test(`RBAC UI Visibility: ${user.name}`, async ({ page }) => {
    await page.goto('/app');
    
    // Fill credentials
    await page.fill('input[type="text"]', user.id);
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Initialize Session")');
    
    // Wait for load
    await expect(page.locator('text="Initialize Session"')).toBeHidden({ timeout: 10000 });
    
    const navText = await page.evaluate(() => document.querySelector('nav')?.textContent || '');

    if (user.role === 'Class Teacher') {
      expect(navText).toContain('Students & Roster');
      expect(navText).toContain('Attendance');
      expect(navText).toContain('Timetable');
      expect(navText).not.toContain('Fee Management');
      
      // Try to navigate directly to an unauthorized route
      await page.goto('/app?module=fees');
      await expect(page.locator('text="Fee Management"')).toBeHidden();
    }
    
    if (user.role === 'Accountant') {
      expect(navText).toContain('Fee Management');
      expect(navText).toContain('Documents');
      expect(navText).not.toContain('Attendance');
      
      await page.goto('/app?module=attendance');
      await expect(page.locator('text="Mark All Present"')).toBeHidden();
    }
    
    if (user.role === 'Receptionist') {
      expect(navText).toContain('Documents');
      expect(navText).not.toContain('Fee Management');
      expect(navText).not.toContain('Attendance');
    }
  });
}
