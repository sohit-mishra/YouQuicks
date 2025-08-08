import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/api/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FaCoins } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
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
} from '@/components/ui/alert-dialog';

export default function AllOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/order/all`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/api/order/${selectedOrderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrderId)
      );
      console.log("deleted");
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setSelectedOrderId(null);
    }
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="w-full mt-12 px-4 py-6 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_16px_0px_rgb(173,173,173)] rounded-lg"
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
        </div>

        <div className="p-6 overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">S.No</TableHead>
                    <TableHead className="text-left">Title</TableHead>
                    <TableHead className="text-left">Video URL</TableHead>
                    <TableHead className="text-left">Order Type</TableHead>
                    <TableHead className="text-center">Progress</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Pay Coin</TableHead>
                    <TableHead className="text-right">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order, index) => (
                    <TableRow key={order._id}>
                      <TableCell>{indexOfFirst + index + 1}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>
                        <a
                          href={order.videoUrl}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Video
                        </a>
                      </TableCell>
                      <TableCell>{order.orderType}</TableCell>
                      <TableCell className="text-center">
                        {order.quantity} / {order.total}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-semibold ${
                            order.status === 'Completed'
                              ? 'text-green-600'
                              : order.status === 'In Progress'
                              ? 'text-yellow-600'
                              : order.status === 'Failed'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-1">
                          <FaCoins className="text-yellow-500" />
                          <span>{order.coinUsed.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setSelectedOrderId(order._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete Order"
                            >
                              <MdDeleteOutline className="text-xl" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the order.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setSelectedOrderId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
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

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2 items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-1 rounded border ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-1 rounded border ${
                        currentPage === i + 1
                          ? 'bg-green-600 text-white font-semibold'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-1 rounded border ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
