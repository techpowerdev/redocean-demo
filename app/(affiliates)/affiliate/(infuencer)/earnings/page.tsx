"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getAffiliateCommissionHistory,
  getAffiliateWithdrawHistory,
  getAffiliateWithdraw,
  getUserAffiliate,
} from "@/services/affiliateServices";
import {
  GetAffiliateCommissionHistoryResponse,
  GetAffiliateWithdrawHistoryResponse,
  GetAffiliateWithdrawResponse,
  GetUserAffiliateResponse,
} from "@/types/affiliateTypes";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { Coins, Landmark } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Earnings() {
  const [withdraw, setWithdraw] = useState<
    GetAffiliateWithdrawResponse["data"] | null
  >(null);

  const [affiliate, setAffiliate] = useState<
    GetUserAffiliateResponse["data"] | null
  >(null);

  const [withdrawHistory, setWithdrawHistory] = useState<
    GetAffiliateWithdrawHistoryResponse["data"]
  >([]);

  const [commissionHistory, setCommissionHistory] = useState<
    GetAffiliateCommissionHistoryResponse["data"]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const withdraw = await getAffiliateWithdraw();
        if (withdraw.data) {
          setWithdraw(withdraw.data);
        }
        const myAffiliate = await getUserAffiliate();
        if (myAffiliate.data) {
          setAffiliate(myAffiliate.data);
        }
        const withdrawHistory = await getAffiliateWithdrawHistory();
        if (withdrawHistory.data) {
          setWithdrawHistory(withdrawHistory.data);
        }
        const commissionHistory = await getAffiliateCommissionHistory();
        if (commissionHistory.data) {
          setCommissionHistory(commissionHistory.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">รายได้</h1>
        {/* <Button variant="outline">ดาวน์โหลดรายงาน</Button> */}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              ยอดเงินสะสมทั้งหมด
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(affiliate?.totalCommission || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ยอดเงินรอโอน</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(withdraw?.amount || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ประวัติรายได้</CardTitle>
            <CardDescription>
              รายได้ทั้งหมดของคุณจากโปรแกรม Affiliate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 p-3">
                {commissionHistory.map((commission) => (
                  <div key={commission.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-muted-foreground">
                        {`จ่ายเมื่อ ${formatDateTimePromotion(
                          commission.updatedAt
                        )}`}
                      </p>
                      <div className="font-medium">
                        {formatPrice(commission.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ประวัติการโอน</CardTitle>
            <CardDescription>รายการโอนเงินทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 p-3">
                {withdrawHistory.map((withdraw) => (
                  <div key={withdraw.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-muted-foreground">
                        {`โอนเมื่อ ${formatDateTimePromotion(
                          withdraw.processedAt || withdraw.updatedAt
                        )}`}
                      </p>
                      <div className="font-medium">
                        {formatPrice(withdraw.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
