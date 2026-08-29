import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { getLocalStoragePath } from "@/lib/os/storage";

/** Serve locally stored files (dev fallback) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "documents.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { filename } = await params;
  const safeName = decodeURIComponent(filename).replace(/[^a-zA-Z0-9._-]/g, "_");

  try {
    const filePath = getLocalStoragePath(safeName);
    const buffer = await readFile(filePath);

    const ext = safeName.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeTypes[ext || ""] || "application/octet-stream",
        "Content-Disposition": `inline; filename="${safeName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
