import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";
import { isIntegrationEnabled } from "../shared/test-data";

test.describe("Invoice send @integration", () => {
  test.skip(!isIntegrationEnabled("TEST_INVOICE_SEND"), "Set TEST_INVOICE_SEND=1 to run");

  test("send invoice endpoint responds for seed invoice", async () => {
    const api = await createOsApiClient();
    const searchRes = await api.get("/api/os/search?q=INV-JER");
    const searchBody = await searchRes.json();
    const invoice = searchBody.results.find((r: { type: string }) => r.type === "invoice");
    expect(invoice).toBeTruthy();

    const res = await api.post(`/api/os/invoices/${invoice.id}/send`);
    expect(res.status()).not.toBe(500);
    await api.dispose();
  });
});
