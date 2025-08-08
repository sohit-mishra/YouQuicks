import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/api";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import AddButton from "@/pages/Admin/Components/AddButton";

export default function Coin() {
  const [formData, setFormData] = useState({
    defaultCoin: "",
    subscribersCoinPay: "",
    subscribersCoinEarn: "",
    likesCoinPay: "",
    likesCoinEarn: "",
    commentsCoinPay: "",
    commentsCoinEarn: "",
    watchMinutesCoinPay: "",
    watchMinutesCoinEarn: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/coin/admin/all`
        );
        if (response?.data) {
          setFormData((prev) => ({
            ...prev,
            ...response.data,
          }));
        }
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
        `${import.meta.env.VITE_API_URL}/api/coin/update`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        showSuccessToast(response.data.message || "Coin updated successfully");
      }
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || error.message || "Submission failed."
      );
    }
  };

  const InputField = ({ label, name }) => (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type="number"
        value={formData[name]}
        onChange={handleChange}
        className="focus:ring-2 focus:ring-emerald-400 bg-gray-50 border border-gray-300"
        required
      />
    </div>
  );

  return (
    <section className="w-full min-h-screen px-4">
      <AddButton title="Coin Settings" />
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-gray-200"
      >
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-10">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-yellow-600 tracking-wide">
              Default Coin
              <span className="text-sm text-gray-500 font-normal ml-2">
                (Buy Coin value per $1)
              </span>
            </h3>
            <InputField label="Default Coin" name="defaultCoin" />
          </div>

          <div className="space-y-5">
            <h3 className="flex items-center text-xl font-semibold text-red-600">
              Pay Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Subscribers Coin Pay"
                name="subscribersCoinPay"
              />
              <InputField label="Likes Coin Pay" name="likesCoinPay" />
              <InputField label="Comments Coin Pay" name="commentsCoinPay" />
              <InputField
                label="Watch Minutes Coin Pay"
                name="watchMinutesCoinPay"
              />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="flex items-center text-xl font-semibold text-green-600">
              Earn Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Subscribers Coin Earn"
                name="subscribersCoinEarn"
              />
              <InputField label="Likes Coin Earn" name="likesCoinEarn" />
              <InputField label="Comments Coin Earn" name="commentsCoinEarn" />
              <InputField
                label="Watch Minutes Coin Earn"
                name="watchMinutesCoinEarn"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-semibold rounded-xl text-white mt-8 shadow-lg hover:shadow-2xl"
          >
            Update Coin Settings
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
