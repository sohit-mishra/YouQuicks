import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import avatar from "@/assets/user/account.svg";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

export default function CreateAdmin() {
   const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("avatar", file);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/admin/upload/avatar`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data?.result?.secure_url;

      if (imageUrl) {
        setFormData((prev) => ({
          ...prev,
          profilePicture: imageUrl,
        }));
        showSuccessToast("Image uploaded successfully!");
      } else {
        showErrorToast("Failed to upload image.");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error uploading image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, profilePicture } = formData;

    if (!email.endsWith("@youquicks.com")) {
      showErrorToast("Email must end with @youquicks.com");
      return;
    }

    if (!name || !email || !password) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/admin/create`,
        {
          name,
          email,
          password,
          profilePicture,
        }
      );

      if (response.status === 201) {
        showSuccessToast("Admin created successfully!");
        setFormData({ name: "", email: "", password: "", profilePicture: "" });

        setTimeout(() => {
          navigate("/admin/admins");
        }, 500);
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to create admin."
      );
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100 px-4">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md rounded-2xl shadow-xl border bg-white">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create New Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div
              className="relative group cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={formData.profilePicture || avatar}
                alt={formData.name || "User Avatar"}
                onError={(e) => {
                  e.currentTarget.src = avatar;
                }}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover ring-4 ring-indigo-300 transition hover:brightness-90"
              />
              <div className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-md opacity-90 group-hover:opacity-100">
                Upload
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Admin Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@youquicks.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
