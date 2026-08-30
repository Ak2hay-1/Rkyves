import { test } from "@playwright/test";
import { marketingRoutes } from "./routes";
import { assertNoFailures, smokeVisitPage } from "./helpers";

test.describe("Marketing site", () => {
  for (const route of marketingRoutes) {
    test(`${route.name} loads (${route.path})`, async ({ page }) => {
      const failures = await smokeVisitPage(page, route.path, route.name);
      assertNoFailures(failures);
    });
  }

  test("login pages are reachable", async ({ page }) => {
    for (const path of ["/os/login", "/portal/login"]) {
      const failures = await smokeVisitPage(page, path, path);
      assertNoFailures(failures);
    }
  });
});
