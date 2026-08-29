/**
 * Cullinos API client for Rkyves OS provisioning and entitlement sync.
 */

const API_URL = process.env.CULLINOS_API_URL || "http://localhost:3000/api";
const INTERNAL_KEY = process.env.CULLINOS_PROVISION_KEY || "change-me-internal-provision-key";

export type ProvisionInput = {
  rkyvesClientId: string;
  companyName: string;
  planSlug: string;
  adminEmail: string;
  adminPassword: string;
  outletName: string;
  adminName?: string;
};

export type ProvisionResult = {
  organizationId: string;
  outletId: string;
  adminUserId: string;
  subscriptionId: string;
  slug: string;
  adminUrl: string;
};

export async function provisionCullinosTenant(input: ProvisionInput): Promise<ProvisionResult> {
  const res = await fetch(`${API_URL}/internal/provision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cullinos provision failed: ${text}`);
  }

  return res.json() as Promise<ProvisionResult>;
}

export async function updateCullinosEntitlements(
  orgId: string,
  body: { status?: string; planSlug?: string; graceUntil?: string }
) {
  const res = await fetch(`${API_URL}/internal/subscriptions/${orgId}/entitlements`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Cullinos entitlement update failed: ${await res.text()}`);
  }

  return res.json();
}

export async function getCullinosHealth(orgId: string) {
  const res = await fetch(`${API_URL}/internal/organizations/${orgId}/health`, {
    headers: { "x-internal-key": INTERNAL_KEY },
  });
  if (!res.ok) return null;
  return res.json();
}
