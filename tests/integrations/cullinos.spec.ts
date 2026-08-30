import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";
import { isIntegrationEnabled, testEmail, TEST_PREFIX } from "../shared/test-data";

test.describe("Cullinos provision @integration", () => {
  test.skip(!isIntegrationEnabled("TEST_CULLINOS"), "Set TEST_CULLINOS=1 to run");

  test("provision endpoint responds without server error", async () => {
    const api = await createOsApiClient();
    const clientsRes = await api.get("/api/os/clients");
    const { clients } = await clientsRes.json();
    const jerzyfy = clients.find((c: { companyName: string }) => c.companyName === "Jerzyfy");
    expect(jerzyfy).toBeTruthy();

    const res = await api.post("/api/os/cullinos/provision", {
      data: {
        clientId: jerzyfy.id,
        planSlug: "starter",
        outletName: `${TEST_PREFIX} Outlet ${Date.now()}`,
        adminEmail: testEmail(),
        adminPassword: "TestPass123!",
        adminName: `${TEST_PREFIX} Admin`,
      },
    });

    expect(res.status()).not.toBe(500);
    await api.dispose();
  });
});
