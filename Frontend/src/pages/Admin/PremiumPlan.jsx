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
import { FaCoins } from "react-icons/fa";
import AddButton from "@/pages/Admin/Components/AddButton";
import api from "@/api/api";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PremiumPlan() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/premium-services/all`
        );
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const paginatedPlans = plans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewClick = (id) => {
    navigate(`/admin/premium-plan/details/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/admin/premium-plan/edit/${id}`);
  };

  return (
    <section className="w-full bg-gray-100 min-h-screen p-6">
      <AddButton title="Premium Plan" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-md"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-center text-gray-500">No premium plans found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Video Duration</TableHead>
                    <TableHead>Monthly Coins</TableHead>
                    <TableHead>Txn Priority</TableHead>
                    <TableHead>Service Priority</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlans.map((plan, index) => (
                    <TableRow key={plan._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-700">
                        {plan.planName}
                      </TableCell>
                      <TableCell>{plan.youtubeChannels}</TableCell>
                      <TableCell>{plan.maxVideoDuration} min</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <FaCoins /> {plan.monthlyCoins}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.prioritizedTransactions ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {plan.prioritizedService ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>${plan.pricePerMonth}/mo</TableCell>
                      <TableCell>{plan.durationInMonths} mo</TableCell>
                      <TableCell>
                        <Pencil
                          onClick={() => handleEditClick(plan._id)}
                          className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(plan._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {plans.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
        </div>
      </motion.div>
    </section>
  );
}
