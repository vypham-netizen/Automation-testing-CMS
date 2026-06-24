import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './config/env';

// Môi trường chọn bằng TEST_ENV=local|staging (xem config/env.ts).
export default defineConfig({
  testDir: './tests',          // nơi chứa file test
  testIgnore: /seed.*\.spec\.ts|e2e-.*\.spec\.ts/, // các luồng inject-token chạy bằng config riêng
  fullyParallel: true,         // chạy song song cho nhanh
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',            // báo cáo dạng web đẹp

  use: {
    baseURL: BASE_URL,
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
