import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/api";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";

export default function PremiumPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const planId = location.state?.plansId;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    if (planId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/premium-services/detail/${planId}`
          );
          const fetchedPlan = response.data;
          setPlan(fetchedPlan);
        } catch (err) {
          setError("Failed to load plan or currency conversion.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setError("No plan ID provided.");
      setLoading(false);
    }
  }, [planId]);

  const handleRazorpay = async () => {
    try {
      const res = await api.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/create-razorpay-order-subscrption`,
        {
          id: plan._id,
          planName: plan.planName,
          pricePerMonth: plan.pricePerMonth,
          durationInMonths: plan.durationInMonths,
          monthlyCoins: plan.monthlyCoins,
          maxVideoDuration: plan.maxVideoDuration,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "YouQuicks Premium",
        image: "/favicon.svg",
        description: `Subscription: ${plan.planName}`,
        order_id: res.data.id,
        handler: function (response) {
          (async () => {
            try {
              const res = await api.post(
                `${
                  import.meta.env.VITE_API_URL
                }/api/payment/verify-razorpay-payment/scucess`,
                response
              );
              showSuccessToast("Payment Successful");
              setTimeout(() => {
                navigate("/user/dashboard");
              }, 1000);
              console.log("Payment verification result:", res.data);
            } catch (error) {
              console.error("Verification failed:", error);
              showErrorToast("Payment verification failed!");
            }
          })();
        },
        modal: {
          ondismiss: function () {
            (async () => {
              try {
                const failureRes = await api.post(
                  `${
                    import.meta.env.VITE_API_URL
                  }/api/payment/razorpay/sub/failure`,
                  {
                    razorpay_order_id: res.data.id, 
                  }
                );
                showErrorToast("Payment Failed");
                setTimeout(() => {
                  navigate("/user/dashboard");
                }, 1000);
              } catch (error) {
                console.error("Failure report error:", error);
              }
            })();
          },
          escape: true,
          backdropclose: false,
        },
        prefill: {
          name: userName,
          email: email,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment failed. Try again.");
      console.error(error);
    }
  };

  const handleStripe = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const totalAmount = plan.pricePerMonth * plan.durationInMonths;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/stripe`,
        {
          amount: totalAmount,
          name: userName,
          email: email,
          planName: plan.planName,
        }
      );

      const { sessionId } = res.data;
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert("Stripe payment failed.");
      console.error(error);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpay();
    } else {
      handleStripe();
    }
  };

  return (
    <section className="bg-gradient-to-br from-green-50 to-white py-12 mt-15">
      <Toaster richColors position="top-center" />
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              User Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Plan Details
            </h2>
            {plan && (
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Plan:</span> {plan.planName}
                </p>
                <p>
                  <span className="font-semibold">Price/Month:</span> $
                  {plan.pricePerMonth}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {plan.durationInMonths} month(s)
                </p>
                <p>
                  <span className="font-semibold">Monthly Coins:</span>{" "}
                  {plan.monthlyCoins}
                </p>
                <p>
                  <span className="font-semibold">Max Video Duration:</span>{" "}
                  {plan.maxVideoDuration} min
                </p>
                <p>
                  <span className="font-semibold">Channels Allowed:</span>{" "}
                  {plan.youtubeChannels}
                </p>
                <p>
                  <span className="font-semibold">Discount:</span>{" "}
                  {plan.transactionCostReduction}%
                </p>
                <p>
                  <span className="font-semibold">Priority TXNs:</span>{" "}
                  {plan.prioritizedTransactions ? "Yes" : "No"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Payment Summary
            </h3>
            {plan && (
              <>
                <p className="text-lg font-bold text-green-700 mb-2">
                  Total: $
                  {(
                    plan.pricePerMonth * plan.durationInMonths
                  ).toLocaleString()}
                </p>
                <div className="mb-4">
                  <Label htmlFor="paymentMethod">Choose Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    <SelectTrigger id="paymentMethod" className="mt-1 w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="stripe" disabled>
                        Stripe (disabled)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={!plan}
            className={`mt-2 w-full py-3 rounded-lg font-semibold transition-all text-white shadow ${
              plan
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Pay with {paymentMethod === "razorpay" ? "Razorpay" : "Stripe"}
          </button>
        </div>
      </div>
    </section>
  );
}
