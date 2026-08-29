import { Suspense } from "react";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";

export const metadata = {
  title: "Client Portal — Rkyves",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="text-muted">Loading...</div>}>
        <PortalLoginForm />
      </Suspense>
    </div>
  );
}
