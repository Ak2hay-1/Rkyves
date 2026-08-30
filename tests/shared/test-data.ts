import fs from "node:fs";
import path from "node:path";

export const TEST_PREFIX = "[TEST]";

export type CreatedIdsRegistry = {
  clients: string[];
  tickets: string[];
  documents: string[];
  leadStages: { id: string; originalStage: string }[];
};

const REGISTRY_PATH = path.join(process.cwd(), "test-results", "created-ids.json");

function emptyRegistry(): CreatedIdsRegistry {
  return { clients: [], tickets: [], documents: [], leadStages: [] };
}

export function loadRegistry(): CreatedIdsRegistry {
  if (!fs.existsSync(REGISTRY_PATH)) return emptyRegistry();
  try {
    return { ...emptyRegistry(), ...JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")) };
  } catch {
    return emptyRegistry();
  }
}

function saveRegistry(registry: CreatedIdsRegistry) {
  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

export function registerClient(id: string) {
  const registry = loadRegistry();
  if (!registry.clients.includes(id)) registry.clients.push(id);
  saveRegistry(registry);
}

export function registerTicket(id: string) {
  const registry = loadRegistry();
  if (!registry.tickets.includes(id)) registry.tickets.push(id);
  saveRegistry(registry);
}

export function registerDocument(id: string) {
  const registry = loadRegistry();
  if (!registry.documents.includes(id)) registry.documents.push(id);
  saveRegistry(registry);
}

export function registerLeadStageRevert(id: string, originalStage: string) {
  const registry = loadRegistry();
  if (!registry.leadStages.some((l) => l.id === id)) {
    registry.leadStages.push({ id, originalStage });
  }
  saveRegistry(registry);
}

export function testCompanyName() {
  return `${TEST_PREFIX} Smoke ${Date.now()}`;
}

export function testEmail() {
  return `test+${Date.now()}@rkyves.com`;
}

export function testSubject() {
  return `${TEST_PREFIX} Support ticket ${Date.now()}`;
}

export function testContactPayload() {
  const ts = Date.now();
  return {
    name: `${TEST_PREFIX} Contact ${ts}`,
    email: `contact+${ts}@rkyves.com`,
    phone: "+91 9876543210",
    serviceInterest: "website",
    message: `${TEST_PREFIX} Automated contact form test — please ignore.`,
  };
}

export function isIntegrationEnabled(flag: string) {
  return process.env[flag] === "1" || process.env[flag] === "true";
}
