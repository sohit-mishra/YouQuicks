import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Image from "@/assets/favicon.svg";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import { AuthContext } from "@/context/AuthContext";

export default function Login() {
  const { isLoggedIn, setIsLoggedIn, setRole, role,setToken } = useContext(AuthContext);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
    if (isLoggedIn && role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (isLoggedIn && role === "EMPLOYEE") {
      navigate("/employee/dashboard");
    }else if (isLoggedIn && role === "USER") {
      navigate("/user/dashboard");
    }else{
      navigate("/admin/login");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailId || !password) {
      showErrorToast("Please fill in both fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/admin/login`,
        {
          email: emailId,
          password,
        }
      );

      if (response.status === 200) {
        showSuccessToast("Login successful!");

        localStorage.setItem("payload", response.data.token);
        setToken(response.data.token);
        setIsLoggedIn(true);
        setRole("ADMIN");

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 500);
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message || error);
    }
  };

  return (
    <section className="my-15 flex items-center justify-center bg-gray-100 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-lg shadow-[0px_0px_50px_10px_rgb(255,205,205)] w-full max-w-md"
      >
        <Toaster richColors position="top-center" />
        <div className="text-center mb-6">
          <img src={Image} alt="Login" className="mx-auto h-16" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            {" "}
            Admin Login
          </h1>
        </div>

        <form
          id="myForm"
          onSubmit={handleSubmit}
          autoComplete="off"
          className="space-y-4"
        >
          <div>
            <Label
              htmlFor="emailId"
              className="block text-sm font-medium text-gray-700"
            >
              Email Id
            </Label>
            <Input
              type="text"
              id="emailId"
              name="emailId"
              placeholder="Email ID"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0abb87]"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0abb87]"
            />
          </div>

          <div className="text-right text-sm">
            <Link
              to="/admin/forgetpassword"
              className="text-[#0abb87] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red text-white font-semibold py-2"
          >
            Submit
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
