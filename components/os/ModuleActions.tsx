"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/os/ui/button";

export function AddModuleButton({
  href,
  label,
  onClick,
}: {
  href?: string;
  label: string;
  onClick?: () => void;
}) {
  const content = (
    <Button onClick={onClick}>
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function EditButton({ onClick, label = "Edit" }: { onClick: () => void; label?: string }) {
  return (
    <Button size="sm" variant="secondary" onClick={onClick}>
      {label}
    </Button>
  );
}
