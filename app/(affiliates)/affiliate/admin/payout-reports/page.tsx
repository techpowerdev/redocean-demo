"use client";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import SearchForm from "@/components/shared/SearchForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getAllAffiliateWithdraws,
  searchAffiliateWithdraws,
} from "@/services/affiliateServices";
import {
  GetAllAffiliateWithdrawsResponse,
  SearchAffiliateWithdrawsResponse,
} from "@/types/affiliateTypes";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { format, subDays } from "date-fns";
import { BanknoteArrowDown, HandCoins } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type FormValues = {
  dateRange: {
    from: Date;
    to: Date;
  };
};

export default function PayoutReports() {
  const [allAffiliateWithdraws, setAllAffiliateWithdraws] = useState<
    GetAllAffiliateWithdrawsResponse["data"]
  >([]);

  const [searchResults, setSearchResults] = useState<
    SearchAffiliateWithdrawsResponse["data"]
  >([]);

  const [affiliateWithdraws, setAffiliateWithdraws] = useState<
    SearchAffiliateWithdrawsResponse["data"]
  >([]);

  const { toast } = useToast();

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dateRange: {
        from: subDays(new Date(), 29),
        to: new Date(),
      },
    },
  });

  const handleSearch = async (keyword: string) => {
    try {
      const results = await searchAffiliateWithdraws({ keyword });
      if (results.data.length > 0) {
        setSearchResults(results.data);
      } else {
        toast({
          variant: "destructive",
          title: "ผลการค้นหา",
          description: "ไม่พบข้อมูล",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDateSubmit = async (data: FormValues) => {
    const startDate = format(data.dateRange.from, "yyyy-MM-dd");
    const endDate = format(data.dateRange.to, "yyyy-MM-dd");
    const affiliateWithdraws = await searchAffiliateWithdraws({
      startDate,
      endDate,
    });
    if (affiliateWithdraws.data) {
      setAffiliateWithdraws(affiliateWithdraws.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const affiliateWithdraws = await getAllAffiliateWithdraws();
        setAllAffiliateWithdraws(affiliateWithdraws.data);
        const preloadAffiliateWithdraws = await searchAffiliateWithdraws();
        setAffiliateWithdraws(preloadAffiliateWithdraws.data);
      } catch (error) {
        console.error("Error fetching affiliate withdraw data:", error);
      }
    };
    fetchData();
  }, []);

  const pendingWithdraws = allAffiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "pending"
  );

  const paidWithdraws = allAffiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "paid"
  );

  const totalPendingWithdraws = pendingWithdraws?.reduce(
    (total, withdraw) => total + withdraw.amount,
    0
  );

  const totalPaidWithdraws = paidWithdraws?.reduce(
    (total, withdraw) => total + withdraw.amount,
    0
  );

  const pendingAffiliateWithdraws = affiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "pending"
  );

  const processingAffiliateWithdraws = affiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "processing"
  );

  const paidAffiliateWithdraws = affiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "paid"
  );

  const rejectedAffiliateWithdraws = affiliateWithdraws?.filter(
    (withdraw) => withdraw.status === "rejected"
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">สรุปการจ่ายค่าคอมมิชชั่น</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              รวมคอมมิชชั่นที่ต้องจ่ายในรอบนี้
            </CardTitle>
            <BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalPendingWithdraws || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              รวมคอมมิชชั่นที่จ่ายไปแล้วทั้งหมด
            </CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalPaidWithdraws || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <h1 className="text-2xl font-bold mb-4">ประวัติการโอน</h1>
      <SearchForm
        onSearch={handleSearch}
        placeHolder="ค้นหาด้วยชื่อ หรือ อีเมล"
      />
      <div className="space-y-4">
        {searchResults?.length !== 0 && (
          <div>
            <div className="text-orange-500">ผลการค้นหา</div>
            <div className="text-gray-500 text-sm">
              รายการโอนเงินทั้งหมดที่พบ
            </div>
          </div>
        )}
        {searchResults?.map((withdraw) => (
          <div key={withdraw.id} className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="font-medium">
                    {formatPrice(withdraw.amount)}
                  </h1>
                  <h3 className="font-medium">{withdraw.accountHolderName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {withdraw.affiliate?.email}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                เมื่อ{" "}
                {formatDateTimePromotion(
                  withdraw.processedAt || withdraw.updatedAt
                )}
              </div>
              <Link
                href={`/affiliate/admin/payout-reports/${withdraw.id}`}
                className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
              >
                ดูรายละเอียด
              </Link>
            </div>
          </div>
        ))}
      </div>

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

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="w-full h-full grid gap-2 grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
          <TabsTrigger value="processing">กำลังดำเนินการ</TabsTrigger>
          <TabsTrigger value="paid">โอนสำเร็จ</TabsTrigger>
          <TabsTrigger value="rejected">โอนไม่สำเร็จ</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-500">
                รายการที่รอดำเนินการ ({pendingAffiliateWithdraws.length})
              </CardTitle>
              <CardDescription>
                รายการโอนเงินทั้งหมดที่รอการดำเนินการ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAffiliateWithdraws?.map((withdraw) => (
                  <div key={withdraw.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="font-medium">
                            {formatPrice(withdraw.amount)}
                          </h1>
                          <h3 className="font-medium">
                            {withdraw.accountHolderName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {withdraw.affiliate?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        เมื่อ{" "}
                        {formatDateTimePromotion(
                          withdraw.processedAt || withdraw.updatedAt
                        )}
                      </div>
                      <Link
                        href={`/affiliate/admin/payout-reports/${withdraw.id}`}
                        className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-500">
                รายการที่กำลังดำเนินการ ({processingAffiliateWithdraws.length})
              </CardTitle>
              <CardDescription>
                รายการโอนเงินทั้งหมดที่กำลังการดำเนินการ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingAffiliateWithdraws?.map((withdraw) => (
                  <div key={withdraw.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="font-medium">
                            {formatPrice(withdraw.amount)}
                          </h1>
                          <h3 className="font-medium">
                            {withdraw.accountHolderName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {withdraw.affiliate?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        เมื่อ{" "}
                        {formatDateTimePromotion(
                          withdraw.processedAt || withdraw.updatedAt
                        )}
                      </div>
                      <Link
                        href={`/affiliate/admin/payout-reports/${withdraw.id}`}
                        className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-500">
                รายการที่สำเร็จ ({paidAffiliateWithdraws.length})
              </CardTitle>
              <CardDescription>
                รายการโอนเงินทั้งหมดที่ทำรายการสำเร็จ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paidAffiliateWithdraws?.map((withdraw) => (
                  <div key={withdraw.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="font-medium">
                            {formatPrice(withdraw.amount)}
                          </h1>
                          <h3 className="font-medium">
                            {withdraw.accountHolderName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {withdraw.affiliate?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        เมื่อ{" "}
                        {formatDateTimePromotion(
                          withdraw.processedAt || withdraw.updatedAt
                        )}
                      </div>
                      <Link
                        href={`/affiliate/admin/payout-reports/${withdraw.id}`}
                        className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">
                รายการที่ไม่สำเร็จ ({rejectedAffiliateWithdraws.length})
              </CardTitle>
              <CardDescription>
                รายการโอนเงินทั้งหมดที่ทำรายการไม่สำเร็จ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedAffiliateWithdraws?.map((withdraw) => (
                  <div key={withdraw.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h1 className="font-medium">
                            {formatPrice(withdraw.amount)}
                          </h1>
                          <h3 className="font-medium">
                            {withdraw.accountHolderName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {withdraw.affiliate?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        เมื่อ{" "}
                        {formatDateTimePromotion(
                          withdraw.processedAt || withdraw.updatedAt
                        )}
                      </div>
                      <Link
                        href={`/affiliate/admin/payout-reports/${withdraw.id}`}
                        className="text-center text-xs font-medium border px-3 py-2 rounded-md hover:bg-gray-50"
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
