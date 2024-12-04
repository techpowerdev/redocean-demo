import React from "react";
import { PackageX } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";

export default function EmptyCart() {
  return (
    <EmptyState
      icon={PackageX}
      message="ตะกร้าว่างเปล่า"
      link="/"
      linkText="เลือกดูสินค้า"
      linkIcon={<MdArrowBack />}
    />
  );
}
