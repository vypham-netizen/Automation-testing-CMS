import { test, expect } from '@playwright/test';

/**
 * Test khói (smoke): xác nhận đã đăng nhập và vào được màn chính.
 * Nhờ storageState, test này KHÔNG cần login lại.
 */
test('đã đăng nhập thì vào được màn Danh sách hợp đồng', async ({ page }) => {
  await page.goto('/contracts');
  await expect(page.getByText('Danh sách hợp đồng')).toBeVisible();
});
