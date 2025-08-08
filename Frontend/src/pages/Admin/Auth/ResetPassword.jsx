import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccessToast, showErrorToast, showWarningToast } from '@/lib/toastUtils';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/admin/reset-password`, {
        token:token,
        newPassword :password,
      });


      if (response.status === 200) {
        showSuccessToast(response.data.message);
        setPassword("");
        setConfirmPassword("");
      } else {
        showWarningToast(response.data.message)
      }

      setTimeout(()=>{
        navigate('/admin/login');
      },500)

    } catch (error) {
      showErrorToast(error.response.data.message);
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
        <h1 className="text-2xl font-bold text-gray-800 text-center">Admin Reset Password</h1>
        <p className="text-gray-600 text-center text-sm">
          Enter your new password below.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-gray-700 mb-2 block">New Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your Confirm Password"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2">
          Submit
        </Button>
      </motion.form>
    </section>
  );
}
