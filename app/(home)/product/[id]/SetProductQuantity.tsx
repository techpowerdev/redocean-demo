"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface SetQtyProps {
  showLabelQuantity?: boolean;
  disable: boolean;
  buyProductData: {
    productItemId: string;
    productModelId: string;
    quantity: number;
    promotionId: string | null;
    promotionType: string | null;
    promotionActivityId: string | null;
  };
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

export default function SetProductQuantity({
  showLabelQuantity,
  disable,
  buyProductData,
  handleQtyIncrease,
  handleQtyDecrease,
}: SetQtyProps) {
  return (
    <div className="w-full lg:w-1/2 flex gap-6 items-center">
      {showLabelQuantity ? null : <div className="font-medium">จำนวน :</div>}
      <div className="flex items-center text-base">
        <Button
          variant={"outline"}
          onClick={handleQtyDecrease}
          disabled={disable}
        >
          -
        </Button>
        <div
          className={clsx(
            "w-12 px-4 text-center",
            disable ? "text-gray-300" : "text-primary"
          )}
        >
          {buyProductData.quantity}
        </div>
        <Button
          variant={"outline"}
          onClick={handleQtyIncrease}
          disabled={disable}
        >
          +
        </Button>
      </div>
    </div>
  );
}
