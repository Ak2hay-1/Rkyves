"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/os/ui/button";
import { Input, Label, Select } from "@/components/os/ui/input";

export function DocumentUploadForm({ clients }: { clients: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    const file = form.get("file") as File;
    if (!file || file.size === 0) {
      setError("Please select a file");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/os/documents/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setSuccess(`Uploaded: ${data.document.name}`);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-border bg-surface-elevated/80 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-medium">
        <Upload className="h-4 w-4 text-primary" />
        Upload Document
      </h3>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {success && <p className="mb-3 text-sm text-emerald-400">{success}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <Select id="clientId" name="clientId" required>
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Document Name</Label>
          <Input id="name" name="name" placeholder="Contract.pdf" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue="other">
            <option value="contract">Contract</option>
            <option value="proposal">Proposal</option>
            <option value="invoice">Invoice</option>
            <option value="gst">GST</option>
            <option value="requirement">Requirement</option>
            <option value="design">Design</option>
            <option value="project">Project</option>
            <option value="agreement">Agreement</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input id="file" name="file" type="file" required accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="isClientVisible" value="true" />
          Visible to client in portal
        </label>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </Button>
      </div>
    </form>
  );
}
