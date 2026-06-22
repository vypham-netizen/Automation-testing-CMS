import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// File này chạy MỘT LẦN trước các test khác:
// đăng nhập rồi LƯU session vào .auth/user.json để tái sử dụng.
const authFile = '.auth/user.json';

setup('đăng nhập 1 lần và lưu session', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.CMS_USERNAME!, process.env.CMS_PASSWORD!);

  // Chờ login xong, hệ thống chuyển vào màn trong (vd: /contracts).
  // Nếu app chuyển sang URL khác, sửa lại dòng dưới cho đúng.
  await page.waitForURL('**/contracts', { timeout: 15000 });

  // Lưu cookie/localStorage để các test sau dùng lại, khỏi login lại.
  await page.context().storageState({ path: authFile });
});
