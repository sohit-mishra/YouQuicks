import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TopHeader from "@/pages/Admin/Components/TopHeader";
import api from "@/api/api";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";

export default function SocialMedia() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    whatsAppPhone: "",
    facebook: "",
    instagram: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/social-media`
        );
        setFormData(response.data);
      } catch (error) {
        showErrorToast(
          error.response?.data?.message ||
          error.message ||
          "Error fetching data."
        );
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `${import.meta.env.VITE_API_URL}/api/social-media`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        showSuccessToast(response.data.message || "Social media updated successfully");

        setTimeout(() => {
          navigate("/otp");
        }, 2000);
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || error.message || "Submission failed."
      );
    }
  };

  return (
    <section className="w-full bg-gray-100">
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 pt-5 w-full h-full"
      >
        <TopHeader>Social Media</TopHeader>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="space-y-5 w-full max-w-md mx-auto rounded-lg shadow-[0px_0px_50px_10px_rgb(255,205,205)] px-6 py-6 bg-white"
        >
          <h1 className="text-3xl text-center text-gray-700 font-semibold">
            Social Media Update
          </h1>

          <div className="mt-10">
            <Label htmlFor="whatsAppPhone" className="mb-1">WhatsApp Phone</Label>
            <Input
              id="whatsAppPhone"
              name="whatsAppPhone"
              placeholder="Phone Number"
              type="tel"
              value={formData.whatsAppPhone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email" className="mb-1">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="facebook" className="mb-1">
              Facebook <span className="text-red-500">*</span>
            </Label>
            <Input
              id="facebook"
              name="facebook"
              type="text"
              placeholder="facebook-username"
              required
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="instagram" className="mb-1">
              Instagram <span className="text-red-500">*</span>
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="text"
              placeholder="instagram-username"
              required
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="telegram" className="mb-1">
              Telegram <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telegram"
              name="telegram"
              type="text"
              placeholder="@telegramUsername"
              required
              value={formData.telegram}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-[#0abb87] text-white font-semibold"
          >
            Update Social Media
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
