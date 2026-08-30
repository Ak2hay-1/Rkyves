import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";

test.describe("OS Projects API", () => {
  test("POST /api/os/projects creates a project", async () => {
    const api = await createOsApiClient();
    const clientsRes = await api.get("/api/os/clients");
    const { clients } = await clientsRes.json();
    test.skip(!clients?.length, "No clients in DB");

    const res = await api.post("/api/os/projects", {
      data: {
        clientId: clients[0].id,
        name: `Test Project ${Date.now()}`,
        status: "planning",
        priority: "medium",
      },
    });
    expect(res.ok()).toBeTruthy();
    const { project } = await res.json();
    expect(project.name).toContain("Test Project");
    await api.dispose();
  });
});

test.describe("OS Settings API", () => {
  test("PATCH /api/os/settings/profile updates name", async () => {
    const api = await createOsApiClient();
    const getRes = await api.get("/api/os/settings/profile");
    const { profile } = await getRes.json();
    const res = await api.patch("/api/os/settings/profile", {
      data: { name: profile.name },
    });
    expect(res.ok()).toBeTruthy();
    await api.dispose();
  });

  test("GET /api/os/settings/org returns settings", async () => {
    const api = await createOsApiClient();
    const res = await api.get("/api/os/settings/org");
    expect(res.ok()).toBeTruthy();
    const { settings } = await res.json();
    expect(settings.companyName).toBeTruthy();
    await api.dispose();
  });
});

test.describe("OS Clients API", () => {
  test("PATCH /api/os/clients/[id] updates client", async () => {
    const api = await createOsApiClient();
    const clientsRes = await api.get("/api/os/clients");
    const { clients } = await clientsRes.json();
    test.skip(!clients?.length, "No clients in DB");

    const res = await api.patch(`/api/os/clients/${clients[0].id}`, {
      data: { notes: "Updated via test" },
    });
    expect(res.ok()).toBeTruthy();
    await api.dispose();
  });
});
