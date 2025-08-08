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

export default function BlogList() {
  const navigate = useNavigate();
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/blog/all`);
      setBlogList(res.data);
    } catch (err) {
      showErrorToast("Failed to fetch blog list.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/admin/blogs/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await api.delete(
        `${import.meta.env.VITE_API_URL}/api/blog/${id}`
      );
      if (res.status === 200) {
        setBlogList((prev) => prev.filter((blog) => blog._id !== id));
        showSuccessToast("Blog deleted successfully.");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to delete blog.");
    }
  };

  const totalPages = Math.ceil(blogList.length / itemsPerPage);
  const paginatedBlogs = blogList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-gray-100">
      <Toaster richColors position="top-center" />
      <AddButton title="Blog" link="add" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading blogs...</p>
          ) : blogList.length === 0 ? (
            <p className="text-center text-gray-500">No blogs found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author Name</TableHead>
                    <TableHead>Author Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBlogs.map((blog, index) => (
                    <TableRow key={blog._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.authorName || "—"}</TableCell>
                      <TableCell>{blog.authorEmail || "—"}</TableCell>
                      <TableCell>
                        {blog.isPublished ? "Published" : "Draft"}
                      </TableCell>
                      <TableCell>
                        {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(blog._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Pencil
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleEditClick(blog._id)}
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
                                Are you sure you want to delete this blog post?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClick(blog._id)}
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

              {blogList.length > itemsPerPage && (
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
