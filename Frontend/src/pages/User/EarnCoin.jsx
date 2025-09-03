import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaCoins } from "react-icons/fa";
import api from "@/api/api";

export default function EarnCoin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [btn, setBtn] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/order/next`);
      const result = res.data;

      if (result.order) {
        setData(result.order);
        setBtn(false);
        setTimerDone(false);
        setProgress(0);
        clearInterval(intervalRef.current);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!data) return;
    setVerifying(true);

    try {
      const res = await fetch(`/api/orders/${data._id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Task completed!");
        fetchTask();
      } else {
        const result = await res.json();
        alert(result.message || "Failed to verify task");
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleSkip = async () => {
    if (!data) return;

    try {
      const res = await fetch(`/api/orders/${data._id}/skip`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        fetchTask();
      } else {
        const result = await res.json();
        alert(result.message || "Failed to skip task");
      }
    } catch (err) {
      console.error("Skip error:", err);
    }
  };

  const handleTaskClick = (url) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer,width=800,height=600");
    setBtn(true);
    setTimerDone(false);
    setProgress(0);

    let value = 0;
    const step = 100 / 300; 

    intervalRef.current = setInterval(() => {
      value += step;
      setProgress(prev => {
        const newProgress = prev + step;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          setTimerDone(true);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  useEffect(() => {
    fetchTask();
    return () => clearInterval(intervalRef.current); 
  }, []);

  return (
    <section className="w-auto mx-10 my-15 p-6 bg-white rounded-lg shadow-[0_0_16px_0_rgb(173,173,173)]">
      <h2 className="text-2xl font-bold text-center mb-6">Earn Coins</h2>
      <hr />

      {loading ? (
        <div className="text-center mt-10 text-gray-600">
          <h4 className="text-lg font-semibold">Loading...</h4>
          <p className="text-sm">Please wait a moment</p>
          <Button className="mt-2">Loading</Button>
        </div>
      ) : !data ? (
        <div className="text-center flex items-center flex-col justify-center mt-10 text-gray-600 min-h-[400px]">
          <h4 className="text-lg font-semibold">No Tasks Available</h4>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-6 mt-10 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-6">
            Current Video:{" "}
            <span className="text-gray-500 font-normal">{data.title}</span>
          </h3>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <div
              className="bg-blue-500 h-4 transition-all duration-[100ms] ease-linear"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute right-2 top-0 flex items-center text-sm text-gray-600 h-4">
              <i className="fa-solid fa-clock mr-1"></i>{" "}
              <span>{Math.ceil(30 - (30 * progress) / 100)}s</span>
            </div>
          </div>

          {/* Task Types */}
          {(() => {
            const taskMap = {
              Subscribers: [{ label: "Subscribe to Channel" }],
              Likes: [{ label: "Like Video" }],
              Comments: [{ label: "Leave a Comment" }],
              "Watch Minutes": [{ label: "Watch a Video"}],
            };

            const tasks = taskMap[data.orderType] || [];

            return tasks.map(({ label, reward }, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-lg">{label}</h4>
                  <span className="text-yellow-500 flex items-center text-sm mt-1">
                    <FaCoins className="mr-2" /> {data.earnCoin} coin reward
                  </span>
                </div>
                <Button
                  className="shrink-0"
                  onClick={() => handleTaskClick(data.videoUrl)}
                  disabled={btn}
                >
                  Do Task
                </Button>
              </div>
            ));
          })()}

          {/* Action Buttons */}
          <div className="text-center mt-6">
            <Button
              onClick={handleVerify}
              disabled={verifying || !timerDone}
              className="relative"
            >
              {verifying ? (
                <>
                  Verifying...
                  <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                </>
              ) : (
                "Verify Action"
              )}
            </Button>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleSkip} disabled={!timerDone}>
              Skip
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={fetchTask}
              disabled={!timerDone}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
