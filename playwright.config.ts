import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modules compatible __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables (development only)
if (process.env.VITE_ENVIRONMENT !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.dev') });
}

export default defineConfig({
  // Default to tests/e2e directory if not specified
  testDir: process.env.VITE_TEST_PLAYWRIGHT_DIR || './test-playwright',

  /* Vite-specific settings */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Vite-compatible reporter */
  reporter: [
    ['html', { outputFolder: 'test-reports' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  use: {
    baseURL: process.env.VITE_CLIENT_BASE_URL,

    video: 'off',

    screenshot: 'only-on-failure',

    trace: 'on-first-retry',

    actionTimeout: 10_000,
  },

  /* Browser configurations */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Vite dev server configuration */
  webServer: {
    command: 'npm run dev',
    url: process.env.VITE_CLIENT_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      // Ensure Vite uses test environment variables
      NODE_ENV: process.env.NODE_ENV || 'test',
      VITE_APP_MODE: 'test',
    },
  },
});
