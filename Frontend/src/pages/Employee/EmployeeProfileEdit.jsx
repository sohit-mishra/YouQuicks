import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import api from "@/api/api";
import avatarPlaceholder from "@/assets/user/account.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EmployeeProfileEdit() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    contactNumber: "",
    employeeId: "",
    profilePicture: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/api/employee/details`);
        const data = response.data;
        setUser({
          ...data,
          contactNumber: data.contactNumber || data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zip: data.address?.zip || "",
          },
          emergencyContact: {
            name: data.emergencyContact?.name || "",
            relationship: data.emergencyContact?.relationship || "",
            phone: data.emergencyContact?.phone || "",
          },
        });
      } catch (error) {
        console.error(error.response?.data || error);
      }
    };
    fetchData();
  }, []);


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/api/employee/upload/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccessToast("Avatar updated!");
      setUser((prev) => ({ ...prev, profilePicture: response.data.avatar }));
      // navigate("/admin/profile");
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to upload avatar.");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    showErrorToast("Only Admin can update data, not you");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }

    try {
      const response = await api.put(
        `${import.meta.env.VITE_API_URL}/api/employee/update/password`,
        { password: passwords.password }
      );
      showSuccessToast(response.data.message);
      setPasswords({ password: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to update password.");
    }
  };

  return (
    <motion.section
      className="p-6 max-w-4xl mx-auto bg-white rounded-lg mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster richColors position="top-center" />

      <div className="flex flex-col items-center space-y-4">
        <motion.img
          src={preview || user?.profilePicture || avatarPlaceholder}
          alt="Avatar"
          className="w-24 h-24 rounded-full border border-gray-300 object-cover"
          onError={(e) => {
            e.target.src = avatarPlaceholder;
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative inline-block mt-2">
          <input
            type="file"
            accept="image/*"
            id="avatarUpload"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <label
            htmlFor="avatarUpload"
            className="cursor-pointer inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200"
          >
            Upload Profile Photo
          </label>
        </div>

        <p className="text-sm font-bold text-gray-500">{user.email || ""}</p>
        <p className="text-sm font-bold text-gray-500">Employee ID: {user.employeeId || ""}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-700">
        <motion.form
          onSubmit={handleProfileSubmit}
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
            Profile Update
          </h2>
          <hr className="mb-10" />

          <div>
            <Label className="mb-2">Name</Label>
            <Input name="name" value={user.name}/>
          </div>

          <div>
            <Label className="mb-2">Phone</Label>
            <Input name="contactNumber" value={user.contactNumber} />
          </div>

          <div>
            <h2 className="mt-8 text-xl font-semibold">Address</h2>
            <Label className="mb-2 mt-2">Street</Label>
            <Input name="street" data-group="address" value={user.address.street}/>

            <Label className="mb-2 mt-2">City</Label>
            <Input name="city" data-group="address" value={user.address.city}/>

            <Label className="mb-2 mt-2">State</Label>
            <Input name="state" data-group="address" value={user.address.state}/>

            <Label className="mb-2 mt-2">Zip</Label>
            <Input name="zip" data-group="address" value={user.address.zip}/>
          </div>

          <div>
            <h2 className="mt-8 text-xl font-semibold">Emergency Contact</h2>
            <Label className="mb-2 mt-2">Name</Label>
            <Input name="name" data-group="emergency" value={user.emergencyContact.name} />

            <Label className="mb-2 mt-2">Relationship</Label>
            <Input name="relationship" data-group="emergency" value={user.emergencyContact.relationship} />

            <Label className="mb-2 mt-2">Phone</Label>
            <Input name="phone" data-group="emergency" value={user.emergencyContact.phone}  />
          </div>

          <div className="flex justify-center sm:justify-end">
            <Button type="submit" className="w-full sm:w-auto px-6 py-2 text-base rounded-md mb-15" whileTap={{ scale: 0.95 }}>
              Update Profile
            </Button>
          </div>
        </motion.form>

        {/* Password Form */}
        <motion.form
          onSubmit={handlePasswordSubmit}
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">Update Password</h2>
          <hr className="mb-10" />

          <div>
            <Label className="mb-2">New Password</Label>
            <Input type="password" name="password" value={passwords.password} onChange={handlePasswordChange} />
          </div>

          <div>
            <Label className="mb-2">Confirm Password</Label>
            <Input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} />
          </div>

          <div className="flex justify-center sm:justify-end">
            <Button type="submit" className="w-full sm:w-auto px-6 py-2 text-base rounded-md bg-green-600 hover:bg-green-700" whileTap={{ scale: 0.95 }}>
              Update Password
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
}
