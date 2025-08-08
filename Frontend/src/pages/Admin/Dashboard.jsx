import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import api from '@/api/api';
import { useState } from "react";
import { showErrorToast } from "@/lib/toastUtils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

export default function Dashboard() {
  const [data,setData] = useState();

  const userPieData = {
    labels: data?.userPieData.labels,
    datasets: [
      {
        label: data?.userPieData.title,
        data: data?.userPieData.data,
        backgroundColor: ["#3b82f6", "#a855f7"],
        borderWidth: 1,
      },
    ],
  };

  const premiumUserPieData = {
    labels: data?.premiumUserData.labels,
    datasets: [
      {
        data: data?.premiumUserData.data ,
        backgroundColor: ["#4CAF50", "#FF9800", "#ce440dff","#200be2ff"],
        borderWidth: 1,
      },
    ],
  };

  const paymentLineData = {
    labels: data?.coinBuyUserData.labels,
    datasets: [
      {
        label: data?.coinBuyUserData.title,
        data:  data?.coinBuyUserData.data,
        fill: true,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ["Payment Coins", "Payments Subscription"],
    datasets: [
      {
        label: "Payment Coins ",
        data:  [data?.paymentgraph.coin, data?.paymentgraph.subscription],
        backgroundColor: ["#f59e0b", "#ef4444"],
      },
    ],
  };

  const employeeData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Employees",
        data: [data?.employeStatus.active, data?.employeStatus.noactive],
        backgroundColor: ["#22c55e", "#e11d48"],
      },
    ],
  };

  const orderTrendData = {
    labels: data?.orderGraph.label,
    datasets: [
      {
        label: "Orders",
        data: data?.orderGraph.data,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/graph/dashboard`
        );
        setData(response.data);
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

  return (
    <section className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {data?.summary.map((item) => (
          <Card key={item.title} className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-base text-gray-600">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <CardTitle className="mb-4">User Distribution</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-[1/1] w-full">
              <Pie data={userPieData} options={chartOptions} />
            </div>
            <div className="aspect-[1/1] w-full">
              <Pie data={premiumUserPieData} options={chartOptions} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="mb-4">Buy Coin</CardTitle>
          <div className="aspect-[2/1] w-full">
            <Line data={paymentLineData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <CardTitle className="mb-4">Payments Coins vs Payments Subscription</CardTitle>
          <div className="aspect-[2/1] w-full">
            <Bar data={barData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="mb-4">Employee Status</CardTitle>
          <div className="aspect-[2/1] w-full">
            <Bar data={employeeData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Line Chart for Orders */}
      <div className="grid grid-cols-1">
        <Card className="p-4">
          <CardTitle className="mb-4">Order Quantity</CardTitle>
          <div className="aspect-[3/1] w-full">
            <Line data={orderTrendData} options={chartOptions} />
          </div>
        </Card>
      </div>
    </section>
  );
}
