import React, { useEffect, useState, useRef } from "react";
import AllRouter from "@/router/AllRouter";
import axios from "axios";

export default function App() {
  const [apiStatus, setApiStatus] = useState(null); // null = not checked yet
  const [progress, setProgress] = useState(0);

  const healthCheckRef = useRef(null);
  const progressRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/health`);
      if (res.status === 200) {
        setApiStatus(true);
        if (healthCheckRef.current) clearInterval(healthCheckRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
        setProgress(100);
      } else {
        setApiStatus(false);
      }
    } catch {
      setApiStatus(false);
    }
  };

  useEffect(() => {
    fetchData();

    healthCheckRef.current = setInterval(fetchData, 5000);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev < 99 ? prev + 0.05 : prev));
    }, 100);

    return () => {
      if (healthCheckRef.current) clearInterval(healthCheckRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  if (apiStatus === true) {
    return <AllRouter />;
  }

  if (apiStatus === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center w-80">
          <p className="text-xl font-semibold text-gray-700 mb-3">
            ⏳ Backend Server starting...
          </p>
          <p className="text-gray-500 mb-4">
            Please wait. Progress:{" "}
            <span className="font-bold">{progress.toFixed(1)}%</span>
          </p>
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-3 bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
