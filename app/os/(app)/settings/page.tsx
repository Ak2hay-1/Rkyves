import { isEmailConfigured } from "@/lib/os/notifications/email";
import { isWhatsAppConfigured } from "@/lib/os/notifications/whatsapp";
import { isStorageConfigured } from "@/lib/os/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/os/ui/card";
import { Badge } from "@/components/os/ui/badge";
import { Button } from "@/components/os/ui/button";

function StatusBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? "success" : "warning"}>{active ? "Connected" : "Not configured"}</Badge>;
}

export default function SettingsPage() {
  const emailOk = isEmailConfigured();
  const whatsappOk = isWhatsAppConfigured();
  const storageOk = isStorageConfigured();
  const dbOk = Boolean(process.env.DATABASE_URL);
  const cronOk = Boolean(process.env.CRON_SECRET);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Settings</h1>
      <p className="mb-8 text-sm text-muted">Configure Rkyves OS preferences and integrations</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Email (Resend)</CardTitle>
              <CardDescription>Invoice, payment, and renewal emails</CardDescription>
            </div>
            <StatusBadge active={emailOk} />
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <p>Set <code className="rounded bg-white/5 px-1">RESEND_API_KEY</code> and <code className="rounded bg-white/5 px-1">RESEND_FROM_EMAIL</code> in environment variables.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>Client notifications via WhatsApp</CardDescription>
            </div>
            <StatusBadge active={whatsappOk} />
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <p>Option A: <code className="rounded bg-white/5 px-1">WHATSAPP_WEBHOOK_URL</code> (Make/Zapier)</p>
            <p className="mt-1">Option B: <code className="rounded bg-white/5 px-1">WHATSAPP_API_URL</code> + <code className="rounded bg-white/5 px-1">WHATSAPP_ACCESS_TOKEN</code></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>File Storage</CardTitle>
              <CardDescription>Document uploads</CardDescription>
            </div>
            <StatusBadge active={storageOk} />
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <p>Production: <code className="rounded bg-white/5 px-1">BLOB_READ_WRITE_TOKEN</code> (Vercel Blob)</p>
            <p className="mt-1">Development: local <code className="rounded bg-white/5 px-1">.storage/</code> fallback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Database</CardTitle>
              <CardDescription>PostgreSQL via Neon</CardDescription>
            </div>
            <StatusBadge active={dbOk} />
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <p>Set <code className="rounded bg-white/5 px-1">DATABASE_URL</code> to your Neon connection string.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation Cron</CardTitle>
            <CardDescription>Daily overdue invoices & renewal reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Schedule</span>
              <span>Daily at 6:00 AM UTC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">CRON_SECRET</span>
              <StatusBadge active={cronOk} />
            </div>
            <form action="/api/os/cron" method="POST" className="pt-2">
              <Button type="submit" variant="secondary" size="sm">Run Now (manual)</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Encryption and access control</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>• Credentials: AES-256-GCM encryption</p>
            <p>• RBAC with 9 role levels</p>
            <p>• Separate portal auth for clients</p>
            <p>• Audit logging on sensitive actions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
