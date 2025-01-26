import { LucideCheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PaymentSuccess() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <div className="flex gap-2">
        <LucideCheckCircle className="text-green-500" />
        <div>ชำระเงินสำเร็จ</div>
      </div>
      <div className="flex gap-2">
        <Link href={"/"} className="underline hover:text-primary">
          เลือกดูสินค้า
        </Link>
        <span>หรือ</span>
        <Link href={"/orders"} className="underline hover:text-primary">
          ไปที่หน้าคำสั่งซื้อ
        </Link>
      </div>
    </div>
  );
}
