import React, { useEffect, useState } from "react";
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
import { showErrorToast } from "@/lib/toastUtils";
import api from "@/api/api";

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

export default function EmployeeDashboard() {
  const [data ,setData] = useState();

  useEffect(()=>{
    const fetchGraph = async()=>{
      try {
        const res =  await api.get(`${import.meta.env.VITE_API_URL}/api/employee-grapgh/dashboard`);
        setData(res.data);
        console.log(res.data);
      } catch (error) {
        showErrorToast("Failed to fetch order list.");
      }
    }

    fetchGraph();
  },[])
  

  const employeeStatusData = {
    labels: data?.coinandsubscription.labels,
    datasets: [
      {
        label: "Payment Coin and Payment Subscription",
        data: data?.coinandsubscription.data,
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const contactStatusData = {
    labels: data?.contactusStatus.labels,
    datasets: [
      {
        label: "Contact Tickets",
        data: data?.contactusStatus.data,
        backgroundColor: ["#3b82f6", "#f97316"],
        borderWidth: 1,
      },
    ],
  };

  const userDistributionData = {
    labels: data?.userDistribution.labels,
    datasets: [
      {
        data: data?.userDistribution.data,
        backgroundColor: ["#4CAF50", "#FF9800"],
        borderWidth: 1,
      },
    ],
  };

  const orderTrendData = {
    labels: data?.orderGraph.labels,
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
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <section className="p-4 md:p-6 bg-gray-100 min-h-screen">
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

      {/* 🔹 Employee & Contact Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <CardTitle className="mb-4">Payment Coin vs Payment Subscription</CardTitle>
          <div className="aspect-[2/1] w-full">
            <Bar data={employeeStatusData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="mb-4">Contact Status</CardTitle>
          <div className="aspect-[2/1] w-full">
            <Pie data={contactStatusData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* 🔹 User Distribution & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <CardTitle className="mb-4">User Distribution</CardTitle>
          <div className="relative w-full aspect-[2/1]">
            <Pie
              data={userDistributionData}
              options={chartOptions}
              className="absolute inset-0"
            />
          </div>
        </Card>

        <Card className="p-4">
          <CardTitle className="mb-4">Order Trends</CardTitle>
          <div className="relative w-full aspect-[2/1]">
            <Line
              data={orderTrendData}
              options={chartOptions}
              className="absolute inset-0"
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
