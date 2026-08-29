import { Suspense } from "react";
import { OsLoginForm } from "@/components/os/OsLoginForm";

export const metadata = {
  title: "Sign in — Rkyves OS",
  robots: { index: false, follow: false },
};

export default function OsLoginPage() {
  return (
    <Suspense fallback={<div className="text-muted">Loading...</div>}>
      <OsLoginForm />
    </Suspense>
  );
}
