"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/os/ui/button";
import { Input, Label, Select, Textarea } from "@/components/os/ui/input";

export function PortalTicketForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/portal/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          subject: form.get("subject"),
          description: form.get("description"),
          priority: form.get("priority") || "medium",
          category: form.get("category") || "general",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create ticket");
        return;
      }
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-xl border border-border bg-surface-elevated/80 p-5">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" name="priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue="general">
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="website">Website</option>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Ticket"}</Button>
    </form>
  );
}
