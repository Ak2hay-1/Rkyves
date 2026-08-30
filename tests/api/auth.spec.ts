import { test, expect } from "@playwright/test";
import {
  createAnonymousApiClient,
  createOsApiClient,
  createPortalApiClient,
  loginOsViaApi,
  loginPortalViaApi,
  loginSalesViaApi,
} from "../shared/api-client";
import { getOsCredentials, getPortalCredentials } from "../shared/auth";

test.describe("Auth API @prod-safe", () => {
  test("OS login with valid credentials returns user", async () => {
    const api = await createAnonymousApiClient();
    const res = await loginOsViaApi(api);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe(getOsCredentials().email.toLowerCase());
    expect(body.user.role).not.toBe("client");
    await api.dispose();
  });

  test("OS login with wrong password returns 401", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/os/auth/login", {
      data: { email: getOsCredentials().email, password: "wrong-password-xyz" },
    });
    expect(res.status()).toBe(401);
    await api.dispose();
  });

  test("Portal login with valid client credentials returns user", async () => {
    const api = await createAnonymousApiClient();
    const res = await loginPortalViaApi(api);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.user.role).toBe("client");
    expect(body.user.clientId).toBeTruthy();
    await api.dispose();
  });

  test("OS user cannot use portal login", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/portal/auth/login", {
      data: { email: getOsCredentials().email, password: getOsCredentials().password },
    });
    expect(res.status()).toBe(403);
    await api.dispose();
  });

  test("Portal client cannot use OS login", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.post("/api/os/auth/login", {
      data: { email: getPortalCredentials().email, password: getPortalCredentials().password },
    });
    expect(res.status()).toBe(403);
    await api.dispose();
  });

  test("Protected API without session returns 401", async () => {
    const api = await createAnonymousApiClient();
    const res = await api.get("/api/os/clients");
    expect(res.status()).toBe(401);
    await api.dispose();
  });
});

test.describe("RBAC API @prod-safe", () => {
  test("sales can read payments but cannot record payments", async () => {
    const api = await createAnonymousApiClient();
    await loginSalesViaApi(api);

    const readRes = await api.get("/api/os/payments");
    expect(readRes.status()).toBe(200);

    const writeRes = await api.post("/api/os/payments", {
      data: {
        clientId: "00000000-0000-0000-0000-000000000000",
        amount: "100",
      },
    });
    expect(writeRes.status()).toBe(403);
    await api.dispose();
  });

  test("authenticated OS session can read clients", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/clients");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.clients)).toBe(true);
    await api.dispose();
  });

  test("portal session cannot access credentials vault", async () => {
    const api = await createPortalApiClient();
    const res = await api.get("/api/os/credentials");
    expect(res.status()).toBe(403);
    await api.dispose();
  });
});
