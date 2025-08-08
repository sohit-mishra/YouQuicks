import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtils";
import api from "@/api/api";

export default function OrderReport() {
  const [groupBy, setGroupBy] = useState("month");
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const chartContainer = useRef(null);

  // Fetch data when groupBy changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/graph/order-report?groupBy=${groupBy}`
        );
        setData(response.data);
        console.log("Fetched chart data:", response.data);
      } catch (error) {
        showErrorToast(
          error.response?.data?.message ||
            error.message ||
            "Error fetching data."
        );
      }
    };

    fetchData();
  }, [groupBy]);

  // Build chartData when raw data changes
  useEffect(() => {
    if (!data) return;

    setChartData({
      labels: data.labels,
      datasets: [
        {
          name: "Orders",
          values: data.data,
          chartType: "bar",
        },
      ],
    });
  }, [data]);

  // Render chart when chartData is ready
  useEffect(() => {
    if (chartData && chartContainer.current) {
      if (chartRef.current) chartRef.current.destroy(); // Destroy previous chart
      chartRef.current = new Chart(chartContainer.current, {
        title: "Order Status Report",
        data: chartData,
        type: "bar",
        height: 300,
        colors: ["#60a5fa"],
      });
    }
  }, [chartData]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Order Report</h2>

      <Card className="p-4 w-full max-w-sm">
        <label className="text-sm font-medium block mb-1">Group By</label>
        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card>
        <CardContent className="p-6">
          {chartData ? (
            <div ref={chartContainer} />
          ) : (
            <p className="text-muted-foreground text-sm">Loading chart...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
