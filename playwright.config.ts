import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.BASE_URL) {
  throw new Error('Missing BASE_URL in environment (.env).');
}

export default defineConfig({
  testDir: './features',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  outputDir: './test-results/runs',
  preserveOutput: 'failures-only',

  reporter: process.env.CI
    ? [['blob'], ['list']]
    : [
        ['html',  { outputFolder: 'test-results/html-report', open: 'never' }],
        ['json',  { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['list'],
      ],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 8000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: ['--no-sandbox'] },
      },
    },
  ],
});
