import { existsSync, readFileSync } from "node:fs";

type ReportFile = {
  suites?: {
    title: string;
    specs?: { title: string; ok: boolean; tests?: { results?: { status: string }[] }[] }[];
  }[];
  stats?: { expected: number; unexpected: number; skipped: number; duration: number };
};

function loadReport(path: string): ReportFile | null {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as ReportFile;
  } catch {
    return null;
  }
}

function flattenSpecs(report: ReportFile) {
  const rows: { suite: string; title: string; status: string }[] = [];
  for (const suite of report.suites ?? []) {
    for (const spec of suite.specs ?? []) {
      const status = spec.ok
        ? "passed"
        : spec.tests?.[0]?.results?.[0]?.status ?? "failed";
      rows.push({ suite: suite.title, title: spec.title, status });
    }
  }
  return rows;
}

function printReport(label: string, path: string) {
  const report = loadReport(path);
  if (!report) {
    console.log(`\n${label}: (no report at ${path})`);
    return;
  }

  console.log(`\n${label}`);
  console.log("─".repeat(60));
  if (report.stats) {
    console.log(
      `Total: ${report.stats.expected + report.stats.unexpected} | Passed: ${report.stats.expected} | Failed: ${report.stats.unexpected} | Skipped: ${report.stats.skipped} | ${Math.round(report.stats.duration / 1000)}s`
    );
  }

  const failures = flattenSpecs(report).filter((r) => r.status !== "passed" && r.status !== "skipped");
  if (failures.length === 0) {
    console.log("All tests passed.");
    return;
  }

  console.log("\nFailures:");
  for (const row of failures) {
    console.log(`  [${row.status}] ${row.suite} › ${row.title}`);
  }
}

console.log("Rkyves Production Test Summary");
console.log("=".repeat(60));
printReport("Smoke / combined report", "test-results/smoke-report.json");
printReport("Functional report", "test-results/functional-report.json");
