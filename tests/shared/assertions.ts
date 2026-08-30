import { expect, type Page, type Response } from "@playwright/test";

export type SmokeFailure = {
  route: string;
  name: string;
  kind: "http" | "console" | "page";
  detail: string;
};

export async function smokeVisitPage(
  page: Page,
  path: string,
  name: string
): Promise<SmokeFailure[]> {
  const failures: SmokeFailure[] = [];
  const consoleErrors: string[] = [];
  const badResponses: string[] = [];

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("404")) {
        consoleErrors.push(text);
      }
    }
  };

  const onResponse = (response: Response) => {
    const url = response.url();
    const status = response.status();
    if (status >= 500 && !url.includes("analytics") && !url.includes("vercel")) {
      badResponses.push(`${status} ${url}`);
    }
  };

  page.on("console", onConsole);
  page.on("response", onResponse);

  try {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    const status = response?.status() ?? 0;

    if (status >= 500) {
      failures.push({
        route: path,
        name,
        kind: "http",
        detail: `Document returned HTTP ${status}`,
      });
    } else if (status >= 400 && status !== 404) {
      failures.push({
        route: path,
        name,
        kind: "http",
        detail: `Document returned HTTP ${status}`,
      });
    }

    await expect(page.locator("body")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    const errorPatterns = [
      "Application error",
      "Internal Server Error",
      "Something went wrong",
      "Unhandled Runtime Error",
    ];
    for (const pattern of errorPatterns) {
      if (bodyText.includes(pattern)) {
        failures.push({
          route: path,
          name,
          kind: "page",
          detail: `Page contains error text: "${pattern}"`,
        });
        break;
      }
    }

    for (const detail of badResponses) {
      failures.push({ route: path, name, kind: "http", detail });
    }

    for (const detail of consoleErrors.slice(0, 3)) {
      failures.push({ route: path, name, kind: "console", detail });
    }
  } finally {
    page.off("console", onConsole);
    page.off("response", onResponse);
  }

  return failures;
}

export function assertNoFailures(failures: SmokeFailure[]) {
  if (failures.length === 0) return;
  const summary = failures
    .map((f) => `[${f.kind}] ${f.name} (${f.route}): ${f.detail}`)
    .join("\n");
  expect(failures, summary).toHaveLength(0);
}
