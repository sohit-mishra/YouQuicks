import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import { showErrorToast } from "@/lib/toastUtils";

export default function PremiumPlanDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/premium-services/detail/${id}`
        );
        setData(response.data);
      } catch (error) {
        showErrorToast("Fetch Failed");
      }
    };

    fetchPremium();
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-15 flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-6 border border-indigo-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          {data.planName} Plan
        </h2>

        <div className="grid grid-cols-1 gap-4 text-gray-700">
          <Info label="Duration" value={`${data.durationInMonths} month(s)`} />
          <Info label="Price/Month" value={`$${data.pricePerMonth}`} />
          <Info label="Monthly Coins" value={data.monthlyCoins} />
          <Info label="Max Video Duration" value={`${data.maxVideoDuration} mins`} />
          <Info label="YouTube Channels" value={data.youtubeChannels} />
          <Info label="Transaction Discount" value={`${data.transactionCostReduction}%`} />
          <Info label="Priority Support" value={data.prioritizedService ? "Yes" : "No"} />
          <Info label="Priority Transactions" value={data.prioritizedTransactions ? "Yes" : "No"} />
        </div>
      </motion.div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm sm:text-base">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
