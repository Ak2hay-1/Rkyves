import { test, expect, type Page } from "@playwright/test";

const WWW = "https://www.rkyves.com";

function collectHydrationErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error" && /418|hydrat/i.test(text)) errors.push(text);
  });
  page.on("pageerror", (err) => {
    if (/418|hydrat/i.test(err.message)) errors.push(err.message);
  });
  return errors;
}

test.describe("Marketing site QA @prod-safe", () => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`home hydrates without #418 (reducedMotion: ${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      const errors = collectHydrationErrors(page);
      await page.goto("/", { waitUntil: "load" });
      await page.waitForLoadState("networkidle");
      expect(errors, errors.join("\n")).toHaveLength(0);
    });
  }

  test("canonicals point at www", async ({ page }) => {
    for (const path of ["/", "/services", "/about", "/contact", "/cullinos"]) {
      await page.goto(path);
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(href, path).toMatch(new RegExp(`^${WWW}`));
    }
  });

  test("sitemap and robots use www", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) expect(loc).toMatch(new RegExp(`^${WWW}`));

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`${WWW}/sitemap.xml`);
  });

  test("home H1 has no double period", async ({ page }) => {
    await page.goto("/");
    const h1 = await page.locator("h1").first().innerText();
    expect(h1).not.toContain("..");
  });

  test("home has no Lotus Leaf testimonial and links Cullinos", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Lotus Leaf Cafe")).toHaveCount(0);
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Cullinos, by Rkyves" })).toHaveAttribute(
      "href",
      /cullinos\.com/
    );
  });

  test("/cullinos shows current prices excl. GST and correct contacts", async ({ page }) => {
    await page.goto("/cullinos");
    for (const price of ["₹1,499/mo", "₹2,499/mo", "₹4,999/mo"]) {
      await expect(page.getByText(price)).toBeVisible();
    }
    await expect(page.getByText(/excl\. GST/)).toBeVisible();
    await expect(page.locator('main a[href^="tel:+917666071619"]')).toBeVisible();
    await expect(page.locator('main a[href^="mailto:hello@rkyves.com"]')).toBeVisible();
  });

  test("/contact and footer use current contact details", async ({ page }) => {
    await page.goto("/contact");
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("sales@rkyves.com");
    expect(body).not.toContain("74992");
    await expect(page.locator('a[href^="https://wa.me/917666071619"]').first()).toBeVisible();
    await expect(page.locator('a[href^="tel:+917666071619"]').first()).toBeVisible();
    await expect(page.locator('a[href^="mailto:hello@rkyves.com"]').first()).toBeVisible();
  });

  test("footer links case studies, services and Cullinos", async ({ page }) => {
    await page.goto("/about");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Case Studies" })).toHaveAttribute(
      "href",
      "/#clients"
    );
    await expect(
      footer.getByRole("link", { name: "Professional Websites & Online Stores" })
    ).toHaveAttribute("href", "/services#websites");
    await expect(footer.getByRole("link", { name: "Cullinos, by Rkyves" })).toHaveAttribute(
      "href",
      /cullinos\.com/
    );
  });

  test("footer is not covered by WhatsApp button on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await page.goto("/about");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const terms = await page.locator("footer").getByRole("link", { name: /Terms/ }).boundingBox();
    const fab = await page.getByRole("link", { name: "Chat on WhatsApp" }).boundingBox();
    expect(terms && fab).toBeTruthy();
    const overlaps =
      terms!.x < fab!.x + fab!.width &&
      terms!.x + terms!.width > fab!.x &&
      terms!.y < fab!.y + fab!.height &&
      terms!.y + terms!.height > fab!.y;
    expect(overlaps).toBe(false);
  });

  test("unknown route renders branded 404", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("archives");
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});
