"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/os/ui/card";
import { Badge } from "@/components/os/ui/badge";
import { Button } from "@/components/os/ui/button";
import { Input, Label } from "@/components/os/ui/input";

type Tab = "profile" | "organization" | "integrations" | "automation";

function StatusBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? "success" : "warning"}>{active ? "Connected" : "Not configured"}</Badge>;
}

export function SettingsClient({
  canManageSettings,
  emailOk,
  whatsappOk,
  storageOk,
  dbOk,
  cronOk,
  cullinosOk,
  razorpayOk,
  encryptionOk,
}: {
  canManageSettings: boolean;
  emailOk: boolean;
  whatsappOk: boolean;
  storageOk: boolean;
  dbOk: boolean;
  cronOk: boolean;
  cullinosOk: boolean;
  razorpayOk: boolean;
  encryptionOk: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [org, setOrg] = useState({
    companyName: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    gst: "",
    pan: "",
    phone: "",
    email: "",
    invoicePrefix: "INV",
    paymentTerms: "",
    timezone: "Asia/Kolkata",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [cronResult, setCronResult] = useState("");

  useEffect(() => {
    fetch("/api/os/settings/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) setProfile({ name: d.profile.name, email: d.profile.email, phone: d.profile.phone || "" });
      });
    if (canManageSettings) {
      fetch("/api/os/settings/org")
        .then((r) => r.json())
        .then((d) => {
          if (d.settings) setOrg({ ...org, ...d.settings });
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageSettings]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/os/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Profile updated" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/os/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Password changed" });
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  async function saveOrg(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/os/settings/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: "Organization settings saved" });
      router.refresh();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  async function runCron() {
    setCronResult("");
    const res = await fetch("/api/os/cron", { method: "POST" });
    const data = await res.json();
    setCronResult(res.ok ? `Success: ${data.message || "Cron completed"}` : `Error: ${data.error}`);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    ...(canManageSettings ? [{ id: "organization" as Tab, label: "Organization" }] : []),
    { id: "integrations", label: "Integrations" },
    ...(canManageSettings ? [{ id: "automation" as Tab, label: "Automation" }] : []),
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Settings</h1>
      <p className="mb-6 text-sm text-muted">Manage your profile, organization, and integration status</p>

      {message && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your account details</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile.email} disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={savePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} />
                </div>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "organization" && canManageSettings && (
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Organization</CardTitle><CardDescription>Invoice branding and company details</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={saveOrg} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Company Name</Label>
                  <Input value={org.companyName} onChange={(e) => setOrg({ ...org, companyName: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address</Label>
                  <Input value={org.address || ""} onChange={(e) => setOrg({ ...org, address: e.target.value })} />
                </div>
                <div className="space-y-2"><Label>City</Label><Input value={org.city || ""} onChange={(e) => setOrg({ ...org, city: e.target.value })} /></div>
                <div className="space-y-2"><Label>State</Label><Input value={org.state || ""} onChange={(e) => setOrg({ ...org, state: e.target.value })} /></div>
                <div className="space-y-2"><Label>GST</Label><Input value={org.gst || ""} onChange={(e) => setOrg({ ...org, gst: e.target.value })} /></div>
                <div className="space-y-2"><Label>PAN</Label><Input value={org.pan || ""} onChange={(e) => setOrg({ ...org, pan: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={org.phone || ""} onChange={(e) => setOrg({ ...org, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={org.email || ""} onChange={(e) => setOrg({ ...org, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Invoice Prefix</Label><Input value={org.invoicePrefix || "INV"} onChange={(e) => setOrg({ ...org, invoicePrefix: e.target.value })} /></div>
                <div className="space-y-2"><Label>Timezone</Label><Input value={org.timezone || "Asia/Kolkata"} onChange={(e) => setOrg({ ...org, timezone: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Payment Terms</Label>
                  <Input value={org.paymentTerms || ""} onChange={(e) => setOrg({ ...org, paymentTerms: e.target.value })} placeholder="Net 15 days" />
                </div>
              </div>
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Organization"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "integrations" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { title: "Email (Resend)", desc: "Invoice and notification emails", ok: emailOk, env: "RESEND_API_KEY, RESEND_FROM_EMAIL" },
            { title: "WhatsApp", desc: "Client notifications", ok: whatsappOk, env: "WHATSAPP_WEBHOOK_URL or WHATSAPP_API_URL" },
            { title: "File Storage", desc: "Document uploads", ok: storageOk, env: "BLOB_READ_WRITE_TOKEN (or local dev)" },
            { title: "Database", desc: "Neon Postgres", ok: dbOk, env: "DATABASE_URL" },
            { title: "Cullinos", desc: "SaaS provisioning", ok: cullinosOk, env: "CULLINOS_API_URL, CULLINOS_PROVISION_KEY" },
            { title: "Razorpay", desc: "Payment gateway", ok: razorpayOk, env: "RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET" },
            { title: "Encryption", desc: "Credentials vault", ok: encryptionOk, env: "ENCRYPTION_KEY" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex-row items-center justify-between">
                <div><CardTitle>{item.title}</CardTitle><CardDescription>{item.desc}</CardDescription></div>
                <StatusBadge active={item.ok} />
              </CardHeader>
              <CardContent className="text-sm text-muted">
                <p>Configured via environment variables:</p>
                <code className="mt-1 block rounded bg-white/5 px-2 py-1 text-xs">{item.env}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === "automation" && canManageSettings && (
        <Card className="max-w-lg">
          <CardHeader className="flex-row items-center justify-between">
            <div><CardTitle>Automation Cron</CardTitle><CardDescription>Daily at 6:00 AM UTC</CardDescription></div>
            <StatusBadge active={cronOk} />
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted">Requires <code className="rounded bg-white/5 px-1">CRON_SECRET</code> in environment.</p>
            <Button onClick={runCron}>Run Now (manual)</Button>
            {cronResult && <p className="text-sm text-muted">{cronResult}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
