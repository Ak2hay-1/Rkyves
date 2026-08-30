import { test, expect } from "@playwright/test";
import { createAnonymousApiClient, createOsApiClient } from "../shared/api-client";

test.describe("Validation API @prod-safe", () => {
  test("POST /api/os/auth/login with invalid email returns 400", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/os/auth/login", {
      data: { email: "not-an-email", password: "x" },
    });
    expect(res.status()).toBe(400);
    await api.dispose();
  });

  test("POST /api/os/clients with missing fields returns 400", async () => {
    const api = await createOsApiClient();
    const res = await api.post("/api/os/clients", { data: { companyName: "Only Name" } });
    expect(res.status()).toBe(400);
    await api.dispose();
  });

  test("POST /api/portal/tickets with invalid body returns 400", async () => {
    const api = await createOsApiClient();
    const res = await api.post("/api/portal/tickets", { data: { subject: "hi" } });
    expect([400, 403]).toContain(res.status());
    await api.dispose();
  });

  test("POST /api/contact with empty body returns 400", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/contact", { data: {} });
    expect(res.status()).toBe(400);
    await api.dispose();
  });

  test("PATCH /api/os/notifications without id or markAllRead returns 400", async () => {
    const api = await createOsApiClient();
    const res = await api.patch("/api/os/notifications", { data: {} });
    expect(res.status()).toBe(400);
    await api.dispose();
  });
});
