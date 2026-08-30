import { test } from "@playwright/test";
import { portalRoutes } from "./routes";
import { assertNoFailures, smokeVisitPage } from "./helpers";

test.describe("Client Portal", () => {
  for (const route of portalRoutes) {
    test(`${route.name} loads (${route.path})`, async ({ page }) => {
      const failures = await smokeVisitPage(page, route.path, route.name);
      assertNoFailures(failures);
    });
  }
});
