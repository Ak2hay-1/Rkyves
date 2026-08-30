"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select } from "@/components/os/ui/input";

export function TeamActions({ canManage }: { canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await submit("/api/os/team", "POST", data, () => setOpen(false));
  }

  return (
    <>
      <AddModuleButton label="Invite User" onClick={() => setOpen(true)} />
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Invite Team Member" onSubmit={handleSubmit} submitLabel="Invite">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Name</Label><Input name="name" required /></div>
        <div className="space-y-1"><Label>Email</Label><Input name="email" type="email" required /></div>
        <div className="space-y-1"><Label>Password</Label><Input name="password" type="password" required minLength={8} /></div>
        <div className="space-y-1"><Label>Role</Label>
          <Select name="role" defaultValue="viewer">
            <option value="admin">Admin</option><option value="sales">Sales</option>
            <option value="project_manager">Project Manager</option><option value="developer">Developer</option>
            <option value="support">Support</option><option value="finance">Finance</option><option value="viewer">Viewer</option>
          </Select>
        </div>
        <div className="space-y-1"><Label>Phone</Label><Input name="phone" /></div>
      </EntityFormDialog>
    </>
  );
}

export function TeamMemberActions({
  userId,
  role,
  isActive,
  canManage,
}: {
  userId: string;
  role: string;
  isActive: boolean;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    await submit(`/api/os/team/${userId}`, "PATCH", data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {isActive && <EditButton onClick={() => setOpen(true)} />}
      {isActive && <ConfirmDeleteButton url={`/api/os/team/${userId}`} label="Deactivate" confirmMessage="Deactivate this user?" />}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Edit Team Member" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Role</Label>
          <Select name="role" defaultValue={role}>
            <option value="admin">Admin</option><option value="sales">Sales</option>
            <option value="project_manager">Project Manager</option><option value="developer">Developer</option>
            <option value="support">Support</option><option value="finance">Finance</option><option value="viewer">Viewer</option>
          </Select>
        </div>
      </EntityFormDialog>
    </div>
  );
}
