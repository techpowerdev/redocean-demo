"use client";

import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentFailed() {
  const router = useRouter();

  const backToCheckout = () => {
    router.back();
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="flex gap-2">
        <CircleX className="text-red-500" />
        <div>ชำระเงินไม่สำเร็จ</div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={backToCheckout}
          className="underline hover:text-primary"
        >
          กลับไปที่หน้าชำระเงิน
        </Button>
      </div>
    </div>
  );
}
