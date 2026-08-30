import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { isEmailConfigured } from "@/lib/os/notifications/email";
import { isWhatsAppConfigured } from "@/lib/os/notifications/whatsapp";
import { isStorageConfigured } from "@/lib/os/storage";
import { SettingsClient } from "@/components/os/SettingsClient";

export const metadata = { title: "Settings — Rkyves OS" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  const canManageSettings = user ? hasPermission(user.role, "settings.manage") : false;

  return (
    <SettingsClient
      canManageSettings={canManageSettings}
      emailOk={isEmailConfigured()}
      whatsappOk={isWhatsAppConfigured()}
      storageOk={isStorageConfigured()}
      dbOk={Boolean(process.env.DATABASE_URL)}
      cronOk={Boolean(process.env.CRON_SECRET)}
      cullinosOk={Boolean(process.env.CULLINOS_API_URL && process.env.CULLINOS_PROVISION_KEY)}
      razorpayOk={Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)}
      encryptionOk={Boolean(process.env.ENCRYPTION_KEY)}
    />
  );
}
