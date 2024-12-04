import React from "react";
import { TicketX } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";

export default function NoOrder() {
  return (
    <EmptyState
      icon={TicketX}
      message="ไม่พบข้อมูลการสั่งซื้อ"
      link="/"
      linkText="เลือกดูสินค้า"
      linkIcon={<MdArrowBack />}
    />
  );
}
