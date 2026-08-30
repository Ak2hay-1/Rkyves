import { test as setup } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { loginOs, loginPortal } from "../shared/auth";

const authDir = path.join(__dirname, ".auth");

setup.beforeAll(() => {
  fs.mkdirSync(authDir, { recursive: true });
});

setup("authenticate OS", async ({ page }) => {
  await loginOs(page);
  await page.context().storageState({ path: path.join(authDir, "os.json") });
});

setup("authenticate Portal", async ({ page }) => {
  await loginPortal(page);
  await page.context().storageState({ path: path.join(authDir, "portal.json") });
});
