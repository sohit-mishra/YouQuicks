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
import AddButton from "@/pages/Admin/Components/AddButton";
import { Switch } from "@/components/ui/switch";

export default function AllEmployee() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/employee/`
      );
      setEmployeeList(res.data);
    } catch (err) {
      showErrorToast("Failed to fetch employee list.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    navigate(`/admin/employee/details/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/admin/employee/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_API_URL}/api/employee/${id}`
      );
      if (res.status === 200) {
        setEmployeeList((prev) => prev.filter((emp) => emp._id !== id));
        showSuccessToast("Employee deleted successfully.");
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.error || "Failed to delete employee."
      );
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const res = await api.patch(
        `${import.meta.env.VITE_API_URL}/api/employee/${id}/status`,
        {
          isActive: newStatus,
        }
      );

      if (res.status === 200) {
        setEmployeeList((prevList) =>
          prevList.map((emp) =>
            emp._id === id ? { ...emp, isActive: newStatus } : emp
          )
        );
        showSuccessToast(
          `Status updated to ${newStatus ? "Resigned" : "Not Resigned"}`
        );
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to update status.");
    }
  };

  const totalPages = Math.ceil(employeeList.length / itemsPerPage);
  const paginatedEmployees = employeeList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-gray-100">
      <Toaster richColors position="top-center" />
      <AddButton title="Employee" link="add" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading employees...</p>
          ) : employeeList.length === 0 ? (
            <p className="text-center text-gray-500">No employees found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Employee Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Resigned</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.map((emp, index) => (
                    <TableRow key={emp._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{emp.employeeId}</TableCell>
                      <TableCell>{`${emp.firstName} ${emp.lastName}`}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.jobTitle}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>
                        {new Date(emp.hireDate).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={emp.isActive}
                          onCheckedChange={(value) =>
                            handleStatusToggle(emp._id, value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Pencil
                          onClick={() => handleEditClick(emp._id)}
                          className="w-5 h-5 text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(emp._id)}
                        />
                      </TableCell>
                      <TableCell>
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
                                Are you sure you want to delete this employee?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClick(emp._id)}
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

              {employeeList.length > itemsPerPage && (
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
