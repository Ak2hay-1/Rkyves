import { test } from "@playwright/test";
import { osRoutes } from "./routes";
import { assertNoFailures, smokeVisitPage } from "./helpers";

test.describe("Rkyves OS", () => {
  for (const route of osRoutes) {
    test(`${route.name} loads (${route.path})`, async ({ page }) => {
      const failures = await smokeVisitPage(page, route.path, route.name);
      assertNoFailures(failures);
    });
  }
});
