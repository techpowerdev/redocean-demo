"use client";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/utils/formatPrice";
import { Coins, ExternalLink, HandCoins, Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AffiliateTrendChart } from "../AffiliateTrendChart";
import Image from "next/image";
import { format, subDays } from "date-fns";
import { getAffiliateDashboard } from "@/services/affiliateServices";
import { GetAffiliateDashboardResponse } from "@/types/affiliateTypes";

type FormValues = {
  dateRange: {
    from: Date;
    to: Date;
  };
};

export default function Dashboard() {
  const [affiliateDashboard, setAffiliateDashboard] = useState<
    GetAffiliateDashboardResponse["data"] | null
  >(null);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dateRange: {
        from: subDays(new Date(), 29),
        to: new Date(),
      },
    },
  });

  const onDateSubmit = async (data: FormValues) => {
    const startDate = format(data.dateRange.from, "yyyy-MM-dd");
    const endDate = format(data.dateRange.to, "yyyy-MM-dd");
    const affiliateDashboard = await getAffiliateDashboard({
      startDate,
      endDate,
    });
    if (affiliateDashboard) {
      setAffiliateDashboard(affiliateDashboard.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const affiliateDashboard = await getAffiliateDashboard();
        if (affiliateDashboard.data) {
          setAffiliateDashboard(affiliateDashboard.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">ช่วงเวลาข้อมูล</h1>
        <form onSubmit={handleSubmit(onDateSubmit)} className="space-y-4">
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <DateRangePicker value={field.value} onChange={field.onChange} />
            )}
          />

          <Button type="submit" className="btn btn-primary">
            อัปเดตข้อมูล
          </Button>
        </form>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ภาพรวม</h1>
        {/* <div className="text-sm text-muted-foreground">
      อัพเดทล่าสุด: 27 เม.ย. 2023
    </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">รายได้ทั้งหมด</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(affiliateDashboard?.totalCommission || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">คลิกทั้งหมด</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliateDashboard?.clicks}
            </div>
            {/* <p className="text-xs text-muted-foreground">
          +15.3% จากเดือนที่แล้ว
        </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              จำนวนออเดอร์ทั้งหมด
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliateDashboard?.totalOrders}
            </div>
            {/* <p className="text-xs text-muted-foreground">
          +0.5% จากเดือนที่แล้ว
        </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ยอดขายทั้งหมด</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(affiliateDashboard?.totalSales || 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
          +18.7% จากเดือนที่แล้ว
        </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>ประสิทธิภาพรายเดือน</CardTitle>
            <CardDescription>แนวโน้มรายได้และคลิก</CardDescription>
          </CardHeader>
          <CardContent>
            {affiliateDashboard?.trend && (
              <AffiliateTrendChart trend={affiliateDashboard.trend} />
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>5 อันดับสินค้ายอดนิยม</CardTitle>
            <CardDescription>
              สินค้าที่มีจำนวนการสั่งซื้อมากที่สุด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliateDashboard?.topProducts.map((product) => (
                <div
                  key={product.productItemId}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded bg-muted/20 flex items-center justify-center">
                    {/* <Package className="h-6 w-6 text-muted-foreground" /> */}
                    <div className="relative w-12 h-12">
                      <Image
                        alt={`${product.productName}`}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${product.image}`}
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{product.productName}</p>
                    {/* <div className="flex items-center text-xs text-muted-foreground">
                  <span>
                    {formatPrice(product.totalRevenue)} |{" "}
                    {product.quantity} ยอดขาย
                  </span>
                </div> */}
                  </div>
                  <div className="font-medium">
                    {/* {formatPrice(product.totalRevenue)} */}
                    {product.quantity} ออเดอร์
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
