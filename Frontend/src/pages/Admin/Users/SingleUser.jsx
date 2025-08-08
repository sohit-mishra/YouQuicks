import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import avatar from "@/assets/user/account.svg";
import api from "@/api/api";
import { FaCoins } from "react-icons/fa";

export default function SingleUser() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleUser = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/user/singleuser/${id}`
        );
        setData(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load user. Please try again later.");
      }
    };

    fetchSingleUser();
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-red-200 via-red-100 to-white text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-tr from-gray-100 via-gray-50 to-white text-gray-500 text-xl animate-pulse">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-xl bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border-[1px]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <img
              src={data.avatar || avatar}
              alt={data.name || "User Avatar"}
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-indigo-300"
            />
            {data.premium && data.premium !== "Free" && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full shadow-md">
                Premium
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            {data.name || "Unnamed User"}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {data.email ? (
              <a
                href={`mailto:${data.email}`}
                className="text-blue-600 hover:underline"
              >
                {data.email}
              </a>
            ) : (
              "No Email"
            )}
          </p>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <p className="text-gray-600 font-medium">
              {data.channelName || "No Channel"}
            </p>
            {data.channelId && (
              <a
                href={`https://www.youtube.com/channel/${data.channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800 transition"
                title="Visit YouTube Channel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 3v2h3.586L9.293 13.293l1.414 1.414L19 6.414V10h2V3h-7z" />
                  <path d="M5 5h6V3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-6h-2v6H5V5z" />
                </svg>
              </a>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mt-10 text-left w-full">
            Profile Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 text-left w-full">
            <div className="bg-white/60 p-4 rounded-lg shadow-inner">
              <h4 className="text-sm font-semibold text-gray-700">Phone</h4>
              <p className="text-gray-800">
                {data.phone ? (
                  <a
                    href={`tel:${data.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {data.phone}
                  </a>
                ) : (
                  "No Phone"
                )}
              </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg shadow-inner">
              <h4 className="text-sm font-semibold text-gray-700">
                Coins
                <span className="text-yellow-500 flex items-center text-sm mt-1">
                  <FaCoins className="mr-2" /> {data.coin ?? 0}
                </span>
              </h4>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
