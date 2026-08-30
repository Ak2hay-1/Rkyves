import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";
import { registerLeadStageRevert } from "../shared/test-data";

const LEAD_STAGES = ["lead", "contacted", "requirement", "proposal", "negotiation", "won", "lost"];

test.describe("Lead stage update @prod-write", () => {
  test("advances a lead stage via UI", async ({ page }) => {
    await page.goto("/os/leads");

    const leadCard = page
      .locator(".rounded-xl")
      .filter({ has: page.getByRole("button", { name: /→ /i }) })
      .first();
    await expect(leadCard).toBeVisible();

    const badgeText = ((await leadCard.locator(".flex.items-start.justify-between > *").nth(1).textContent()) ?? "").trim();
    expect(LEAD_STAGES).toContain(badgeText);
    const originalStage = badgeText;

    const advanceButton = leadCard.getByRole("button", { name: /→ /i }).first();
    const targetLabel = ((await advanceButton.textContent()) ?? "").replace("→", "").trim();

    const patchPromise = page.waitForResponse(
      (res) => res.url().includes("/api/os/leads/") && res.request().method() === "PATCH"
    );
    await advanceButton.click();
    const patchRes = await patchPromise;
    expect(patchRes.ok()).toBe(true);

    const leadId = patchRes.url().split("/api/os/leads/")[1]?.split("?")[0];
    if (leadId) registerLeadStageRevert(leadId, originalStage);

    await expect(leadCard.getByText(targetLabel, { exact: true })).toBeVisible();

    if (leadId) {
      const api = await createOsApiClient();
      await api.patch(`/api/os/leads/${leadId}`, { data: { stage: originalStage } });
      await api.dispose();
    }
  });
});
