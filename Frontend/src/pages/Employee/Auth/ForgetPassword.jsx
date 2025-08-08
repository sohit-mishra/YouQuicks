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
  const [employeeId, setEmployeeId] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      showErrorToast("Please fill in your Employee Id.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/employee/forgot-password`, {
        employeeId,
      });

      showSuccessToast(response.data.message);
      setTimeout(()=>{
        navigate('/employee/login');
      },1000);
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
        <h1 className="text-2xl font-bold text-gray-800 text-center">Employee Forgot Password</h1>
        <p className="text-gray-600 text-left text-sm">
         Enter your Employee ID. We'll send a link to your registered email.
        </p>

        <div>
          <Label htmlFor="employeeId" className="text-gray-700 mb-4">Employee Id </Label>
          <Input
            type="text"
            id="employeeId"
            name="employeeId"
            placeholder="Enter your Employee Id"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}

          />
        </div>

        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2">
          Submit
        </Button>
      </motion.form>
    </section>
  );
}
