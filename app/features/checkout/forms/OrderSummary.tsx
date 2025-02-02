"use client";

import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { formatPrice } from "@/utils/formatPrice";
import React from "react";

type OrderSummary = {
  items: {
    productId: string;
    sku: string;
    name: string;
    description: string;
    variantOptions: string;
    image: string;
    promotionActivityId?: string | null;
    promotionType?: string | null;
    unitPrice: number;
    quantity: number;
    discount: number;
    discountedPrice: number;
    total: number;
    warningMessage?: string | null;
    isAvailableStock: boolean;
  }[];
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
};

type Props = {
  orderData: OrderSummary;
};

export default function OrderSummary({ orderData }: Props) {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">สรุปรายการสั่งซื้อ</h1>

      <div className="p-2 border rounded-sm">
        {orderData.items.map((item) => {
          return (
            <div key={item.productId}>
              <div className="grid grid-cols-[20%_2fr_1fr]">
                <div className="w-full h-fit">
                  {item.image && (
                    <ResponsiveImage
                      alt={`productImage`}
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOST_URL + item.image
                      }`}
                    />
                  )}
                </div>
                <div>
                  {item.name}
                  <div>{item.variantOptions}</div>
                  <div className="flex flex-col items-start mt-2">
                    <span className="text-green-500">
                      {formatPrice(item.discountedPrice)}
                    </span>
                    <span className="line-through text-xs text-gray-300">
                      {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-end text-gray-500">
                    <span className="text-xs mx-1">x</span>
                    {item.quantity}
                  </div>

                  {/* <div className="text-end">รวม {item.total}</div> */}
                </div>
              </div>
              {item.warningMessage && (
                <div
                  className="text-center text-red-500 mt-4
                 text-xs font-semibold"
                >
                  ** {item.warningMessage}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-green-600 text-lg font-semibold text-center my-2">
        ยอดเงินที่ต้องชำระ : {formatPrice(orderData.netAmount)}
      </div>
    </div>
  );
}
