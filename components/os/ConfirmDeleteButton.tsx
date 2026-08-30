"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/os/ui/button";

export function ConfirmDeleteButton({
  url,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this?",
  onSuccess,
  variant = "destructive",
  size = "sm",
}: {
  url: string;
  label?: string;
  confirmMessage?: string;
  onSuccess?: () => void;
  variant?: "destructive" | "ghost" | "secondary";
  size?: "sm" | "default";
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Delete failed");
        return;
      }
      setConfirming(false);
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted">{confirmMessage}</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button size={size} variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
          </Button>
          <Button size={size} variant="ghost" onClick={() => setConfirming(false)} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button size={size} variant={variant} onClick={() => setConfirming(true)}>
      <Trash2 className="h-3 w-3" />
      {label}
    </Button>
  );
}
