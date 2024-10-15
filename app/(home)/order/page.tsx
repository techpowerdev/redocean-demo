"use client";

import { useUser } from "@/hooks/useUser";
import { TicketX } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

export default function Order() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
    }
  }, [user, router]);
  return (
    <div>
      <div className="py-28 flex flex-col gap-2 items-center text-xl">
        <TicketX size={40} />
        ไม่พบข้อมูลการสั่งซื้อ
      </div>
    </div>
  );
}
