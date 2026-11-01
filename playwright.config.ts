import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4180",
    headless: true,
    launchOptions: {
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : {}),
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    port: 4180,
    reuseExistingServer: !process.env.CI,
  },
});
