import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "sonner";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import api from "@/api/api";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Coupon from "@/assets/Coupon.png";

export default function UpdateCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    amount: "",
    expiryDate: null,
    startDate: new Date(),
    usageLimit: 1,
    description: "",
    type: "",
  });

  useEffect(() => {
    if (id) {
      fetchCoupon();
    }
  }, [id]);

  const fetchCoupon = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/coupon/${id}`);
      const data = res.data;
      setFormData({
        code: data.code || "",
        discountPercentage: data.discountPercentage || "",
        amount: data.amount || "",
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        usageLimit: data.usageLimit || 1,
        description: data.description || "",
        type: data.type || "",
      });
    } catch (error) {
      showErrorToast("Failed to load coupon");
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || (!formData.discountPercentage && !formData.amount)) {
      showErrorToast("Coupon code and either discount or amount are required.");
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await api.put(`${import.meta.env.VITE_API_URL}/api/coupon/${id}`, formData);
        showSuccessToast("Coupon updated successfully!");
      } else {
        await api.post(`${import.meta.env.VITE_API_URL}/api/coupon`, formData);
        showSuccessToast("Coupon created successfully!");
      }
      navigate("/admin/coupons");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-100 px-4">
      <Toaster />
      <div className="w-full max-w-xl rounded-2xl shadow-xl border bg-white">
        <Card className="shadow-lg border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">
              {id ? "Update Coupon" : "Create a New Coupon"}
            </CardTitle>
            <img
              src={Coupon}
              alt="Coupon illustration"
              className="w-full h-auto max-h-20 object-contain mx-auto"
            />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
              <div>
                <Label htmlFor="code" className="text-black mb-1">Coupon Code</Label>
                <Input
                  name="code"
                  id="code"
                  value={formData.code.toUpperCase()}
                  onChange={handleChange}
                  placeholder="Coupon Code"
                  className="uppercase"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-black mb-1">Coupon Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                    <SelectItem value="FLAT">FLAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountPercentage" className="text-black mb-1">Discount (%)</Label>
                <Input
                  type="number"
                  name="discountPercentage"
                  id="discountPercentage"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="Discount Percentage"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-black mb-1">Discount Amount (₹)</Label>
                <Input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Discount Amount"
                />
              </div>

              <div>
                <Label className="text-black  mb-1">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(new Date(formData.startDate), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, startDate: date })
                      }
                      initialFocus
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-black  mb-1">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate
                        ? format(new Date(formData.expiryDate), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) =>
                        setFormData({ ...formData, expiryDate: date })
                      }
                      initialFocus
                      disabled={(date) =>
                        formData.startDate
                          ? date <
                            new Date(formData.startDate).setHours(0, 0, 0, 0)
                          : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="usageLimit" className="text-black mb-1">Usage Limit</Label>
                <Input
                  type="number"
                  name="usageLimit"
                  id="usageLimit"
                  min="1"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="Maximum Number of Uses"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-black mb-1">Description</Label>
                <Textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="resize-none"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg bg-black text-white hover:bg-neutral-800 transition-all shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      {id ? "Updating..." : "Creating Coupon..."}
                    </span>
                  ) : (
                    id ? "Update Coupon" : "Create Coupon"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
