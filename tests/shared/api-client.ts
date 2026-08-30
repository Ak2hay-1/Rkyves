import path from "node:path";
import { request, type APIRequestContext } from "@playwright/test";
import { getOsCredentials, getPortalCredentials, getSalesCredentials } from "./auth";

const baseURL = process.env.BASE_URL?.replace(/\/$/, "") || "https://rkyves.com";

export async function createOsApiClient(): Promise<APIRequestContext> {
  return request.newContext({
    baseURL,
    storageState: path.join(__dirname, "../smoke/.auth/os.json"),
  });
}

export async function createPortalApiClient(): Promise<APIRequestContext> {
  return request.newContext({
    baseURL,
    storageState: path.join(__dirname, "../smoke/.auth/portal.json"),
  });
}

export async function createAnonymousApiClient(): Promise<APIRequestContext> {
  return request.newContext({ baseURL });
}

export async function loginOsViaApi(api: APIRequestContext) {
  const { email, password } = getOsCredentials();
  return api.post("/api/os/auth/login", { data: { email, password } });
}

export async function loginPortalViaApi(api: APIRequestContext) {
  const { email, password } = getPortalCredentials();
  return api.post("/api/portal/auth/login", { data: { email, password } });
}

export async function loginSalesViaApi(api: APIRequestContext) {
  const { email, password } = getSalesCredentials();
  return api.post("/api/os/auth/login", { data: { email, password } });
}
