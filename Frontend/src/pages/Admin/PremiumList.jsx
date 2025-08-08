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
import api from "@/api/api";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddButton from "@/pages/Admin/Components/AddButton";

export default function UserList() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/user/premium/all`
      );
      setUserList(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/admin/user/${id}`);
  };

  const totalPages = Math.ceil(userList.length / itemsPerPage);
  const paginatedUsers = userList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="w-full bg-gray-100">
      <AddButton title=" Premium User" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_4px_0px_rgb(173,173,173)] rounded-sm"
      >
        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading users...</p>
          ) : userList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] py-10 text-gray-500">
              <p className="mt-2 text-2xl text-center">No premium users found.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">S.No</TableHead>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-left">Email</TableHead>
                    <TableHead className="text-left">Phone</TableHead>
                    <TableHead className="text-left">Channel Name</TableHead>
                    <TableHead className="text-left">Channel ID</TableHead>
                    <TableHead className="text-left">Coin</TableHead>
                    <TableHead className="text-left">Premium</TableHead>
                    <TableHead className="text-left">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.channelName}</TableCell>
                      <TableCell>{user.channelId}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <FaCoins className="text-yellow-500" />
                          <span>{user.coin}</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`${
                          user.premium === "Free"
                            ? "text-black"
                            : "font-semibold text-blue-600"
                        }`}
                      >
                        {user.premium}
                      </TableCell>
                      <TableCell className="text-right">
                        <Eye
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleClick(user._id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {userList.length > itemsPerPage && (
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
