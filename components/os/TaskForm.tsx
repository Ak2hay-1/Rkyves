"use client";

import { useState } from "react";
import { EntityFormDialog, useEntityForm } from "@/components/os/EntityFormDialog";
import { ConfirmDeleteButton } from "@/components/os/ConfirmDeleteButton";
import { EditButton, AddModuleButton } from "@/components/os/ModuleActions";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";
import type { Task } from "@/lib/db/schema";

export function TaskActions({ projectId, task, canManage }: { projectId: string; task?: Task; canManage: boolean }) {
  const [open, setOpen] = useState(false);
  const { error, submit } = useEntityForm();
  if (!canManage) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(form.entries());
    data.projectId = projectId;
    const url = task ? `/api/os/tasks/${task.id}` : "/api/os/tasks";
    const method = task ? "PATCH" : "POST";
    await submit(url, method, data, () => setOpen(false));
  }

  return (
    <div className="flex gap-2">
      {!task && <AddModuleButton label="Add Task" onClick={() => setOpen(true)} />}
      {task && (
        <>
          <EditButton onClick={() => setOpen(true)} />
          <ConfirmDeleteButton url={`/api/os/tasks/${task.id}`} />
        </>
      )}
      <EntityFormDialog open={open} onClose={() => setOpen(false)} title={task ? "Edit Task" : "Add Task"} onSubmit={handleSubmit}>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="space-y-1"><Label>Title</Label><Input name="title" defaultValue={task?.title} required /></div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" defaultValue={task?.description ?? ""} rows={2} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Status</Label>
            <Select name="status" defaultValue={task?.status ?? "todo"}>
              <option value="todo">To Do</option><option value="in_progress">In Progress</option>
              <option value="review">Review</option><option value="completed">Completed</option>
            </Select>
          </div>
          <div className="space-y-1"><Label>Priority</Label>
            <Select name="priority" defaultValue={task?.priority ?? "medium"}>
              <option value="low">Low</option><option value="medium">Medium</option>
              <option value="high">High</option><option value="urgent">Urgent</option>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2"><Label>Due Date</Label>
            <Input name="dueDate" type="date" defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""} />
          </div>
        </div>
      </EntityFormDialog>
    </div>
  );
}
