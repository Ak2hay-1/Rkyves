import path from "node:path";
import { test, expect } from "@playwright/test";
import { registerTicket, testSubject, TEST_PREFIX } from "../shared/test-data";

const baseURL = process.env.BASE_URL?.replace(/\/$/, "") || "https://rkyves.com";

test.describe("Portal tickets @prod-write", () => {
  test("submits a ticket visible in portal and OS", async ({ page, browser }) => {
    const subject = testSubject();

    await page.goto("/portal/tickets");
    await page.getByLabel("Subject").fill(subject);
    await page.getByLabel("Description").fill(`${TEST_PREFIX} Automated portal ticket test.`);
    await page.locator("#priority").selectOption("low");
    await page.locator("#category").selectOption("general");

    const createRes = page.waitForResponse(
      (res) => res.url().includes("/api/portal/tickets") && res.request().method() === "POST"
    );
    await page.getByRole("button", { name: "Submit Ticket" }).click();
    const res = await createRes;
    expect(res.status()).toBe(201);
    const body = await res.json();
    registerTicket(body.ticket.id);

    await page.reload();
    await expect(page.getByText(subject)).toBeVisible();

    const osContext = await browser.newContext({
      storageState: path.join(__dirname, "../smoke/.auth/os.json"),
      baseURL,
    });
    const osPage = await osContext.newPage();
    await osPage.goto("/os/tickets");
    await expect(osPage.getByText(subject)).toBeVisible();
    await osContext.close();
  });
});
