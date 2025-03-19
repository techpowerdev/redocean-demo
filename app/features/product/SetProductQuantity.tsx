"use client";

import { Button } from "@/components/ui/button";
import { AddProductToCardParam } from "@/types/cartTypes";

interface SetQtyProps {
  showLabelQuantity?: boolean;
  product: AddProductToCardParam;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

export default function SetProductQuantity({
  showLabelQuantity,
  product,
  handleQtyIncrease,
  handleQtyDecrease,
}: SetQtyProps) {
  return (
    <div className="w-full lg:w-1/2 flex gap-6 items-center">
      {showLabelQuantity ? null : <div className="font-medium">จำนวน :</div>}
      <div className="flex items-center text-base">
        <Button variant={"outline"} onClick={handleQtyDecrease}>
          -
        </Button>
        <div className="w-12 px-4 text-center">{product.quantity}</div>
        <Button variant={"outline"} onClick={handleQtyIncrease}>
          +
        </Button>
      </div>
    </div>
  );
}
