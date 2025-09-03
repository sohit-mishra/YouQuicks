import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCoins } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function BuyCoin() {
  const navigate = useNavigate();
  const [customCoins, setCustomCoins] = useState(2400);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [customBuyDialogOpen, setCustomBuyDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [defaultCoin, setDefaultCoin] = useState(2400);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePrice = (coins) => {
    return (coins / defaultCoin).toFixed(2);
  };

  const price = calculatePrice(customCoins);

  useEffect(()=>{

    const fetchData = async()=>{
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/api/coin/defaultcoin`);
        setDefaultCoin(res.data.coin);
        setCustomCoins(res.data.coin)
      } catch (error) {
        showErrorToast("Failed to coin");
      }
    }

    fetchData();

  },[])

  const handleConfirmPurchase = async (coins, price) => {
    if (coins < defaultCoin) {
      return showErrorToast(`Coins must be at least ${defaultCoin}`);
    }

    setIsLoading(true);

    try {
      if (paymentMethod === "stripe") {
        const res = await api.post(
          `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
          {
            name: `${coins} Coins`,
            price: parseFloat(price),
            quantity: 1,
          }
        );

        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: res.data.id });
      } else if (paymentMethod === "razorpay") {
        if (!window.Razorpay) {
          showErrorToast("Razorpay SDK not loaded");
          return;
        }

        const res = await api.post(
          `${import.meta.env.VITE_API_URL}/api/payment/create-razorpay-order`,
          { amount: price, coins }
        );

        const data = res.data;

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "YouQuicks",
          image: "/favicon.svg",
          description: `${coins} Coins`,
          order_id: data.id,
          handler: async function (response) {
            try {
              const verifyRes = await api.post(
                `${import.meta.env.VITE_API_URL}/api/payment/verify-razorpay-payment`,
                response
              );
              navigate(`/user/buycoins/payment`, {
                state: { id: verifyRes.data.id },
              });
            } catch (error) {
              console.error("Verification failed:", error);
              showErrorToast("Payment verification failed!");
            }
          },
          modal: {
            ondismiss: async function () {
              try {
                const failureRes = await api.post(
                  `${import.meta.env.VITE_API_URL}/api/payment/razorpay/failure`,
                  { razorpay_order_id: data.id }
                );
                navigate(`/user/buycoins/payment`, {
                  state: { id: failureRes.data.id },
                });
              } catch (error) {
                console.error("Failure report error:", error);
                showErrorToast("Failed to log payment failure.");
              }
            },
            escape: true,
            backdropclose: false,
          },
          theme: { color: "#fb2c36" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      setSelectedPackage(null);
      setCustomBuyDialogOpen(false);
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full mt-12 px-4 py-6 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mx-auto bg-white shadow-[0px_0px_16px_0px_rgb(173,173,173)] p-5"
      >
        <Toaster richColors position="top-center" />
        <h2 className="flex items-center gap-2 border-b border-gray-300 pb-2 text-xl font-semibold">
          <FaCoins className="text-yellow-500" /> Buy Coins
        </h2>

        <h3 className="mt-4 text-lg font-medium">Choose from Packages</h3>

        <div className="flex flex-wrap gap-4 my-6 p-5">
          {[5, 10, 25].map((multiplier, idx) => {
            const coins = defaultCoin * multiplier;
            const pkgPrice = multiplier;

            return (
              <div
                key={idx}
                className="w-[32%] min-w-[300px] mx-auto text-center p-5 rounded-md bg-white shadow-[0_0_25px_-5px_#adadad]"
              >
                <h3 className="text-xl text-yellow-500 font-semibold">
                  {coins.toLocaleString()} Coins
                </h3>
                <h4 className="text-2xl font-bold my-2 text-gray-600 mb-2">
                  ${pkgPrice}.00
                </h4>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600"
                      disabled={isLoading}
                      onClick={() => setSelectedPackage({ coins, price: pkgPrice })}
                    >
                      Buy Now
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to buy {coins.toLocaleString()} coins
                        for ${pkgPrice}.00?
                      </AlertDialogDescription>
                      <div className="mt-4">
                        <Label className="mb-1 block">Choose Payment Method:</Label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="stripe" disabled>
                            Stripe (disabled)
                          </option>
                          <option value="razorpay">Razorpay</option>
                        </select>
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isLoading}
                        onClick={() => handleConfirmPurchase(coins, pkgPrice)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-bold mb-3">
          Or Buy a Custom Amount - Save More When You Buy More!
        </h3>

        <Label htmlFor="buy_coin">Specify Coin</Label>
        <Input
          type="number"
          name="buy_coin"
          id="buy_coin"
          min={defaultCoin}
          value={customCoins}
          onChange={(e) => setCustomCoins(Number(e.target.value))}
          className="mt-1"
        />

        <AlertDialog open={customBuyDialogOpen} onOpenChange={setCustomBuyDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-red-500 text-white hover:bg-red-600 mt-4"
              disabled={isLoading || defaultCoin > customCoins}
            >
              Buy Now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to buy {customCoins.toLocaleString()} coins for $
                {price}?
              </AlertDialogDescription>
              <div className="mt-4">
                <Label className="mb-1 block">Choose Payment Method:</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="stripe" disabled>
                      Stripe (disabled)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                onClick={() => handleConfirmPurchase(customCoins,  Number(price))}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <h4 className="text-lg text-yellow-500 font-medium mt-4">
          ${price}{" "}
          <span className="text-lg text-green-500">
            (Base Rate ${price}) – Buy more, get bonus coins — save big and earn extra!
          </span>
        </h4>
      </motion.div>
    </section>
  );
}
