import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Rkyves OS",
  robots: { index: false, follow: false },
};

export default function OsAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
