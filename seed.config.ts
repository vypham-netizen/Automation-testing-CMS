import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Config riêng cho việc seed dữ liệu (KHÔNG dùng auth.setup — inject token thẳng trong test).
export default defineConfig({
  testDir: './tests',
  testMatch: /seed\.spec\.ts/,
  timeout: 600_000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://192.168.1.4:5174',
    ignoreHTTPSErrors: true,
    headless: true,
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'seed', use: { ...devices['Desktop Chrome'] } }],
});
