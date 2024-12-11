import React from "react";
import PromotionProductImage from "./PromotionProductImage";
import { PromotionActivityType } from "@/types/fetchTypes";
import { formatPrice } from "@/utils/formatPrice";
import {
  calculateDiscountedPrice,
  DiscountType,
} from "@/utils/calculateDiscountedPrice";

type Props = {
  PromotionActivity: PromotionActivityType;
};

export default function PromotionProductCard({ PromotionActivity }: Props) {
  // ดึงตัวเลือกทั้งหมดจาก variantOptions
  const optionsMap: Record<string, Set<string>> = {};

  PromotionActivity?.product.productVariants?.forEach((variant) => {
    Object.entries(variant.variantOptions).forEach(([key, value]) => {
      if (!optionsMap[key]) optionsMap[key] = new Set();
      optionsMap[key].add(value as string);
    });
  });

  // แปลง Set เป็น Array สำหรับการแสดงผล
  const options = Object.entries(optionsMap).map(([key, values]) => ({
    key,
    values: Array.from(values),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-5">
      <PromotionProductImage
        images={
          (
            PromotionActivity.product.productVariants
              ?.filter((variant) => variant.image !== null)
              .map((variant) => variant.image) || []
          ).length > 0
            ? PromotionActivity.product.productVariants
                ?.filter((variant) => variant.image !== null)
                .map((variant) => variant.image)
            : PromotionActivity.product?.image
            ? [PromotionActivity.product.image]
            : []
        }
      />
      <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
        <h1 className="text-xl">{PromotionActivity.product.name}</h1>
        {/* Display Price and Stock */}
        <>
          <p className="text-xl font-bold mb-2 line-through">
            {formatPrice(PromotionActivity.product.price)}
          </p>
          <div className="flex flex-col">
            <h1>เหลือเพียง</h1>
            {PromotionActivity.discountAmount && (
              <span className="text-lg text-green-500">
                {formatPrice(
                  calculateDiscountedPrice(
                    PromotionActivity.product.price,
                    PromotionActivity.discountAmount,
                    PromotionActivity.discountType as DiscountType
                  ).discountedPrice
                )}
              </span>
            )}
            {PromotionActivity.discountGroupAmount &&
            PromotionActivity.discountGroupAmount > 0 ? (
              <>
                <span className="p-2 text-xl">หรือ</span>
                <div className="flex gap-1 items-center">
                  <div className="text-2xl text-red-600 font-bold">
                    {formatPrice(
                      calculateDiscountedPrice(
                        PromotionActivity.product.price,
                        PromotionActivity.discountGroupAmount,
                        PromotionActivity.discountType as DiscountType
                      ).discountedPrice
                    )}
                  </div>
                  <div>{`(เมื่อมียอดสั่งซื้อครบ ${PromotionActivity.minimumPurchaseQuantity} ชิ้น)`}</div>
                </div>
              </>
            ) : null}
          </div>
        </>
        {/* ตัวเลือก */}
        {PromotionActivity.product.hasVariant &&
          options.map((option) => (
            <div key={option.key}>
              <h2>{option.key}</h2>
              <div className="flex gap-2 flex-wrap">
                {option.values.map((value) => (
                  <button
                    className="px-4 py-2 cursor-default border rounded-md text-gray-800 bg-white"
                    key={value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        <div>
          <label className="block font-semibold mb-1">รายละเอียด:</label>{" "}
          {PromotionActivity.product.description}
        </div>
      </div>
    </div>
  );
}
