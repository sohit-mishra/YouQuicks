import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import api from "@/api/api";

export default function PaymentCoin() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/payment/all`
        );
        setReport(res.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    const csv = [
      [
        "S.No",
        "Name",
        "Email",
        "Coins",
        "Amount",
        "Currency",
        "Status",
        "Method",
        "Payment ID",
        "Transaction ID",
        "Date",
      ],
      ...report.map((r, index) => [
        index + 1,
        r.userId?.name || "",
        r.userId?.email || "",
        r.coins || 0,
        r.amount || 0,
        r.currency || "",
        r.status || "",
        r.method || "",
        r.paymentId || "",
        r.transactionId || "",
        new Date(r.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Payment Coin
          </h2>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Coins</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.map((r, index) => (
              <TableRow key={r._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{r.userId?.name || "—"}</TableCell>
                <TableCell>{r.userId?.email || "—"}</TableCell>
                <TableCell>{r.coins || 0}</TableCell>
                <TableCell>${r.amount}</TableCell>
                <TableCell>{r.currency || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.status?.toLowerCase() === "completed"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
               <TableCell className="capitalize">{r.method}</TableCell>
                <TableCell className='center'>{r.paymentId || '—'}</TableCell>
                <TableCell>{r.transactionId}</TableCell>
                <TableCell>
                  {new Date(r.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </section>
  );
}
