"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Project } from "@/lib/db/schema";

type ProjectFormData = {
  clientId: string;
  clients?: Array<{ id: string; name: string }>;
  project?: Project;
  canManage: boolean;
};

export function ProjectActions({ clientId, clients, project, canManage }: ProjectFormData) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.clientId = data.clientId || clientId;
    data.progress = Number(data.progress || 0);
    const url = project ? `/api/os/projects/${project.id}` : "/api/os/projects";
    const method = project ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!project && <AddModuleButton label="Add Project" onClick={() => setOpen(true)} />}
      {project && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/projects/${project.id}`} />
        </>
      )}
      <EntityFormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={project ? "Edit Project" : "Add Project"}
        onSubmit={handleSubmit}
        submitLabel={project ? "Save" : "Create"}
      >
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!clientId && clients && (
          <div className="space-y-1">
            <Label>Client</Label>
            <Select name="clientId" required defaultValue={project?.clientId}>
              <option value="">Select client</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>
        )}
        {clientId && <input type="hidden" name="clientId" value={clientId} />}
        <div className="space-y-1"><Label>Name</Label><Input name="name" defaultValue={project?.name} required /></div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" defaultValue={project?.description ?? ""} rows={2} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={project?.status ?? "planning"}>
              <option value="planning">Planning</option><option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option><option value="review">Review</option>
              <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </Select>
          </div>
          <div className="space-y-1"><Label>Priority</Label>
            <Select name="priority" defaultValue={project?.priority ?? "medium"}>
              <option value="low">Low</option><option value="medium">Medium</option>
              <option value="high">High</option><option value="urgent">Urgent</option>
            </Select>
          </div>
          <div className="space-y-1"><Label>Start Date</Label><Input name="startDate" type="date" defaultValue={project?.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : ""} /></div>
          <div className="space-y-1"><Label>Deadline</Label><Input name="deadline" type="date" defaultValue={project?.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : ""} /></div>
          <div className="space-y-1"><Label>Progress %</Label><Input name="progress" type="number" min={0} max={100} defaultValue={project?.progress ?? 0} /></div>
        </div>
      </EntityFormDialog>
    </div>
  );
}
