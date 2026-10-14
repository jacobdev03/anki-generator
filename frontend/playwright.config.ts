import { defineConfig, devices } from "@playwright/test";
import { python } from "./tests/e2e/python";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  globalTimeout: 10 * 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3102",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `"${python}" ../backend/tests/e2e_server.py`,
      url: "http://127.0.0.1:8102/health",
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "node node_modules/next/dist/bin/next build && node tests/e2e/start-frontend.mjs",
      url: "http://127.0.0.1:3102",
      env: { NEXT_PUBLIC_API_URL: "http://127.0.0.1:8102/api" },
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
