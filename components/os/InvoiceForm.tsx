"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Invoice } from "@/lib/db/schema";

export function InvoiceActions({
  clientId,
  invoice,
  canManage,
}: {
  clientId?: string;
  invoice?: Invoice;
  canManage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    if (clientId) data.clientId = clientId;
    if (!invoice) {
      data.items = [{ description: data.itemDescription, quantity: 1, unitPrice: data.unitPrice }];
      delete data.itemDescription;
    }
    const url = invoice ? `/api/os/invoices/${invoice.id}` : "/api/os/invoices";
    const method = invoice ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!invoice && <AddModuleButton label="Create Invoice" onClick={() => setOpen(true)} />}
      {invoice && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          {invoice.status !== "paid" && <ConfirmDeleteButton url={`/api/os/invoices/${invoice.id}`} />}
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={invoice ? "Edit Invoice" : "Create Invoice"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!invoice && (
          <>
            {!clientId && <div className="space-y-1"><Label>Client ID</Label><Input name="clientId" required /></div>}
            {clientId && <input type="hidden" name="clientId" value={clientId} />}
            <div className="space-y-1"><Label>Item Description</Label><Input name="itemDescription" required /></div>
            <div className="space-y-1"><Label>Unit Price</Label><Input name="unitPrice" required /></div>
          </>
        )}
        {invoice && (
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={invoice.status}>
              <option value="draft">Draft</option><option value="sent">Sent</option>
              <option value="partially_paid">Partially Paid</option><option value="paid">Paid</option>
              <option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
            </Select>
          </div>
        )}
        <div className="space-y-1"><Label>Due Date</Label>
          <Input name="dueDate" type="date" defaultValue={invoice?.dueDate ? new Date(invoice.dueDate).toISOString().slice(0, 10) : ""} />
        </div>
        <div className="space-y-1"><Label>Notes</Label><Textarea name="notes" defaultValue={invoice?.notes ?? ""} rows={2} /></div>
      </EntityFormDialog>
    </div>
  );
}
