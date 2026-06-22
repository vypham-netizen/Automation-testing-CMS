import { test, expect } from '@playwright/test';
import { TidMidPage } from '../pages/TidMidPage';

/**
 * Test màn Quản lý TID/MID (read-only, an toàn — không đổi dữ liệu).
 */
test.describe('Quản lý TID/MID', () => {
  test('hiển thị tiêu đề và nút Xuất Excel', async ({ page }) => {
    const tidMid = new TidMidPage(page);
    await tidMid.goto();

    await expect(tidMid.heading).toBeVisible();
    await expect(tidMid.exportButton).toBeVisible();
  });

  test('mở menu "..." thấy các chức năng', async ({ page }) => {
    const tidMid = new TidMidPage(page);
    await tidMid.goto();
    await tidMid.openActionMenu();

    // Khi chưa tick bản ghi: Import file & Tra cứu enable; còn lại disable
    await expect(page.getByRole('menuitem', { name: 'Import file' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Tra cứu dữ liệu TID' })).toBeVisible();
  });
});
