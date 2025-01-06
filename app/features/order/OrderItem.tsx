import { OrderItemType } from "@/types/orderTypes";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import React from "react";

interface ItemContentProps {
  item: OrderItemType;
}

export default function OrderItem({ item }: ItemContentProps) {
  return (
    <div className="mt-8 grid grid-cols-[20%_1fr]">
      <div className="relative w-[70px] aspect-square">
        <Image
          src={
            item?.image
              ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.image}`
              : "/no-image.png" // A fallback image path
          }
          alt={item?.name || "No image available"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="text-sm pl-2">
        <p className="font-semibold">{truncateText(75, item.name)}</p>
        <div className="my-2 bg-gray-200 px-2 w-fit rounded-sm">
          {item.variantOptions}
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <span className="line-through text-red-500">
                {formatPrice(item.unitPrice)}
              </span>
              <span className="text-green-500">
                {formatPrice(item.unitPrice - (item.discount || 0))}
              </span>
            </div>
            <span>จำนวน : {item.quantity}</span>
          </div>
          <div className="mt-4 text-end">รวม : {formatPrice(item.total)}</div>
        </div>
      </div>
    </div>
  );
}
