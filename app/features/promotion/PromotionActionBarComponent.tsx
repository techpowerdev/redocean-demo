import React from "react";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PromotionActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      <Link href={"/admin/promotion/create"}>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มกิจกรรม
        </Button>
      </Link>
    </div>
  );
}
