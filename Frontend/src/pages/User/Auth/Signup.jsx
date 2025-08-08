import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from 'axios';
import { Toaster } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {showSuccessToast, showErrorToast} from '@/lib/toastUtils';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    channelId: '',
    name: '',
    phone: '',
    email: '',
    password: '',
    cpassword: ''
  });


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.cpassword) {
      showErrorToast("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
    
      if (response.status === 201) {
        showSuccessToast(response.data.message);
        setTimeout(() => {
          navigate('/user/otp', { state: { email: formData.email } });
        }, 2000);
      }
    } catch (error) {
      showErrorToast(error.response.data.message || error);
    }
  };
  

  return (
    <section className="my-15 flex items-center justify-center bg-gray-100 py-10">
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-lg shadow-[0px_0px_50px_10px_rgb(255,205,205)] w-full max-w-md"
      >
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <h1 className="text-4xl pt-0 pb-5 text-gray-500
           text-center font-semibold mb-4">Create an account</h1>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="channelId" className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </Label>
              <Link
                to="https://www.youtube.com/account_advanced"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Check Channel ID
              </Link>
            </div>

            <Input
              id="channelId"
              name="channelId"
              placeholder="Channel ID"
              pattern="^UC[\w-]{22}$"
              required
              title="Enter a valid YouTube Channel ID starting with 'UC' followed by 22 characters"
              value={formData.channelId}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="name" className='mb-2'>Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="phone" className='mb-2'>Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email" className='mb-2'>Email Id <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              placeholder="Email id"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password" className='mb-2'>Password <span className="text-red-500">*</span></Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="cpassword" className='mb-2'>Confirm Password <span className="text-red-500">*</span></Label>
            <Input
              id="cpassword"
              name="cpassword"
              type="password"
              placeholder="Confirm Password"
              required
              value={formData.cpassword}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full bg-red-500 mt-2 hover:bg-[#0abb87]">GET OTP</Button>
          <p className="text-sm mt-4 text-center">
            Already a member? <Link to="/user/login" className="text-[#0abb87] hover:underline">Log in</Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
