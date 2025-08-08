import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnAuthorized() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <section className="flex items-center justify-center min-h-[70vh] bg-gray-100 text-center p-6">
      <motion.div
        className="bg-white px-10 py-12 rounded-2xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ShieldAlert className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to view this page.
        </p>

        <Button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-sm transition"
        >
          Go Home
        </Button>
      </motion.div>
    </section>
  );
}
