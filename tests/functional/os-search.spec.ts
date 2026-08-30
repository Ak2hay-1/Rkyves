import { test, expect } from "@playwright/test";

test.describe("Global search @prod-safe", () => {
  test("shows search results for Jerzyfy", async ({ page }) => {
    await page.goto("/os/dashboard");

    const searchInput = page.getByPlaceholder("Search clients, invoices, projects...");
    await searchInput.fill("Jerzy");

    const resultsPanel = page.locator("button").filter({ hasText: /Jerzy/i });
    await expect(resultsPanel.first()).toBeVisible({ timeout: 10_000 });
  });
});
