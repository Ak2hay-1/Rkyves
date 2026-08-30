import { test, expect } from "@playwright/test";
import {
  registerClient,
  testCompanyName,
  testEmail,
  TEST_PREFIX,
} from "../shared/test-data";

test.describe("Create client @prod-write", () => {
  test("creates a client and shows it on the detail page", async ({ page }) => {
    const companyName = testCompanyName();
    const email = testEmail();

    await page.goto("/os/clients/new");
    await page.getByLabel("Company Name *").fill(companyName);
    await page.getByLabel("Contact Person *").fill(`${TEST_PREFIX} Contact`);
    await page.getByLabel("Email *").fill(email);
    await page.getByRole("button", { name: "Create Client" }).click();

    await page.waitForURL(/\/os\/clients\/[a-f0-9-]+/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: companyName })).toBeVisible();

    const match = page.url().match(/\/os\/clients\/([a-f0-9-]+)/);
    expect(match?.[1]).toBeTruthy();
    registerClient(match![1]!);

    await page.goto("/os/clients");
    await expect(page.locator("table").getByText(companyName)).toBeVisible();
  });
});
