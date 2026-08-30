import { test, expect } from "@playwright/test";
import { createOsApiClient } from "../shared/api-client";
import { isIntegrationEnabled, registerDocument, TEST_PREFIX } from "../shared/test-data";

test.describe("Document upload @integration", () => {
  test.skip(!isIntegrationEnabled("TEST_DOC_UPLOAD"), "Set TEST_DOC_UPLOAD=1 to run");

  test("uploads a test document to Blob storage", async () => {
    const api = await createOsApiClient();
    const clientsRes = await api.get("/api/os/clients");
    const { clients } = await clientsRes.json();
    const jerzyfy = clients.find((c: { companyName: string }) => c.companyName === "Jerzyfy");
    expect(jerzyfy).toBeTruthy();

    const res = await api.post("/api/os/documents/upload", {
      multipart: {
        file: {
          name: `${TEST_PREFIX}-doc.pdf`,
          mimeType: "application/pdf",
          buffer: Buffer.from(`%PDF-1.4\n${TEST_PREFIX} test document`),
        },
        clientId: jerzyfy.id,
        name: `${TEST_PREFIX} Upload ${Date.now()}`,
        category: "other",
        isClientVisible: "false",
      },
    });
    expect(res.ok()).toBe(true);
    const body = await res.json();
    if (body.document?.id) registerDocument(body.document.id);
    await api.dispose();
  });
});
