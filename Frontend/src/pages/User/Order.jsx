import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCoins, FaBell, FaComment } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { GiStopwatch } from "react-icons/gi";
import api from '@/api/api';
import { Toaster } from 'sonner';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';

export default function Order() {
  const navigate = useNavigate();
  const { VideoId } = useParams();
  const [videoData, setVideoData] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [title, setTitle] = useState('');
  const [total, setTotal] = useState(1);
  const [orderType, setOrderType] = useState();
  const [videoUrl, setVideoUrl] = useState();

  const createOrder = async () => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_URL}/api/order/create`, { title, orderType, total, videoUrl });
      showSuccessToast(response?.data?.message);
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 2000);
    } catch (error) {
      showErrorToast(error.response?.data?.error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${VideoId}`);
        const data = await response.json();
        setVideoData(data);
        setTitle(data.title);
        setVideoUrl(data.url);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    const fetchCoinData = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/api/coin/all`);
        setCoinData(response.data); // single object
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchData();
    fetchCoinData();
  }, [VideoId]);

  const totalCoins = orderType && coinData?.[orderType] ? coinData[orderType] * Number(total) : 0;

  return (
    <section className="flex flex-col md:flex-row p-5 gap-10">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col lg:flex-row w-full justify-between gap-10">

        {/* Left Side - Video Details */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 px-2 lg:px-6"
        >
          <img
            src={VideoId ? `https://img.youtube.com/vi/${VideoId}/hqdefault.jpg` : ''}
            alt="YouTube Video Thumbnail"
            className="w-full rounded-lg object-cover"
          />
          <h2 className="text-md font-bold text-[#505050] py-2">{videoData.title}</h2>
          <h3 className="text-lg font-bold mb-2">Channel Details</h3>
          <hr />
          <div className="text-lg font-bold mt-5">
            Channel Name: <span className="text-[#505050]">{videoData.author_name}</span>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 px-2 lg:px-6"
        >
          <h2 className="font-bold text-2xl">Pay Coins</h2>
          <hr className="mt-5" />

          {/* Coin Cards */}
          <div className="flex flex-wrap justify-between gap-4 my-8">
            {[
              { label: 'Subscriber', icon: <FaBell className="text-red-500 mx-1" /> },
              { label: 'Likes', icon: <AiFillLike className="text-green-500 mx-1" /> },
              { label: 'Comment', icon: <FaComment className="text-blue-500 mx-1" /> },
              { label: 'Watch Minutes', icon: <GiStopwatch className="text-orange-500 mx-1" /> }
            ].map(({ label, icon }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center border border-gray-300 py-6 px-4 w-full sm:w-[48%] md:w-[47%] lg:w-[47%] rounded-lg"
              >
                <h4 className="flex items-center font-bold text-gray-600">
                  {icon} {label} {icon}
                </h4>
                <span className="flex items-center">
                  <FaCoins className="text-yellow-500 mx-1" /> {coinData?.[label] ?? 'N/A'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Form Controls */}
          <Label htmlFor="promotion" className="my-2 text-md">Select Promotion Type</Label>
          <Select onValueChange={(value) => setOrderType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Subscriber">Subscribers</SelectItem>
              <SelectItem value="Likes">Likes</SelectItem>
              <SelectItem value="Comment">Comments</SelectItem>
              <SelectItem value="Watch Minutes">Watch Minutes</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="link" className="my-2 text-md block">YouTube Video Link</Label>
          <Input
            type="text"
            name="link"
            value={videoUrl}
            disabled
            className="w-full"
          />

          <Label htmlFor="total" className="my-2 text-md block">Number Of Orders</Label>
          <Input
            type="number"
            name="total"
            min="1"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full"
          />

          {orderType && (
            <div className="mt-2 font-semibold text-lg text-gray-700">
              Total Coin Pay: <FaCoins className="inline text-yellow-500 mx-1" />
              {totalCoins}
            </div>
          )}

          <motion.div
            className="flex justify-between flex-col sm:flex-row gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              onClick={() => history.back()}
              className="w-full sm:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Back To My Videos
            </Button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={createOrder}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 transition"
              >
                Finish
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
