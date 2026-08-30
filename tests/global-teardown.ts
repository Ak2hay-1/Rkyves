import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

function loadLocalEnv() {
  for (const file of [".env", ".env.local"]) {
    if (!existsSync(file)) continue;
    try {
      loadEnvFile(file);
    } catch {
      // Ignore missing or unreadable env files.
    }
  }
}

export default async function globalTeardown() {
  loadLocalEnv();

  if (!process.env.DATABASE_URL?.trim()) {
    console.log("Skipping test cleanup: DATABASE_URL not set");
    return;
  }

  try {
    execSync("npm run test:cleanup", { stdio: "inherit", cwd: process.cwd() });
  } catch (error) {
    console.error("Test cleanup failed:", error);
  }
}
