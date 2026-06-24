import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './config/env';

// Config cho E2E luồng đầy đủ (inject token, không dùng auth.setup).
// Chạy: TEST_ENV=staging npm run e2e   (hoặc local)
export default defineConfig({
  testDir: './tests',
  testMatch: /e2e-.*\.spec\.ts/,
  timeout: 600_000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    headless: true,
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'e2e', use: { ...devices['Desktop Chrome'] } }],
});
