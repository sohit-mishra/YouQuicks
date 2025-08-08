import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import axios from 'axios';
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


export default function Premium() {
   const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/premium-services/all`);
          setPlans(response.data);
        } catch (error) {
          console.error("Error fetching premium plans:", error);
        }
      };
  
      fetchData();
    }, []);
  
  
    const handleBuyNow = (id) => {
      navigate('/user/premium_payment', { state: { plansId: id } });
    };
    
  return (
    <section className="py-10 mt-10 bg-gray-50 px-4 sm:px-6 lg:px-8">
    <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">
      Get Your Youquicks Subscription Today!
    </h2>
  
    {plans?.length === 0 ? (
      <p className="text-center py-18 text-gray-500">
        No premium plans available at the moment.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 custom:grid-cols-3 gap-10 my-20 px-4 max-w-screen-xl mx-auto text-center justify-items-center">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: index * 0.2, ease: 'easeOut' }}
            className={`bg-white w-72 p-6 rounded-lg ${
              plan.free
                ? 'shadow-[0px_0px_50px_10px_#98efd6] border-2 border-[#0abb87]'
                : 'shadow-[0px_0px_50px_10px_rgb(255,205,205)]'
            }`}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              {plan.planName || 'Unnamed Plan'}
            </h3>
  
            <ul className="text-gray-700 space-y-2 mb-6 text-center text-sm">
              <li><strong>YouTube Channels:</strong> {plan.youtubeChannels ?? 0}</li>
              <li><strong>Max Video Duration:</strong> {plan.maxVideoDuration ?? 0} sec</li>
              <li><strong>Monthly Coins:</strong> {plan.monthlyCoins ?? 0}</li>
              <li><strong>Prioritized Transactions:</strong> {plan.prioritizedTransactions ? 'Yes' : 'No'}</li>
              <li><strong>Cost Reduction:</strong> {plan.transactionCostReduction ?? 0}%</li>
              <li><strong>Price Per Month:</strong> ${plan.pricePerMonth ?? 0}</li>
              <li><strong>Duration:</strong> {plan.durationInMonths ?? 1} month(s)</li>
            </ul>
  
            <h4 className="text-xl sm:text-2xl font-bold mb-4">
              <sup className="text-base">$</sup>
              {plan.pricePerMonth ?? 0}
              <span className="text-base"> /Month</span>
            </h4>
  
            {plan.planName?.toLowerCase() === 'free' ? (
              <button className="bg-gray-300 text-gray-700 py-2 px-4 sm:px-6 rounded cursor-not-allowed">
                Selected
              </button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 sm:px-6 rounded transition">
                    Buy Now
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to purchase the <strong>{plan.planName}</strong> plan for <strong>${plan.pricePerMonth}/month</strong>. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleBuyNow(plan._id)}
                      >
                        Confirm Purchase
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </motion.div>
        ))}
      </div>
    )}
  </section>
  )
}
