import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Đọc biến môi trường từ file .env (BASE_URL, tài khoản...)
dotenv.config();

export default defineConfig({
  testDir: './tests',          // nơi chứa file test
  fullyParallel: true,         // chạy song song cho nhanh
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',            // báo cáo dạng web đẹp

  use: {
    baseURL: process.env.BASE_URL || 'http://192.168.1.4:5174',
    trace: 'on-first-retry',   // ghi lại "đường đi" khi test fail để xem lại
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    // 1) Project "setup": đăng nhập 1 lần, lưu session vào .auth/user.json
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 2) Project chính: dùng lại session đã login (không phải login lại mỗi test)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'], // chạy "setup" trước
    },
  ],
});
