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
import api from "@/api/api";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import AddButton from "@/pages/Admin/Components/AddButton";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Toaster } from "sonner";

export default function EmployeeCouponList() {
  const navigate = useNavigate();
  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/coupon`);
      setCouponList(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    navigate(`/employee/coupon/${id}`);
  };


  const handleStatusToggle = async (id, status) => {
    try {
      await api.patch(
        `${import.meta.env.VITE_API_URL}/api/coupon/status/${id}`,
        { isActive: status }
      );
      setCouponList((prev) =>
        prev.map((coupon) =>
          coupon._id === id ? { ...coupon, isActive: status } : coupon
        )
      );
      showSuccessToast("Coupon status updated successfully");
    } catch (err) {
      console.error("Failed to update status:", err);
      showErrorToast("Failed to update coupon status");
    }
  };

  const totalPages = Math.ceil(couponList.length / itemsPerPage);
  const paginatedCoupons = couponList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-gray-100">
      <Toaster richColors position="top-center" />
      <AddButton title="Coupon" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading coupons...</p>
          ) : couponList.length === 0 ? (
            <p className="text-center text-gray-500">No coupons found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount (%)</TableHead>
                    <TableHead>Amount ($)</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Used Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCoupons.map((coupon, index) => (
                    <TableRow key={coupon._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{coupon.code}</TableCell>
                      <TableCell>{coupon.type.toUpperCase()}</TableCell>
                      <TableCell>
                        {coupon.discountPercentage
                          ? `${coupon.discountPercentage}%`
                          : "-"}
                      </TableCell>
                      <TableCell>{coupon.amount || "-"}</TableCell>
                      <TableCell>
                        {new Date(coupon.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{coupon.usageLimit}</TableCell>
                      <TableCell>{coupon.usedCount}</TableCell>
                      <TableCell
                        className={
                          coupon.isActive ? "text-green-600" : "text-red-500"
                        }
                      >
                        <Switch
                          checked={coupon.isActive}
                          onCheckedChange={(value) =>
                            handleStatusToggle(coupon._id, value)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(coupon._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {couponList.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white">
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
