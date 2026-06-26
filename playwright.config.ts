import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  timeout: 60000,

  reporter: [
    ['html', { outputFolder: 'tests/reports' }]
  ],

  use: {
    baseURL: 'https://TU_DEPLOY.com',

    screenshot: 'on',

    video: 'retain-on-failure',

    trace: 'retain-on-failure',

    ignoreHTTPSErrors: true,

    viewport: {
      width: 1366,
      height: 768
    }
  }
});