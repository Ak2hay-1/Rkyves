"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Service } from "@/lib/db/schema";

export function ServiceActions({
  clientId,
  service,
  canManage,
}: {
  clientId: string;
  service?: Service;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = clientId;
    const url = service ? `/api/os/services/${service.id}` : "/api/os/services";
    const method = service ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!service && <AddModuleButton label="Add Service" onClick={() => setOpen(true)} />}
      {service && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/services/${service.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={service ? "Edit Service" : "Add Service"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Name</Label><Input name="name" defaultValue={service?.name} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Type</Label>
            <Select name="type" defaultValue={service?.type ?? "website"}>
              {["website", "pos", "erp", "cullinos", "hosting", "domain", "seo", "maintenance", "support", "other"].map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1"><Label>Plan</Label><Input name="plan" defaultValue={service?.plan ?? ""} /></div>
          <div className="space-y-1"><Label>Price</Label><Input name="price" defaultValue={service?.price ?? "0"} /></div>
          <div className="space-y-1"><Label>Billing Cycle</Label>
            <Select name="billingCycle" defaultValue={service?.billingCycle ?? "yearly"}>
              <option value="one_time">One Time</option><option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option><option value="yearly">Yearly</option>
            </Select>
          </div>
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={service?.status ?? "active"}>
              <option value="active">Active</option><option value="pending">Pending</option>
              <option value="expired">Expired</option><option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="space-y-1"><Label>Expiry Date</Label>
            <Input name="expiryDate" type="date" defaultValue={service?.expiryDate ? new Date(service.expiryDate).toISOString().slice(0, 10) : ""} />
          </div>
        </div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" defaultValue={service?.description ?? ""} rows={2} /></div>
      </EntityFormDialog>
    </div>
  );
}
