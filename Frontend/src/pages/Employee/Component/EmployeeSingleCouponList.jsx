import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";
import { showErrorToast } from "@/lib/toastUtils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InfoItem from "@/pages/Admin/Coupon/InfoItem";

export default function EmployeeSingleCouponList() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/api/coupon/${id}`);
      setData(res.data);
    } catch (error) {
      showErrorToast("Failed to load coupon");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isExpired = data && new Date(data.expiryDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {loading ? (
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card>
      ) : data ? (
        <Card className="shadow-xl border rounded-2xl p-6 bg-background transition-all duration-300">
         <h2 className="text-4xl font-bold text-center mb-8">Coupon</h2>
          <CardHeader className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-semibold tracking-tight flex items-center gap-2">
                  {data.code}
                  <Badge variant={isExpired ? "destructive" : "default"}>
                    {isExpired ? "Expired" : "Active"}
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm max-w-prose">
                  {data.description || "No description provided."}
                </p>
              </div>
              <div>
                <Badge variant="outline" className="uppercase text-xs">
                  {data.type}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <InfoItem label="Discount">
              <span className="text-xl text-foreground font-semibold">
                {data.discountPercentage}%
              </span>
            </InfoItem>
            <InfoItem label="Amount">
              <span className="text-xl text-foreground font-semibold">${data.amount}</span>
            </InfoItem>
            <InfoItem label="Total Limit">{data.usageLimit}</InfoItem>
           <InfoItem label="Usage Count">{data.usedCount ?? 0}</InfoItem>
            <InfoItem label="Start Date">{formatDate(data.startDate)}</InfoItem>
            <InfoItem label="Expiry Date">
              <span className={isExpired ? "text-destructive" : ""}>
                {formatDate(data.expiryDate)}
              </span>
            </InfoItem>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground">No coupon data found.</p>
      )}
    </div>
  );
}

