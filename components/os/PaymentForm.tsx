"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Payment } from "@/lib/db/schema";

export function PaymentActions({
  clientId,
  payment,
  canManage,
}: {
  clientId?: string;
  payment?: Payment;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    if (clientId) data.clientId = clientId;
    const url = payment ? `/api/os/payments/${payment.id}` : "/api/os/payments";
    const method = payment ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!payment && <AddModuleButton label="Record Payment" onClick={() => setOpen(true)} />}
      {payment && <ConfirmDeleteButton url={`/api/os/payments/${payment.id}`} />}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title="Record Payment" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {clientId && <input type="hidden" name="clientId" value={clientId} />}
        {!clientId && <div className="space-y-1"><Label>Client ID</Label><Input name="clientId" required /></div>}
        <div className="space-y-1"><Label>Amount</Label><Input name="amount" required defaultValue={payment?.amount} /></div>
        <div className="space-y-1"><Label>Method</Label>
          <Select name="method" defaultValue={payment?.method ?? "bank_transfer"}>
            <option value="bank_transfer">Bank Transfer</option><option value="upi">UPI</option>
            <option value="card">Card</option><option value="cash">Cash</option><option value="razorpay">Razorpay</option>
          </Select>
        </div>
        <div className="space-y-1"><Label>Reference</Label><Input name="reference" defaultValue={payment?.reference ?? ""} /></div>
        <div className="space-y-1"><Label>Notes</Label><Textarea name="notes" defaultValue={payment?.notes ?? ""} rows={2} /></div>
      </EntityFormDialog>
    </div>
  );
}
