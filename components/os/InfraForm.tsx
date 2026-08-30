"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select } from "@/components/os/ui/input";

type InfraItem = { id: string; name?: string; domain?: string | null; version?: string | null };

export function WebsiteActions({ clientId, website, canManage }: { clientId: string; website?: InfraItem; canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = clientId;
    const url = website ? `/api/os/websites/${website.id}` : "/api/os/websites";
    await submit(url, website ? "PATCH" : "POST", data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!website && <AddModuleButton label="Add Website" onClick={() => setOpen(true)} />}
      {website && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/websites/${website.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={website ? "Edit Website" : "Add Website"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Name</Label><Input name="name" defaultValue={website?.name} required /></div>
        <div className="space-y-1"><Label>Domain</Label><Input name="domain" defaultValue={website?.domain ?? ""} /></div>
        <div className="space-y-1"><Label>Hosting</Label><Input name="hosting" /></div>
        <div className="space-y-1"><Label>Status</Label>
          <Select name="status" defaultValue="online"><option value="online">Online</option><option value="offline">Offline</option><option value="warning">Warning</option></Select>
        </div>
      </EntityFormDialog>
    </div>
  );
}

export function PosActions({ clientId, deployment, canManage }: { clientId: string; deployment?: InfraItem; canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = clientId;
    if (data.terminals) data.terminals = Number(data.terminals);
    const url = deployment ? `/api/os/pos/${deployment.id}` : "/api/os/pos";
    await submit(url, deployment ? "PATCH" : "POST", data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!deployment && <AddModuleButton label="Add POS" onClick={() => setOpen(true)} />}
      {deployment && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/pos/${deployment.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={deployment ? "Edit POS" : "Add POS"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Version</Label><Input name="version" defaultValue={deployment?.version ?? ""} /></div>
        <div className="space-y-1"><Label>Terminals</Label><Input name="terminals" type="number" defaultValue={1} /></div>
        <div className="space-y-1"><Label>Server</Label><Input name="server" /></div>
      </EntityFormDialog>
    </div>
  );
}

export function ErpActions({ clientId, deployment, canManage }: { clientId: string; deployment?: InfraItem; canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = clientId;
    if (data.users) data.users = Number(data.users);
    const url = deployment ? `/api/os/erp/${deployment.id}` : "/api/os/erp";
    await submit(url, deployment ? "PATCH" : "POST", data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!deployment && <AddModuleButton label="Add ERP" onClick={() => setOpen(true)} />}
      {deployment && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/erp/${deployment.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={deployment ? "Edit ERP" : "Add ERP"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Version</Label><Input name="version" defaultValue={deployment?.version ?? ""} /></div>
        <div className="space-y-1"><Label>Users</Label><Input name="users" type="number" defaultValue={1} /></div>
        <div className="space-y-1"><Label>Deployment</Label><Input name="deployment" /></div>
      </EntityFormDialog>
    </div>
  );
}
