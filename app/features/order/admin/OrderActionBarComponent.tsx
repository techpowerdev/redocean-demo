import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import React from "react";

export default function OrderActionBarComponent() {
  return (
    <div>
      <Button className="flex justify-between items-center gap-2 px-2">
        <CirclePlus />
        เพิ่มสินค้า
      </Button>
    </div>
  );
}
