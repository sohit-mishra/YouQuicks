import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/api";
import { Toaster } from "sonner";
import AddButton from "@/pages/Admin/Components/AddButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil } from "lucide-react";
import { showErrorToast } from "@/lib/toastUtils";

export default function EmployeeOrderList() {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/order/allorder`);
      setOrderList(res.data);
    } catch (err) {
      showErrorToast("Failed to fetch order list.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    navigate(`/employee/order/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/employee/order/edit/${id}`);
  };

  const totalPages = Math.ceil(orderList.length / itemsPerPage);
  const paginatedOrders = orderList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-gray-100 min-h-screen">
      <Toaster richColors position="top-center" />
      <AddButton title="Order" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0_0_4px_0_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading orders...</p>
          ) : orderList.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Video URL</TableHead>
                    <TableHead>Coins Used</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow key={order._id}>
                      <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell>{order.orderType || "—"}</TableCell>
                      <TableCell>
                        <a
                          href={order.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Video
                        </a>
                      </TableCell>
                      <TableCell>{order.coinUsed || 0}</TableCell>
                      <TableCell>{order.cost || 0}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.deliverySpeed || "—"}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(order._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Pencil
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleEditClick(order._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {orderList.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white">
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
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
