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

export default function CreateEmployee() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@youquicks.com",
    password: "SecureP@ss123",
    department: "Engineering",
    jobTitle: "Software Developer",
    hireDate: "2022-05-15",
    salary: "85000",
    address: {
      street: "123 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560001",
    },
    contactNumber: "+91-9876543210",
    emergencyContact: {
      name: "Ravi Sharma",
      relationship: "Father",
      phone: "+91-9123456789",
    },
    aadharNumber: "123456789012",
    panNumber: "ABCDE1234F",
    bankDetails: {
      accountNumber: "123456789012",
      ifscCode: "SBIN0001234",
      accountHolderName: "Ravi Sharma",
      bankName: "State Bank of India",
    },
    profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
  });

  const departments = [
    "Engineering",
    "Design",
    "Marketing",
    "Content",
    "Support",
    "Sales",
    "Product",
    "Analytics",
    "Media / Creative",
    "Quality Assurance",
  ];

  const jobTitles = [
    "Software Developer",
    "UI/UX Designer",
    "Digital Marketer",
    "Content Writer",
    "SEO Specialist",
    "Customer Support Agent",
    "Sales Executive",
    "Product Manager",
    "Data Analyst",
    "DevOps Engineer",
    "Affiliate Manager",
    "Video Editor",
    "Social Media Manager",
    "QA Tester",
    "Blogger",
    "Web Developer",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = response.data?.result?.secure_url;
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
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
    setLoading(true);

    if (!formData.email.endsWith("@youquicks.com")) {
      showErrorToast("Email must end with @youquicks.com");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/auth/employee/register`,
        formData
      );

      if (response.status === 201) {
        showSuccessToast("Employee created successfully!");
        setTimeout(() => navigate("/admin/employees"), 500);
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Failed to create employee."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-100 px-4">
      <Toaster richColors position="top-center" />
      <Card className="max-w-4xl mx-auto rounded-2xl border shadow-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Create New Employee
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center">
            <div
              className="relative group cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={formData.profilePicture || avatar}
                alt="Employee Avatar"
                onError={(e) => {
                  e.currentTarget.src = avatar;
                }}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover ring-4 ring-indigo-400 transition hover:brightness-95"
              />
              <div className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow group-hover:opacity-100 opacity-90">
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Personal Info */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Employment Details */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Employment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border border-gray-300 rounded-md bg-white text-gray-700"
                >
                  <option value="">Select Job Title</option>
                  {jobTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border border-gray-300 rounded-md bg-white text-gray-700"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <Input
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="contactNumber"
                  placeholder="Phone Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
                <Input
                  name="address.street"
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={handleChange}
                />
                <Input
                  name="address.city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                />
                <Input
                  name="address.state"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                />
                <Input
                  name="address.zip"
                  placeholder="ZIP Code"
                  value={formData.address.zip}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="emergencyContact.name"
                  placeholder="Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                />
                <Input
                  name="emergencyContact.relationship"
                  placeholder="Relation"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                />
                <Input
                  name="emergencyContact.phone"
                  placeholder="Phone Number"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ID & Bank */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Bank Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="bankDetails.accountNumber"
                  placeholder="Bank Account No."
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                />
                <Input
                  name="bankDetails.ifscCode"
                  placeholder="IFSC Code"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                />
                <Input
                  name="bankDetails.bankName"
                  placeholder="Bank Name"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-full">
              <h2 className="text-xl font-semibold mb-2">ID Card</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="aadharNumber"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                />
                <Input
                  name="panNumber"
                  placeholder="PAN Number"
                  value={formData.panNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Salary */}
            <div className="col-span-full">
              <h2 className="text-xl font-semibold text-black-700 mb-2">
                Other Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Input
                  name="salary"
                  type="number"
                  placeholder="Salary Per Month"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="col-span-full mt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
