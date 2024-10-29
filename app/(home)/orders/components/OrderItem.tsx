import { Button } from "@/components/ui/button";
import { CartProductType } from "@/types/product";
import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ItemContentProps {
  item: CartProductType;
}

export default function OrderItem({ item }: ItemContentProps) {
  const router = useRouter();
  return (
    <div
    // href={`/order/:id`}
    >
      <div className="border shadow-sm rounded-md px-2 pt-2 pb-3">
        <div className="flex justify-between items-center">
          <span className="text-[14px]">12/10/2024</span>
          <span className="text-[14px] font-bold text-green-600 border px-2 p-1 rounded-sm">
            สำเร็จ
          </span>
        </div>

        <Link href={"#"} className="mt-8 grid grid-cols-[20%_1fr]">
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="text-sm">
            <p>{truncateText(75, item.name)}</p>
            <div className="my-2 bg-gray-200 px-2 w-fit rounded-sm">
              {item.selectedImg.color}
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span>{formatPrice(item.price)}</span>
                <span>จำนวน : {item.quantity}</span>
              </div>
              <div className="mt-4 text-end">
                รวมทั้งสิ้น : {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          </div>
        </Link>
        <Button
          onClick={() => router.push(`/tracking/OB145069709TH`)}
          className="mt-2 rounded-md w-full text-end"
        >
          ติดตามพัสดุ
        </Button>
      </div>
    </div>
  );
}
