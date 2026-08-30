import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#111" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  brand: { fontSize: 22, fontWeight: "bold", color: "#8b5cf6" },
  brandSub: { fontSize: 8, color: "#888", marginTop: 2 },
  invoiceTitle: { fontSize: 28, fontWeight: "bold", color: "#111" },
  section: { marginBottom: 20 },
  label: { fontSize: 8, color: "#888", marginBottom: 4, textTransform: "uppercase" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  table: { marginTop: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f4f4f5", padding: 8, fontWeight: "bold" },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totals: { marginTop: 20, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", width: 200, justifyContent: "space-between", marginBottom: 4 },
  grandTotal: { flexDirection: "row", width: 200, justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTopWidth: 2, borderTopColor: "#8b5cf6" },
  grandTotalText: { fontSize: 14, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", color: "#888", fontSize: 8 },
  status: { padding: "4 8", backgroundColor: "#f4f4f5", borderRadius: 4, fontSize: 9, alignSelf: "flex-start" },
});

export type InvoicePdfData = {
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  org?: {
    companyName: string;
    address?: string | null;
    city?: string | null;
    gst?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  client: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    gst?: string | null;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  notes?: string | null;
};

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
  const balance = data.total - data.amountPaid;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>{data.org?.companyName || "Rkyves"}</Text>
            <Text style={styles.brandSub}>Technology built around your business</Text>
            <Text style={{ ...styles.brandSub, marginTop: 8 }}>
              {[data.org?.email, data.org?.phone].filter(Boolean).join(" · ") || "rkyves.com · sales@rkyves.com"}
            </Text>
            {data.org?.gst && <Text style={styles.brandSub}>GST: {data.org.gst}</Text>}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={{ fontSize: 12, marginTop: 4 }}>{data.invoiceNumber}</Text>
            <Text style={styles.status}>{data.status.replace(/_/g, " ").toUpperCase()}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
          <View style={styles.section}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>{data.client.companyName}</Text>
            <Text>{data.client.contactPerson}</Text>
            <Text>{data.client.email}</Text>
            {data.client.phone && <Text>{data.client.phone}</Text>}
            {data.client.address && <Text>{data.client.address}</Text>}
            {(data.client.city || data.client.gst) && (
              <Text>{[data.client.city, data.client.gst ? `GST: ${data.client.gst}` : ""].filter(Boolean).join(" · ")}</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Invoice Details</Text>
            <View style={styles.row}><Text>Issue Date</Text><Text>{data.issueDate}</Text></View>
            <View style={styles.row}><Text>Due Date</Text><Text>{data.dueDate}</Text></View>
            {balance > 0 && (
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text style={{ fontWeight: "bold" }}>Balance Due</Text>
                <Text style={{ fontWeight: "bold", color: "#8b5cf6" }}>{formatINR(balance)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Rate</Text>
            <Text style={styles.colTotal}>Amount</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatINR(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>{formatINR(item.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}><Text>Subtotal</Text><Text>{formatINR(data.subtotal)}</Text></View>
          {data.discount > 0 && <View style={styles.totalRow}><Text>Discount</Text><Text>-{formatINR(data.discount)}</Text></View>}
          {data.tax > 0 && <View style={styles.totalRow}><Text>GST (18%)</Text><Text>{formatINR(data.tax)}</Text></View>}
          {data.amountPaid > 0 && <View style={styles.totalRow}><Text>Paid</Text><Text>-{formatINR(data.amountPaid)}</Text></View>}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalText}>Total</Text>
            <Text style={styles.grandTotalText}>{formatINR(data.total)}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.label}>Notes</Text>
            <Text>{data.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Thank you for your business · Rkyves Technologies · GSTIN: 32AABCU9603R1ZM
        </Text>
      </Page>
    </Document>
  );
}
