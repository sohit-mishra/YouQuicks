import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "@/pages/Admin/Components/AddButton";
import { motion } from "framer-motion";
import api from "@/api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

export default function EmployeeContactList() {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/contact/all`
      );
      setContactList(res.data);
    } catch (err) {
      console.error("Failed to fetch contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(contactList.length / itemsPerPage);
  const paginatedUsers = contactList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewClick = (id) => {
    navigate(`/employee/contact/${id}`);
  };

  return (
    <section className="w-full bg-gray-100 min-h-screen">
      <AddButton title="Contact" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading Contact...</p>
          ) : contactList.length === 0 ? (
            <p className="text-center text-gray-500">No contacts found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">S.No</TableHead>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-left">Email</TableHead>
                    <TableHead className="text-left">Video Link</TableHead>
                    <TableHead className="text-left">Request</TableHead>
                    <TableHead className="text-left">Message</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left">View</TableHead>
                    <TableHead className="text-left">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((contact, index) => (
                    <TableRow key={contact._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.link}</TableCell>
                      <TableCell>{contact.request}</TableCell>
                      <TableCell title={contact.message}>
                        {contact.message.length > 50
                          ? contact.message.slice(0, 50) + "..."
                          : contact.message}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            contact.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : contact.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {contact.status || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Eye
                          title="View Contact"
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleViewClick(contact._id)}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(contact.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {contactList.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-md">
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
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
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
