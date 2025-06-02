"use client";

import {
  approveAffiliate,
  getAffiliateById,
} from "@/services/affiliateServices";
import { GetAffiliateByIdResponse } from "@/types/affiliateTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RejectAffiliateForm } from "@/app/features/affiliate/forms/RejectAffiliateForm";

type Props = {
  params: { id: string };
};

export default function AffiliateDetail({ params }: Props) {
  const [affiliate, setAffiliate] = useState<
    GetAffiliateByIdResponse["data"] | null
  >(null);

  const router = useRouter();

  const { toast } = useToast();

  const handleApproveAffiliate = async () => {
    try {
      if (!affiliate) {
        return;
      }

      await approveAffiliate(affiliate.id, {
        status: "approved",
        rejectReason: null,
      });

      toast({
        title: "Affiliate อนุมัติแล้ว",
        description: `${affiliate?.firstName} ได้รับการอนุมัติเป็น Affiliate แล้ว`,
      });

      router.push("/affiliate/admin/affiliates");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectAffiliate = async (rejectReason: string) => {
    try {
      if (!affiliate) {
        return;
      }
      await approveAffiliate(affiliate.id, {
        status: "rejected",
        rejectReason,
      });

      toast({
        title: "Affiliate ถูกปฏิเสธ",
        description: `${affiliate?.firstName} ถูกปฏิเสธการเป็น Affiliate`,
      });

      router.push("/affiliate/admin/affiliates");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const affiliate = await getAffiliateById(params.id);
      if (affiliate.data) {
        setAffiliate(affiliate.data);
      }
    };

    fetch();
  }, [params.id]);

  return (
    <>
      {affiliate ? (
        <div>
          <div className="flex justify-end items-center gap-2">
            <Button
              onClick={handleApproveAffiliate}
              className="bg-green-500 text-white hover:bg-green-500/90 hover:text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              อนุมัติ
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-red-500 text-white hover:bg-red-500/90 hover:text-white">
                  <X className="mr-2 h-4 w-4" />
                  ปฏิเสธ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <RejectAffiliateForm onReject={handleRejectAffiliate} />
              </PopoverContent>
            </Popover>
          </div>
          <h1 className="my-2">สถานะ : {affiliate.status}</h1>
          {affiliate.rejectReason && (
            <p className="my-2 text-red-500">
              เหตุผลในการปฏิเสธ : {affiliate.rejectReason}
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">ข้อมูลส่วนตัว</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <div className="text-gray-500">ชื่อ-นามสกุล:</div>
                  <div>
                    {affiliate.firstName} {affiliate.lastName}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">อีเมล:</div>
                  <div>{affiliate.email}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">เบอร์โทรศัพท์:</div>
                  <div>{affiliate.phoneNumber || "-"}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">เลขประจำตัวประชาชน:</div>
                  <div>{affiliate.idCard || "-"}</div>
                </div>
              </div>
              <div className="relative w-60 h-44">
                <Image
                  alt="idCardImage"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${affiliate.idCardImage}`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">ข้อมูลการชำระเงิน</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <div className="text-gray-500">ชื่อบัญชี:</div>
                  <div>{affiliate.accountHolderName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">ธนาคาร:</div>
                  <div>{affiliate.bankName}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">เลขที่บัญชี:</div>
                  <div>{affiliate.accountNumber}</div>
                </div>
                <div className="flex gap-2">
                  <div className="text-gray-500">channel code:</div>
                  <div>{affiliate.channelCode}</div>
                </div>
              </div>
              <div className="relative w-60 h-44">
                <Image
                  alt="idCardImage"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${affiliate.bookBankImage}`}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
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
