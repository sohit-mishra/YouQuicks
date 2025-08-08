import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/api";
import avatar from "@/assets/user/account.svg";
import { FaCoins } from "react-icons/fa";

export default function SingleEmployee() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleUser = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/employee/${id}`
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
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-500 text-xl animate-pulse">
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
        className="w-full max-w-3xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <img
              src={data.profilePicture || avatar}
              alt={data.firstName + " " + data.lastName}
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-indigo-300"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            {data.firstName + " " + data.lastName}
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

          <h2 className="text-xl font-semibold text-gray-700 mt-8 text-left w-full">
            Profile Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-left w-full">
            {/* Job Details */}
            <DetailCard title="Job Title" value={data.jobTitle} />
            <DetailCard title="Department" value={data.department} />
            <DetailCard
              title="Hire Date"
              value={new Date(data.hireDate).toLocaleDateString()}
            />
            <DetailCard
              title="Salary"
              value={`₹${data.salary?.toLocaleString()}`}
            />
            <DetailCard title="Employee ID" value={data.employeeId} />
            <DetailCard
              title="Employment Status"
              value={data.isActive ? "Resigned" : "Not Resigned"}
              valueClassName={data.isActive ? "text-green-600" : "text-red-600"}
            />

            {/* Contact */}
            <DetailCard title="Contact Number" value={data.contactNumber} />
            <DetailCard
              title="Emergency Contact"
              value={
                data.emergencyContact
                  ? `${data.emergencyContact.name} (${data.emergencyContact.relationship}) - ${data.emergencyContact.phone}`
                  : "N/A"
              }
            />

            <DetailCard title="Aadhar Number" value={data.aadharNumber} />
            <DetailCard title="PAN Number" value={data.panNumber} />

            {/* Address */}
            <DetailCard
              title="Address"
              value={
                data.address
                  ? `${data.address.street}, ${data.address.city}, ${data.address.state} - ${data.address.zip}, ${data.address.country}`
                  : "N/A"
              }
            />

            {/* Bank Details */}
            <DetailCard
              title="Bank Account"
              value={
                data.bankDetails
                  ? `A/C: ****${data.bankDetails.accountNumber.slice(
                      -4
                    )},\nIFSC: ${data.bankDetails.ifscCode},\nAccount Holder: ${
                      data.bankDetails?.accountHolderName
                    }`
                  : "N/A"
              }
            />
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Last updated:{" "}
            {new Date(data.updatedAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable detail card with optional value styling
function DetailCard({ title, value, valueClassName = "" }) {
  return (
    <div className="bg-white/60 p-4 rounded-lg shadow-inner">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <p className={`text-gray-800 ${valueClassName}`}>{value || "N/A"}</p>
    </div>
  );
}
