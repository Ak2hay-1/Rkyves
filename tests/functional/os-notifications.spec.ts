import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";

test.describe("Notifications @prod-write", () => {
  test("marks notifications read via API", async () => {
    const api = await createOsApiClient();
    const getRes = await api.get("/api/os/notifications");
    expect(getRes.ok()).toBe(true);
    const body = await getRes.json();

    const unread = (body.notifications as { id: string; isRead: boolean | null }[]).find(
      (n) => !n.isRead
    );

    if (unread) {
      const patchOne = await api.patch("/api/os/notifications", { data: { id: unread.id } });
      expect(patchOne.ok()).toBe(true);
    }

    const markAll = await api.patch("/api/os/notifications", {
      data: { markAllRead: true },
    });
    expect(markAll.ok()).toBe(true);

    const after = await api.get("/api/os/notifications");
    const afterBody = await after.json();
    expect(afterBody.unreadCount).toBe(0);
    await api.dispose();
  });
});
