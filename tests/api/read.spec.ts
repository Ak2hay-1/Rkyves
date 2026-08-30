import { test, expect } from "@playwright/test";
import { createOsApiClient, createPortalApiClient } from "../shared/api-client";

test.describe("Read APIs @prod-safe", () => {
  test("GET /api/os/clients returns client list", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/clients");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.clients.length).toBeGreaterThan(0);
    await api.dispose();
  });

  test("GET /api/os/services returns services", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/services");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.services)).toBe(true);
    await api.dispose();
  });

  test("GET /api/os/payments returns payments", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/payments");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.payments)).toBe(true);
    await api.dispose();
  });

  test("GET /api/os/search finds Jerzyfy client", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/search?q=Jerzy");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results.some((r: { title: string }) => r.title.includes("Jerzy"))).toBe(true);
    await api.dispose();
  });

  test("GET /api/os/search with short query returns empty", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/search?q=a");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.results).toEqual([]);
    await api.dispose();
  });

  test("GET /api/os/notifications returns notification payload", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/notifications");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.notifications)).toBe(true);
    expect(typeof body.unreadCount).toBe("number");
    await api.dispose();
  });

  test("GET invoice PDF as admin returns PDF", async () => {
    const api = await createOsApiClient();
    const searchRes = await api.get("/api/os/search?q=INV-JER");
    const searchBody = await searchRes.json();
    const invoice = searchBody.results.find((r: { type: string }) => r.type === "invoice");
    expect(invoice).toBeTruthy();

    const pdfRes = await api.get(`/api/os/invoices/${invoice.id}/pdf`);
    expect(pdfRes.status()).toBe(200);
    expect(pdfRes.headers()["content-type"]).toContain("application/pdf");
    await api.dispose();
  });

  test("portal client cannot download another client invoice PDF", async () => {
    const osApi = await createOsApiClient();
    const searchRes = await osApi.get("/api/os/search?q=INV-QUI");
    const searchBody = await searchRes.json();
    const invoice = searchBody.results.find((r: { type: string }) => r.type === "invoice");
    expect(invoice).toBeTruthy();

    const portalApi = await createPortalApiClient();
    const pdfRes = await portalApi.get(`/api/os/invoices/${invoice.id}/pdf`);
    expect(pdfRes.status()).toBe(403);
    await portalApi.dispose();
    await osApi.dispose();
  });
});
