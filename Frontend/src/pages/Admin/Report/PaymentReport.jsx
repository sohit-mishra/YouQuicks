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
import { showErrorToast } from "@/lib/toastUtils";
import api from "@/api/api";

export default function PaymentReport() {
  const [groupBy, setGroupBy] = useState("month");
  const [rawData, setRawData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const chartContainer = useRef(null);

  // Fetch payment data based on groupBy
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/graph/payment-report?groupBy=${groupBy}`
        );
        setRawData(response.data);
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

  // Convert raw data into chartData
  useEffect(() => {
    if (!rawData || !rawData.data) return;

    setChartData({
      labels: rawData.labels,
      datasets: [
        {
          name: "Completed",
          values: rawData.data.completed,
          chartType: "bar",
        },
        {
          name: "Failed",
          values: rawData.data.failed,
          chartType: "bar",
        },
        {
          name: "Pending",
          values: rawData.data.pending,
          chartType: "bar",
        },
      ],
    });
  }, [rawData]);

  
  useEffect(() => {
    if (chartData && chartContainer.current) {
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(chartContainer.current, {
        title: "Payment Report",
        data: chartData,
        type: "bar",
        height: 300,
        colors: ["#22c55e", "#ef4444", "#f59e0b"], 
      });
    }
  }, [chartData]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Payment Report</h2>

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
