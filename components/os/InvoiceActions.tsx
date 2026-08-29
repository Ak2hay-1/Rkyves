"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/os/ui/button";
import { Badge } from "@/components/os/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: string;
  discount: string | null;
  tax: string | null;
  total: string;
  amountPaid: string | null;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  clientId: string;
  companyName: string;
  contactPerson: string;
  email: string;
};

export function InvoiceActions({ invoice }: { invoice: InvoiceData }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function sendInvoice() {
    setSending(true);
    setMessage("");
    try {
      const res = await fetch(`/api/os/invoices/${invoice.id}/send`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to send");
        return;
      }
      setMessage("Invoice sent via email & WhatsApp");
      router.refresh();
    } catch {
      setMessage("Failed to send invoice");
    } finally {
      setSending(false);
    }
  }

  const balance = Number(invoice.total) - Number(invoice.amountPaid || 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant={invoice.status === "paid" ? "success" : invoice.status === "overdue" ? "danger" : "info"}>
          {invoice.status.replace(/_/g, " ")}
        </Badge>
        <Link href={`/api/os/invoices/${invoice.id}/pdf`} target="_blank">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </Link>
        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
          <Button size="sm" onClick={sendInvoice} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send to Client
          </Button>
        )}
        {message && <span className="text-sm text-emerald-400">{message}</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="text-sm text-muted">Invoice Number</p><p className="font-medium">{invoice.invoiceNumber}</p></div>
              <div><p className="text-sm text-muted">Issue Date</p><p className="font-medium">{formatDate(invoice.createdAt)}</p></div>
              <div><p className="text-sm text-muted">Due Date</p><p className="font-medium">{formatDate(invoice.dueDate)}</p></div>
              <div><p className="text-sm text-muted">Client</p>
                <Link href={`/os/clients/${invoice.clientId}?tab=finance`} className="font-medium hover:text-primary">
                  {invoice.companyName}
                </Link>
              </div>
            </div>
            {invoice.notes && (
              <div className="mt-4 rounded-lg bg-surface p-3 text-sm text-muted">{invoice.notes}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatCurrency(Number(invoice.subtotal))}</span></div>
            {Number(invoice.discount) > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span>-{formatCurrency(Number(invoice.discount))}</span></div>}
            {Number(invoice.tax) > 0 && <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatCurrency(Number(invoice.tax))}</span></div>}
            <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{formatCurrency(Number(invoice.total))}</span></div>
            <div className="flex justify-between text-emerald-400"><span>Paid</span><span>{formatCurrency(Number(invoice.amountPaid || 0))}</span></div>
            {balance > 0 && <div className="flex justify-between text-amber-400"><span>Balance Due</span><span>{formatCurrency(balance)}</span></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
