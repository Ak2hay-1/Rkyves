"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Textarea } from "@/components/os/ui/input";

type CredentialItem = {
  id: string;
  name: string;
  category: string;
  username: string | null;
  url: string | null;
  notes?: string | null;
};

export function CredentialsActions({
  clientId,
  credential,
  canManage,
}: {
  clientId: string;
  credential?: CredentialItem;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = clientId;
    const url = credential ? `/api/os/credentials/${credential.id}` : "/api/os/credentials";
    const method = credential ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!credential && <AddModuleButton label="Add Credential" onClick={() => setOpen(true)} />}
      {credential && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/credentials/${credential.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={credential ? "Edit Credential" : "Add Credential"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Name</Label><Input name="name" defaultValue={credential?.name} required /></div>
        <div className="space-y-1"><Label>Category</Label><Input name="category" defaultValue={credential?.category ?? "hosting"} required /></div>
        <div className="space-y-1"><Label>Username</Label><Input name="username" defaultValue={credential?.username ?? ""} /></div>
        <div className="space-y-1"><Label>{credential ? "New Password (leave blank to keep)" : "Password"}</Label><Input name="password" type="password" /></div>
        <div className="space-y-1"><Label>URL</Label><Input name="url" defaultValue={credential?.url ?? ""} /></div>
        <div className="space-y-1"><Label>Notes</Label><Textarea name="notes" defaultValue={credential?.notes ?? ""} rows={2} /></div>
      </EntityFormDialog>
    </div>
  );
}
