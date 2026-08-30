import Link from "next/link";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";
import { DocumentUploadForm } from "@/components/os/DocumentUploadForm";
import { DocumentDeleteButton } from "@/components/os/DocumentDeleteButton";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Documents — Rkyves OS" };

export default async function DocumentsPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const items = await db
    .select({ doc: schema.documents, companyName: schema.clients.companyName })
    .from(schema.documents)
    .leftJoin(schema.clients, eq(schema.documents.clientId, schema.clients.id))
    .orderBy(schema.documents.createdAt);

  const clients = await db.select({ id: schema.clients.id, name: schema.clients.companyName }).from(schema.clients);
  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "documents.manage") : false;

  return (
    <OsModuleShell title="Documents" description="Upload and manage client documents" dbConfigured isEmpty={false} emptyTitle="">
      <DocumentUploadForm clients={clients} />
      {items.length === 0 ? (
        <p className="text-muted">No documents yet. Upload your first document above.</p>
      ) : (
        <OsTable
          headers={["Document", "Client", "Category", "Size", "Uploaded", "Actions"]}
          rows={items.map(({ doc, companyName }) => [
            <span key="n" className="font-medium">{doc.name}</span>,
            <Link key="c" href={`/os/clients/${doc.clientId}?tab=documents`} className="hover:text-primary">{companyName}</Link>,
            <span key="cat" className="capitalize">{doc.category}</span>,
            doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : "—",
            formatDate(doc.createdAt),
            doc.fileUrl ? (
              <Link key="dl" href={doc.fileUrl} target="_blank" className="text-sm text-primary hover:underline">
                Download
              </Link>
            ) : "—",
            <DocumentDeleteButton key="del" documentId={doc.id} canManage={canManage} />,
          ])}
        />
      )}
    </OsModuleShell>
  );
}
