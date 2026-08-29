import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { uploadFile } from "@/lib/os/storage";
import { logAudit } from "@/lib/os/api-utils";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "documents.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const clientId = formData.get("clientId") as string;
    const name = (formData.get("name") as string) || file?.name || "Document";
    const category = (formData.get("category") as string) || "other";
    const isClientVisible = formData.get("isClientVisible") === "true";

    if (!file || !clientId) {
      return NextResponse.json({ error: "File and clientId required" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    const uploaded = await uploadFile(file, file.name, `clients/${clientId}`);

    const db = getDb();
    const [doc] = await db
      .insert(schema.documents)
      .values({
        clientId,
        name,
        category: category as typeof schema.documents.category.enumValues[number],
        fileUrl: uploaded.url,
        fileSize: uploaded.size,
        mimeType: uploaded.contentType,
        uploadedById: user.id,
        isClientVisible,
      })
      .returning();

    await db.insert(schema.activities).values({
      clientId,
      type: "system",
      title: `Document uploaded: ${name}`,
      userId: user.id,
      metadata: { documentId: doc.id },
    });

    await logAudit(user.id, "upload", "document", doc.id, { name, clientId }, req);

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
