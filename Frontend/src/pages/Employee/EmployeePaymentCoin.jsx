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
import { Badge } from "@/components/ui/badge";
import api from "@/api/api";
import AddButton from "@/pages/Admin/Components/AddButton";

const ITEMS_PER_PAGE = 10;

export default function EmployeePaymentCoin() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(report.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = report.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <AddButton title="Payment Coin" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm p-4"
      >
        {loading ? (
          <p className="text-center text-gray-600 py-6">Loading payments...</p>
        ) : report.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No payment records found.</p>
        ) : (
          <>
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
                {currentData.map((r, index) => (
                  <TableRow key={r._id}>
                    <TableCell>{startIdx + index + 1}</TableCell>
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
                    <TableCell className="center">{r.paymentId || "—"}</TableCell>
                    <TableCell>{r.transactionId || "—"}</TableCell>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {report.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-md">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
}
