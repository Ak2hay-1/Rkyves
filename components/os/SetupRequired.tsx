import Link from "next/link";
import { Database, Terminal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/os/ui/card";
import { Button } from "@/components/os/ui/button";

export function SetupRequired() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Database Setup Required</h1>
        <p className="mt-2 text-muted">
          Rkyves OS needs a PostgreSQL database to run. Follow these steps to get started.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>Configure your environment and seed sample data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">1. Add to <code className="rounded bg-white/5 px-1.5 py-0.5">.env.local</code>:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs">
{`DATABASE_URL=postgresql://user:pass@host/db
ENCRYPTION_KEY=your-32-char-minimum-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000`}
            </pre>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">2. Push schema & seed data:</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs">
{`npm run db:push
npm run db:seed`}
            </pre>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            <Terminal className="h-4 w-4 text-primary" />
            <span>
              Default login: <strong>admin@rkyves.com</strong> / <strong>admin123</strong>
            </span>
          </div>

          <Link href="/os/login">
            <Button>Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
