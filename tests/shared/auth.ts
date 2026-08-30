import type { Page } from "@playwright/test";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set for Playwright auth helpers`);
  }
  return value;
}

export function getOsCredentials() {
  return {
    email: requireEnv("SMOKE_OS_EMAIL"),
    password: requireEnv("SMOKE_OS_PASSWORD"),
  };
}

export function getPortalCredentials() {
  return {
    email: requireEnv("SMOKE_PORTAL_EMAIL"),
    password: requireEnv("SMOKE_PORTAL_PASSWORD"),
  };
}

export function getSalesCredentials() {
  return {
    email: requireEnv("SMOKE_SALES_EMAIL"),
    password: requireEnv("SMOKE_SALES_PASSWORD"),
  };
}

export async function loginOs(page: Page) {
  const { email, password } = getOsCredentials();
  await page.goto("/os/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/\/os\/dashboard/, { timeout: 20_000 });
}

export async function loginPortal(page: Page) {
  const { email, password } = getPortalCredentials();
  await page.goto("/portal/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in to portal/i }).click();
  await page.waitForURL(/\/portal\/?$/, { timeout: 20_000 });
}
