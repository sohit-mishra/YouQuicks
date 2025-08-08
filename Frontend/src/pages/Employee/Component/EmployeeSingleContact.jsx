import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EmployeeSingleContact() {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/api/contact/${id}`
        );
        setContact(res.data);
      } catch (err) {
        console.error("Failed to fetch contact:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading contact...</p>;
  }

  if (!contact) {
    return <p className="text-center text-red-500 mt-10">Contact not found.</p>;
  }

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-4 shadow-sm">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Contact Detail
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{contact.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{contact.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Video Link</p>
                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {contact.link}
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-500">Request</p>
                <p className="font-medium text-gray-800">{contact.request}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p className="font-medium text-gray-800">{contact.message}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  variant={
                    contact.status.toLowerCase() === "completed"
                      ? "default"
                      : "destructive"
                  }
                >
                  {contact.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium text-gray-800">
                  {new Date(contact.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
