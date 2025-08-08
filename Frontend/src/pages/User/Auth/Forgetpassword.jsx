import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import {showSuccessToast, showErrorToast} from '@/lib/toastUtils';
import { useNavigate } from "react-router-dom";



export default function Forgetpassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showErrorToast("Please fill in your email.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        email,
      });

      showSuccessToast(response.data.message);
      setTimeout(()=>{
        navigate('/user/login');
      },500);
    } catch (error) {
      showErrorToast(error.response.data.message || error);
    }
  };

  return (
    <section className="my-15 flex items-center justify-center bg-gray-100 py-10">
      <Toaster richColors position="top-center" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-[0px_0px_40px_8px_rgb(255,205,205)] w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h1>
        <p className="text-gray-600 text-center text-sm">
          Enter your registered email. We'll send you a reset link.
        </p>

        <div>
          <Label htmlFor="email" className="text-gray-700 mb-4">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

          />
        </div>

        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2">
          Submit
        </Button>
      </motion.form>
    </section>
  );
}
