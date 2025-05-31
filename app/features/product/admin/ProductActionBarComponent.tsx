import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      <Link href={"/admin/product/create"}>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มสินค้า
        </Button>
      </Link>
    </div>
  );
}
