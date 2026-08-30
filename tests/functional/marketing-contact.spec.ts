import { test, expect } from "@playwright/test";
import { isIntegrationEnabled, testContactPayload } from "../shared/test-data";

test.describe("Contact form @prod-safe", () => {
  test("shows validation errors when submitted empty", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    await expect(page.getByText("Message must be at least 10 characters")).toBeVisible();
  });
});

test.describe("Contact form send @integration", () => {
  test.skip(!isIntegrationEnabled("TEST_CONTACT_SEND"), "Set TEST_CONTACT_SEND=1 to run");

  test("submits contact form successfully", async ({ page }) => {
    const payload = testContactPayload();
    await page.goto("/contact");

    await page.getByLabel(/^name/i).fill(payload.name);
    await page.getByLabel(/^email/i).fill(payload.email);
    await page.getByLabel(/^phone/i).fill(payload.phone);
    await page.getByLabel(/^message/i).fill(payload.message);

    const resPromise = page.waitForResponse(
      (res) => res.url().includes("/api/contact") && res.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Send Message" }).click();
    const res = await resPromise;
    expect(res.ok()).toBe(true);
    await expect(page.getByRole("status")).toContainText(/thank you|received|soon/i);
  });
});
