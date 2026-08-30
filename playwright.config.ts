import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL?.replace(/\/$/, "") || "https://rkyves.com";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  globalTeardown: "./tests/global-teardown.ts",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/smoke-report.json" }],
    ["json", { outputFile: "test-results/functional-report.json" }],
  ],
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 20_000,
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "smoke",
      testMatch: /smoke\/.*\.spec\.ts/,
      dependencies: ["setup"],
    },
    {
      name: "api",
      testMatch: /api\/.*\.spec\.ts/,
      dependencies: ["setup"],
    },
    {
      name: "functional",
      testMatch: /functional\/os-.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { storageState: "tests/smoke/.auth/os.json" },
    },
    {
      name: "portal-functional",
      testMatch: /functional\/portal-.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { storageState: "tests/smoke/.auth/portal.json" },
    },
    {
      name: "marketing-functional",
      testMatch: /functional\/marketing-.*\.spec\.ts/,
    },
    {
      name: "integrations",
      testMatch: /integrations\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: { storageState: "tests/smoke/.auth/os.json" },
    },
    {
      name: "cleanup",
      testMatch: /cleanup\/.*\.spec\.ts/,
      dependencies: ["functional", "portal-functional", "integrations"],
    },
  ],
});
