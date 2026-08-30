import { test, expect } from "@playwright/test";
import { createAnonymousApiClient } from "../shared/api-client";
import { isIntegrationEnabled, testContactPayload } from "../shared/test-data";

test.describe("Contact Resend @integration", () => {
  test.skip(!isIntegrationEnabled("TEST_CONTACT_SEND"), "Set TEST_CONTACT_SEND=1 to run");

  test("POST /api/contact sends successfully", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/contact", { data: testContactPayload() });
    expect(res.ok()).toBe(true);
    await api.dispose();
  });
});
