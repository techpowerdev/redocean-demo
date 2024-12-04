"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function PrintButton() {
  const [isClient, setIsClient] = useState(false);
  // ตรวจสอบให้แน่ใจว่าเราอยู่ใน client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Button
      className="print-button flex justify-center items-center gap-2 px-4 py-2 text-white rounded"
      onClick={handlePrint}
      disabled={!isClient} // ปิดปุ่มหากยังไม่ได้อยู่บน client-side
    >
      <Printer /> สั่งพิมพ์
    </Button>
  );
}
