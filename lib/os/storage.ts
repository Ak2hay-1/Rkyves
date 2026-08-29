import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type UploadResult = {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
};

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".storage");

/** Upload a file — uses Vercel Blob in production, local filesystem in dev */
export async function uploadFile(
  file: File | Blob,
  filename: string,
  folder = "documents"
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file instanceof File ? file.type : "application/octet-stream";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  // Vercel Blob (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, pathname: blob.pathname, size: buffer.length, contentType };
  }

  // Local fallback (development)
  const dir = path.join(LOCAL_STORAGE_DIR, folder);
  await mkdir(dir, { recursive: true });
  const localPath = path.join(dir, `${Date.now()}-${safeName}`);
  await writeFile(localPath, buffer);

  const url = `/api/os/files/${encodeURIComponent(path.basename(localPath))}`;
  return { url, pathname: localPath, size: buffer.length, contentType };
}

export function isStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN) || process.env.NODE_ENV === "development";
}

export function getLocalStoragePath(filename: string) {
  return path.join(LOCAL_STORAGE_DIR, "documents", filename);
}
