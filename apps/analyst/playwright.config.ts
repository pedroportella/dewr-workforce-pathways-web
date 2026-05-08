import { defineConfig, devices } from '@playwright/test';

const DEWR_ANALYST_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_DEWR ?? 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 120000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: DEWR_ANALYST_BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 0,
    navigationTimeout: 30000
  },
  webServer: {
    command: 'NEXT_PUBLIC_USE_API_MOCKS=true pnpm exec vite --host 127.0.0.1 --port 5173 --strictPort',
    url: DEWR_ANALYST_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      }
    }
  ]
});
