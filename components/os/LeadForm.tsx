"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";

export function LeadFormButton({ canManage }: { canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await submit("/api/os/leads", "POST", data, () => setOpen(false));
  }

  return (
    <>
      <AddModuleButton label="Add Lead" onClick={() => setOpen(true)} />
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Add Lead" onSubmit={handleSubmit} submitLabel="Create">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Name</Label><Input name="name" required /></div>
        <div className="space-y-1"><Label>Company</Label><Input name="company" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Email</Label><Input name="email" type="email" /></div>
          <div className="space-y-1"><Label>Phone</Label><Input name="phone" /></div>
        </div>
        <div className="space-y-1"><Label>Requirement</Label><Textarea name="requirement" rows={3} /></div>
        <div className="space-y-1"><Label>Expected Value</Label><Input name="expectedValue" /></div>
      </EntityFormDialog>
    </>
  );
}

export function LeadDeleteButton({ leadId, canManage }: { leadId: string; canManage: boolean }) {
  if (!canManage) return null;
  return <ConfirmDeleteButton url={`/api/os/leads/${leadId}`} label="Delete" />;
}
