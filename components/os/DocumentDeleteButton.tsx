"use client";

import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";

export function DocumentDeleteButton({ documentId, canManage }: { documentId: string; canManage: boolean }) {
  if (!canManage) return null;
  return <ConfirmDeleteButton url={`/api/os/documents/${documentId}`} label="Delete" size="sm" variant="ghost" />;
}
