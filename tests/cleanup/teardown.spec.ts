import { test } from "@playwright/test";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

test.describe("Cleanup @prod-write", () => {
  test("removes [TEST] records from database", () => {
    if (!process.env.DATABASE_URL?.trim()) {
      for (const file of [".env", ".env.local"]) {
        if (!existsSync(file)) continue;
        try {
          loadEnvFile(file);
        } catch {
          // Ignore.
        }
      }
    }

    if (!process.env.DATABASE_URL?.trim()) {
      test.skip(true, "DATABASE_URL not set");
      return;
    }

    execSync("npm run test:cleanup", { stdio: "inherit", cwd: process.cwd() });
  });
});
