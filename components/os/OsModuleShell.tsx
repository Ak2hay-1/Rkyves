import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/os/ui/stats";
import { SetupRequired } from "@/components/os/SetupRequired";

export function OsModuleShell({
  title,
  description,
  dbConfigured,
  isEmpty,
  emptyTitle,
  children,
  actions,
}: {
  title: string;
  description: string;
  dbConfigured: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  if (!dbConfigured) return <SetupRequired />;

  return (
    <div>
      <PageHeader title={title} description={description} actions={actions} />
      {isEmpty ? <EmptyState title={emptyTitle} description="No records yet. Add your first entry to get started." /> : children}
    </div>
  );
}

export function OsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface-elevated">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-white/[0.02]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Link };
