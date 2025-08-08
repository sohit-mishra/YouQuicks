import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import api from "@/api/api";
import { showErrorToast } from "@/lib/toastUtils";

export default function ContactReport() {
  const [groupBy, setGroupBy] = useState("month");
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const chartContainer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/api/graph/contact-report?groupBy=${groupBy}`
        );

        const { labels, data } = response.data;

        setChartData({
          labels,
          datasets: [
            { name: "Open", values: data.open, chartType: "bar" },
            { name: "Closed", values: data.closed, chartType: "bar" },
          ],
        });
      } catch (error) {
        showErrorToast(
          error.response?.data?.message || error.message || "Error fetching data."
        );
      }
    };

    fetchData();
  }, [groupBy]);

  useEffect(() => {
    if (chartData && chartContainer.current) {
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(chartContainer.current, {
        title: "Contact Support Requests",
        data: chartData,
        type: "bar",
        height: 300,
        colors: ["#0ea5e9", "#f43f5e"],
      });
    }
  }, [chartData]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Contact Report</h2>

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
