import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaCoins } from "react-icons/fa";
import api from "@/api/api";

export default function PaymentHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/payment/user/all`
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Payment status fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 font-medium";
      case "failed":
        return "text-red-600 font-medium";
      case "pending":
        return "text-amber-500 font-medium";
      default:
        return "text-gray-600";
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <section className="w-full mt-12 px-4 py-6 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_16px_0px_rgb(173,173,173)] rounded-md"
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        </div>

        <div className="p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-6 text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-gray-500 py-6"
                  >
                    No payment history available.
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((order, index) => (
                  <TableRow key={`${order.transactionId || "row"}-${index}`}>
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      Buy <FaCoins className="text-yellow-500" /> {order.coins}{" "}
                      Coins
                    </TableCell>
                    <TableCell>
                      ${order.amount?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className={getStatusColor(order.status)}>
                      {order.status
                        ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1).toLowerCase()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {order.method
                        ? order.method.charAt(0).toUpperCase() +
                          order.method.slice(1).toLowerCase()
                        : "-"}
                    </TableCell>
                    <TableCell>{order.currency || "-"}</TableCell>
                    <TableCell>{order.transactionId || "-"}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          {!loading && orders.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePrev}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
