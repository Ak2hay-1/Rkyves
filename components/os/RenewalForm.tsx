"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";

type RenewalItem = {
  id: string;
  clientId: string;
  serviceId: string;
  renewalDate: Date;
  amount: string;
  status: string;
  notes?: string | null;
};

export function RenewalActions({
  clientId,
  services,
  renewal,
  canManage,
}: {
  clientId?: string;
  services?: Array<{ id: string; name: string }>;
  renewal?: RenewalItem;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    if (clientId) data.clientId = clientId;
    const url = renewal ? `/api/os/renewals/${renewal.id}` : "/api/os/renewals";
    const method = renewal ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!renewal && <AddModuleButton label="Add Renewal" onClick={() => setOpen(true)} />}
      {renewal && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/renewals/${renewal.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={renewal ? "Edit Renewal" : "Add Renewal"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {clientId && <input type="hidden" name="clientId" value={clientId} />}
        {!renewal && services && (
          <div className="space-y-1"><Label>Service</Label>
            <Select name="serviceId" required>
              <option value="">Select service</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
        )}
        <div className="space-y-1"><Label>Renewal Date</Label>
          <Input name="renewalDate" type="date" required defaultValue={renewal?.renewalDate ? new Date(renewal.renewalDate).toISOString().slice(0, 10) : ""} />
        </div>
        <div className="space-y-1"><Label>Amount</Label><Input name="amount" required defaultValue={renewal?.amount} /></div>
        {renewal && (
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={renewal.status}>
              <option value="upcoming">Upcoming</option><option value="due_soon">Due Soon</option>
              <option value="overdue">Overdue</option><option value="renewed">Renewed</option>
              <option value="expired">Expired</option>
            </Select>
          </div>
        )}
        <div className="space-y-1"><Label>Notes</Label><Textarea name="notes" defaultValue={renewal?.notes ?? ""} rows={2} /></div>
      </EntityFormDialog>
    </div>
  );
}
