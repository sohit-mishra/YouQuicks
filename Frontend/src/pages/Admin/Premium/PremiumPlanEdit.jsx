import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/api/api";
import { Toaster } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";

export default function PremiumPlanEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    planName: "",
    pricePerMonth: "",
    durationInMonths: "",
    monthlyCoins: "",
    maxVideoDuration: "",
    youtubeChannels: "",
    transactionCostReduction: "",
    prioritizedService: false,
    prioritizedTransactions: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/premium-services/detail/${id}`
        );
        setForm(response.data);
      } catch (error) {
        showErrorToast("Failed to load plan details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `${import.meta.env.VITE_API_URL}/api/premium-services/update/${id}`,
        form
      );
      showSuccessToast("Plan updated successfully!");
      setTimeout(()=>{
        navigate('/admin/premium-plan/')
      }, 1000)
    } catch (error) {
      showErrorToast("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Toaster richColors position="top-center" />
      <motion.div
        className="w-full max-w-xl bg-white/70 backdrop-blur-xl border border-red-200 shadow-[0px_0px_40px_10px_rgba(255,205,205,0.4)] rounded-2xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl text-center font-bold text-red-600">
          Edit Premium Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Plan Name" name="planName" value={form.planName} onChange={handleChange} />
          <Field label="Price Per Month" name="pricePerMonth" type="number" value={form.pricePerMonth} onChange={handleChange} />
          <Field label="Duration (Months)" name="durationInMonths" type="number" value={form.durationInMonths} onChange={handleChange} />
          <Field label="Monthly Coins" name="monthlyCoins" type="number" value={form.monthlyCoins} onChange={handleChange} />
          <Field label="Max Video Duration (mins)" name="maxVideoDuration" type="number" value={form.maxVideoDuration} onChange={handleChange} />
          <Field label="YouTube Channels" name="youtubeChannels" type="number" value={form.youtubeChannels} onChange={handleChange} />
          <Field label="Transaction Cost Reduction (%)" name="transactionCostReduction" type="number" value={form.transactionCostReduction} onChange={handleChange} />

          <CheckboxField
            label="Prioritized Service"
            name="prioritizedService"
            checked={form.prioritizedService}
            onChange={handleChange}
          />
          <CheckboxField
            label="Prioritized Transactions"
            name="prioritizedTransactions"
            checked={form.prioritizedTransactions}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full mt-4">
            Update Plan
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function CheckboxField({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Checkbox
        id={name}
        name={name}
        checked={checked}
        onCheckedChange={(val) =>
          onChange({
            target: {
              name,
              type: "checkbox",
              checked: val,
            },
          })
        }
        className="border-red-400 data-[state=checked]:bg-red-500"
      />
    </div>
  );
}
