"use client";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminAffiliateDashboard } from "@/services/affiliateServices";
import { GetAdminAffiliateDashboardResponse } from "@/types/affiliateTypes";
import { formatPrice } from "@/utils/formatPrice";
import { format, subDays } from "date-fns";
import { BanknoteArrowDown, Coins, Package, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AdminAffiliateTrendChart } from "@/app/features/affiliate/AdminAffiliateTrendChart";

type FormValues = {
  dateRange: {
    from: Date;
    to: Date;
  };
};

export default function AdminDashboard() {
  const [affiliateDashboard, setAffiliateDashboard] = useState<
    GetAdminAffiliateDashboardResponse["data"] | null
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
    const affiliateDashboard = await getAdminAffiliateDashboard({
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
        const affiliateDashboard = await getAdminAffiliateDashboard();
        if (affiliateDashboard) {
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
      {/* <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ภาพรวมระบบ Affiliate</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          ดาวน์โหลดรายงาน
        </Button>
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Affiliates ทั้งหมด
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliateDashboard?.affiliates}
            </div>
            {/* <p className="text-xs text-muted-foreground">+24 ในเดือนนี้</p> */}
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
              {affiliateDashboard?.totalAffiliateOrders}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +18.3% จากเดือนที่แล้ว
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
              +15.6% จากเดือนที่แล้ว
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              ค่าคอมมิชชั่นที่จ่าย
            </CardTitle>
            <BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(affiliateDashboard?.totalCommission || 0)}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              +12.4% จากเดือนที่แล้ว
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>ประสิทธิภาพรายเดือน</CardTitle>
            <CardDescription>แนวโน้มยอดขายและค่าคอมมิชชั่น</CardDescription>
          </CardHeader>
          <CardContent>
            {affiliateDashboard?.trend && (
              <AdminAffiliateTrendChart trend={affiliateDashboard.trend} />
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>5 อันดับ Affiliate ยอดเยี่ยม</CardTitle>
            <CardDescription>
              Affiliate ที่มีจำนวนคำสั่งซื้อมากที่สุด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliateDashboard?.topAffiliates.map((affiliate, i) => (
                <div
                  key={affiliate.affiliateId}
                  className="flex items-center gap-4"
                >
                  <Avatar>
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="Sofia Davis"
                    />
                    <AvatarFallback>{i + 1}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{`${affiliate.firstName} ${affiliate.lastName}`}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{affiliate.orderCount} ออเดอร์</span>
                    </div>
                  </div>
                  <div className="font-medium">
                    <span className="font-normal text-xs mx-4">
                      ค่าคอมมิชชั่น
                    </span>
                    {formatPrice(affiliate.totalRevenue || 0)}
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
