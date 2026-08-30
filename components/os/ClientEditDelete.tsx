"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Client } from "@/lib/db/schema";

export function ClientEditDelete({ client, canEdit, canDelete }: { client: Client; canEdit: boolean; canDelete: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();

  if (!canEdit && !canDelete) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await submit(`/api/os/clients/${client.id}`, "PATCH", data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {canEdit && <EditButton onClick={() => setOpen(true)} />}
      {canDelete && (
        <ConfirmDeleteButton
          url={`/api/os/clients/${client.id}`}
          confirmMessage={`Delete ${client.companyName}? This removes all related data.`}
          onSuccess={() => router.push("/os/clients")}
        />
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Edit Client" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2"><Label>Company Name</Label><Input name="companyName" defaultValue={client.companyName} required /></div>
          <div className="space-y-1"><Label>Contact Person</Label><Input name="contactPerson" defaultValue={client.contactPerson} required /></div>
          <div className="space-y-1"><Label>Email</Label><Input name="email" type="email" defaultValue={client.email} required /></div>
          <div className="space-y-1"><Label>Phone</Label><Input name="phone" defaultValue={client.phone ?? ""} /></div>
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={client.status}>
              <option value="active">Active</option><option value="inactive">Inactive</option>
              <option value="at_risk">At Risk</option><option value="churned">Churned</option><option value="lead">Lead</option>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2"><Label>Notes</Label><Textarea name="notes" defaultValue={client.notes ?? ""} rows={2} /></div>
        </div>
      </EntityFormDialog>
    </div>
  );
}
