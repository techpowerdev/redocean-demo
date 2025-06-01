"use client";

import { Button } from "@/components/ui/button";

interface SetQtyProps {
  showLabelQuantity?: boolean;
  quantity: number;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

export default function SetVoucherQuantity({
  showLabelQuantity = true,
  quantity,
  handleQtyIncrease,
  handleQtyDecrease,
}: SetQtyProps) {
  return (
    <div className="w-full flex gap-6 items-center justify-center my-1">
      {showLabelQuantity && <div className="font-medium">จำนวน :</div>}
      <div className="flex items-center text-base">
        <Button variant={"outline"} onClick={handleQtyDecrease}>
          -
        </Button>
        <div className="w-12 px-4 text-center">{quantity}</div>
        <Button variant={"outline"} onClick={handleQtyIncrease}>
          +
        </Button>
      </div>
    </div>
  );
}
