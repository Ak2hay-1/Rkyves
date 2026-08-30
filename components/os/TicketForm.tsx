"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Ticket } from "@/lib/db/schema";

export function TicketActions({
  clientId,
  ticket,
  canManage,
}: {
  clientId?: string;
  ticket?: Ticket;
  canManage: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    if (clientId) data.clientId = clientId;
    const url = ticket ? `/api/os/tickets/${ticket.id}` : "/api/os/tickets";
    const method = ticket ? "PATCH" : "POST";
    const result = await submit(url, method, data, () => setOpen(false));
    if (!ticket && result?.ticket) router.push(`/os/tickets/${result.ticket.id}`);
  }

  return (
    <div className="flex gap-2">
      {!ticket && <AddModuleButton label="Create Ticket" onClick={() => setOpen(true)} />}
      {ticket && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/tickets/${ticket.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={ticket ? "Edit Ticket" : "Create Ticket"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {clientId && <input type="hidden" name="clientId" value={clientId} />}
        {!clientId && !ticket && <div className="space-y-1"><Label>Client ID</Label><Input name="clientId" required /></div>}
        {!ticket && (
          <>
            <div className="space-y-1"><Label>Subject</Label><Input name="subject" required /></div>
            <div className="space-y-1"><Label>Description</Label><Textarea name="description" required rows={3} /></div>
          </>
        )}
        {ticket && (
          <>
            <div className="space-y-1"><Label>Status</Label>
              <Select name="status" defaultValue={ticket.status}>
                <option value="new">New</option><option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option><option value="waiting_client">Waiting Client</option>
                <option value="resolved">Resolved</option><option value="closed">Closed</option>
              </Select>
            </div>
            <div className="space-y-1"><Label>Priority</Label>
              <Select name="priority" defaultValue={ticket.priority}>
                <option value="low">Low</option><option value="medium">Medium</option>
                <option value="high">High</option><option value="urgent">Urgent</option>
              </Select>
            </div>
            <div className="space-y-1"><Label>Resolution</Label><Textarea name="resolution" defaultValue={ticket.resolution ?? ""} rows={2} /></div>
          </>
        )}
        {!ticket && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Priority</Label>
              <Select name="priority" defaultValue="medium">
                <option value="low">Low</option><option value="medium">Medium</option>
                <option value="high">High</option><option value="urgent">Urgent</option>
              </Select>
            </div>
            <div className="space-y-1"><Label>Category</Label>
              <Select name="category" defaultValue="general">
                <option value="general">General</option><option value="technical">Technical</option>
                <option value="billing">Billing</option><option value="hosting">Hosting</option>
              </Select>
            </div>
          </div>
        )}
      </EntityFormDialog>
    </div>
  );
}
