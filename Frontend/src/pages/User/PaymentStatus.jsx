import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/api/api";
import { motion } from "framer-motion";
import { FaCoins } from "react-icons/fa";

export default function PaymentStatus() {
  const location = useLocation();
  const id = location.state?.id;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/api/payment/${id}`);
        setPaymentDetails(res.data);
      } catch (error) {
        console.error("Payment status fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStatus();
    }
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center">Loading payment status...</div>;
  }

  if (!paymentDetails) {
    return <div className="p-4 text-center text-red-500">No payment information found.</div>;
  }

  const commonDetails = (
    <div className="mt-4 text-sm text-gray-600 space-y-1">
      <p><strong>Transaction ID:</strong> {paymentDetails.transactionId || "N/A"}</p>
      <p><strong>Coins:</strong> {paymentDetails.coins}</p>
      <p><strong>Amount:</strong> {paymentDetails.amount} {paymentDetails.currency}</p>
      <p><strong>Method:</strong> {paymentDetails.method}</p>
      <p><strong>Date:</strong> {new Date(paymentDetails.createdAt).toLocaleString()}</p>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[600px] p-4">
      {paymentDetails.status === "failed" && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
          <p className="mt-2 text-gray-600">Unfortunately, your payment could not be processed.</p>
          {commonDetails}
        </motion.div>
      )}

      {paymentDetails.status === "completed" && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-green-600">Payment Successful</h2>
          <p className="mt-2 text-gray-600">Thank you for your payment!</p>
          <div className="flex justify-center mt-4">
            <FaCoins className="text-yellow-500 text-4xl" />
          </div>
          {commonDetails}
        </motion.div>
      )}
    </div>
  );
}
