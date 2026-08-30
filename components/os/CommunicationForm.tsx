"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";

export function CommunicationFormButton({ clientId, canManage }: { clientId?: string; canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    if (clientId) data.clientId = clientId;
    await submit("/api/os/communications", "POST", data, () => setOpen(false));
  }

  return (
    <>
      <AddModuleButton label="Log Communication" onClick={() => setOpen(true)} />
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Log Communication" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {clientId && <input type="hidden" name="clientId" value={clientId} />}
        {!clientId && <div className="space-y-1"><Label>Client ID</Label><Input name="clientId" required /></div>}
        <div className="space-y-1"><Label>Type</Label>
          <Select name="type" defaultValue="note">
            <option value="note">Note</option><option value="call">Call</option>
            <option value="email">Email</option><option value="whatsapp">WhatsApp</option>
          </Select>
        </div>
        <div className="space-y-1"><Label>Subject</Label><Input name="subject" /></div>
        <div className="space-y-1"><Label>Content</Label><Textarea name="content" required rows={4} /></div>
      </EntityFormDialog>
    </>
  );
}
