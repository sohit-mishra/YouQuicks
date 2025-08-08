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
import { Eye } from "lucide-react";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
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
import AddButton from '@/pages/Admin/Components/AddButton';

export default function AllAdmin() {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/admin/all`
      );
      setAdminList(res.data);
    } catch (err) {
      showErrorToast("Failed to fetch admin list.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    navigate(`/admin/sigleadmin/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/delete/${id}`
      );
      if (res.status == 200) {
        setAdminList((prev) => prev.filter((admin) => admin._id !== id));
        showSuccessToast("Admin deleted successfully.");
      }
      console.log(res)
    } catch (error) {
      console.log(error);
      showErrorToast(
        error.response?.data?.message || "Failed to delete admin."
      );
    }
  };

  const totalPages = Math.ceil(adminList.length / itemsPerPage);
  const paginatedAdmins = adminList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
   <section className="w-full bg-gray-100">
      <Toaster richColors position="top-center" />
      <AddButton title="Admin"  link="add"/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading admins...</p>
          ) : adminList.length === 0 ? (
            <p className="text-center text-gray-500">No admins found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAdmins.map((admin, index) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {admin.lastLogin
                          ? new Date(admin.lastLogin).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(admin._id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <MdDeleteOutline className="text-xl text-red-600 cursor-pointer hover:text-red-800" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this admin? This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClick(admin._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {adminList.length > itemsPerPage && (
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
