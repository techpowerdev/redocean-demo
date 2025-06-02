"use client";

import {
  cancelAffiliateWithdrawPayout,
  createAffiliateWithdrawPayout,
  getAffiliateWithdrawById,
  getAffiliateWithdrawPayouts,
} from "@/services/affiliateServices";
import {
  GetAffiliateWithdrawByIdResponse,
  GetAffiliateWithdrawPayoutsResponse,
} from "@/types/affiliateTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

type Props = {
  params: { id: string };
};

export default function AffiliateWithdrawDetail({ params }: Props) {
  const [affiliateWithdraw, setAffiliateWithdraw] = useState<
    GetAffiliateWithdrawByIdResponse["data"] | null
  >(null);

  const [affiliateWithdrawPayouts, setAffiliateWithdrawPayouts] = useState<
    GetAffiliateWithdrawPayoutsResponse["data"]
  >([]);

  const router = useRouter();

  const { toast } = useToast();

  const handleCreateWithdrawPayout = async () => {
    try {
      if (!affiliateWithdraw?.id) {
        return;
      }

      await createAffiliateWithdrawPayout(affiliateWithdraw.id);

      toast({
        description: "สร้างรายการโอนเงินใหม่แล้ว",
      });

      // router.push("/affiliate/admin/payout-reports");
    } catch (error) {
      console.error("Error creating affiliate withdraw payout:", error);
      // Handle error, e.g., show a toast notification
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
    }
  };

  const handleCancelAffiliateWithdrawPayout = async (id: string) => {
    try {
      await cancelAffiliateWithdrawPayout(id);

      toast({
        description: `ส่งคำขอยกเลิกรายการโอนเงินแล้ว`,
      });

      router.push("/affiliate/admin/payout-reports");
    } catch (error) {
      console.error("Error cancelling affiliate withdraw payout:", error);
      // Handle error, e.g., show a toast notification
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const affiliateWithdraw = await getAffiliateWithdrawById(params.id);
      if (affiliateWithdraw.data) {
        setAffiliateWithdraw(affiliateWithdraw.data);
      }
      const affiliateWithdrawPayouts = await getAffiliateWithdrawPayouts(
        params.id
      );
      if (affiliateWithdrawPayouts.data) {
        setAffiliateWithdrawPayouts(affiliateWithdrawPayouts.data);
      }
    };

    fetch();
  }, [params.id]);

  return (
    <>
      {affiliateWithdraw ? (
        <div>
          {affiliateWithdraw.status === "rejected" && (
            <div className="flex justify-end items-center gap-2">
              <Button
                onClick={handleCreateWithdrawPayout}
                className="bg-green-500 text-white hover:bg-green-500/90 hover:text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                ลองโอนอีกครั้ง
              </Button>
            </div>
          )}
          <h1 className="my-2">สถานะ : {affiliateWithdraw.status}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">รายละเอียดข้อมูลคำขอถอนเงิน</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <div className="text-gray-500">จำนวนเงิน:</div>
                  <div>{formatPrice(affiliateWithdraw.amount || 0)}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">ชื่อบัญชี:</div>
                  <div>{affiliateWithdraw.accountHolderName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">ธนาคาร:</div>
                  <div>{affiliateWithdraw.bankName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">เลขที่บัญชี:</div>
                  <div>{affiliateWithdraw.accountNumber}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">channel code:</div>
                  <div>{affiliateWithdraw.channelCode}</div>
                </div>
              </div>
              <div className="relative w-60 h-44">
                <Image
                  alt="idCardImage"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${affiliateWithdraw.affiliate?.bookBankImage}`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">รายละเอียดการทำรายการโอนเงิน</h3>
              <div className="flex flex-col gap-4">
                {affiliateWithdrawPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex flex-col gap-2 text-sm border rounded-md p-2"
                  >
                    <div className="flex gap-2">
                      <div className="text-gray-500">จำนวนเงิน:</div>
                      <div>{formatPrice(payout.amount || 0)}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-gray-500">ชื่อบัญชี:</div>
                      <div>{payout.channelProperties.accountHolderName}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-gray-500">เลขที่บัญชี:</div>
                      <div>{payout.channelProperties.accountNumber}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-gray-500">channel code:</div>
                      <div>{payout.channelCode}</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-gray-500">สถานะ:</div>
                      <div>{payout.status}</div>
                    </div>
                    {payout.failureCode && (
                      <div className="flex gap-2">
                        <div className="font-semibold text-red-500">
                          เกิดข้อผิดพลาด:
                        </div>
                        <div>{payout.failureCode}</div>
                      </div>
                    )}
                    {payout.status === "ACCEPTED" && (
                      <Button
                        onClick={() =>
                          handleCancelAffiliateWithdrawPayout(payout.id)
                        }
                        className="w-full md:w-fit bg-red-500 text-white hover:bg-red-500/90 hover:text-white"
                      >
                        <X className="mr-2 h-4 w-4" />
                        ยกเลิกการโอนเงิน
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </>
  );
}
