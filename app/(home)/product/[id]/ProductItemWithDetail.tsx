"use client";

import {
  ProductItem,
  ProductModel,
  PromotionActivity,
} from "@/types/baseTypes";
import React, { useCallback, useEffect, useState } from "react";
import ProductTitle from "./ProductTitle";
import ProductSelector from "./ProductSelector";
import AddToCartButton from "./AddToCartButton";
import ProductPrice from "./ProductPrice";
import toast from "react-hot-toast";
import SetProductQuantity from "./SetProductQuantity";
import { getProductModelById } from "@/services/productModelServices";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import PlaceOrder from "@/app/features/checkout/forms/PlaceOrder";
import ProductImageDisplay from "./ProductImageDisplay";
import ProductImageSelector from "./ProductImageSelector";
import { PromotionCountdown } from "@/app/features/promotion/PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";
import PromotionRules from "@/app/features/promotion/PromotionRules";

type Props = {
  product: ProductItem;
  promotionActivity?: PromotionActivity | null;
};
export default function ProductItemWithDetail({
  product,
  promotionActivity,
}: Props) {
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
  const [selectedProductImage, setSelectedProductImage] = useState<
    string | null
  >(product?.images?.[0] || null);

  const [buyProductData, setBuyProductData] = useState({
    productItemId: "",
    productModelId: "",
    quantity: 1,
    promotionId: promotionActivity?.promotionId || null,
    promotionType: promotionActivity?.promotion?.type || null,
    promotionActivityId: promotionActivity?.id || null,
  });

  const handleQtyIncrease = useCallback(async () => {
    if (selectedModel) {
      if (buyProductData.quantity + 1 > selectedModel.stock) {
        toast.error("จำนวนสินค้าไม่เพียงพอ");
        return;
      }
    }

    setBuyProductData((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [buyProductData.quantity, selectedModel]);

  const handleQtyDecrease = useCallback(() => {
    if (buyProductData.quantity === 1) {
      return;
    }

    setBuyProductData((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [buyProductData]);

  const modelImages = product?.models?.map((model) => model.image);

  useEffect(() => {
    const fetchData = async (productModelId: string) => {
      try {
        const response = await getProductModelById(productModelId);
        const productModel = response.data;
        if (productModel) {
          setBuyProductData((prev) => {
            return {
              ...prev,
              productItemId: productModel.productItemId,
              productModelId: productModel.id,
              quantity: 1,
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedModel) {
      fetchData(selectedModel?.id);
    } else {
      setBuyProductData((prev) => {
        return {
          ...prev,
          productItemId: "",
          productModelId: "",
          quantity: 1,
        };
      });
    }
  }, [selectedModel]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div>
            <ProductImageDisplay selectedProductImage={selectedProductImage} />
          </div>
          <div className="my-2">
            <ProductImageSelector
              images={[...(product.images ?? []), ...(modelImages ?? [])]
                .filter((img): img is string => typeof img === "string")
                .filter((img, idx, arr) => arr.indexOf(img) === idx)}
              selectedProductImage={selectedProductImage}
              setSelectedProductImage={setSelectedProductImage}
            />
          </div>
        </div>
        <div>
          <div>
            <ProductTitle
              productName={product.name}
              productDescription={product.description}
            />
          </div>
          <div className="my-4">
            <ProductPrice
              originalPrice={
                selectedModel?.originalPrice ||
                product.models?.[0].originalPrice ||
                0
              }
              discountedPrice={
                promotionActivity
                  ? calculateDiscountedPrice(
                      selectedModel?.originalPrice ||
                        product.models?.[0].originalPrice ||
                        0,
                      promotionActivity?.discountAmount || 0,
                      promotionActivity?.discountType || ""
                    ).discountedPrice
                  : undefined
              }
            />
          </div>
          {promotionActivity?.promotion && (
            <>
              <div className="my-4 w-full flex flex-col items-center gap-2 border border-gray-200">
                <h1
                  className={`w-full uppercase text-center text-white ${
                    promotionActivity.promotion.type === "flashsale"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                >
                  {promotionActivity.promotion.type === "flashsale"
                    ? "flash sale"
                    : "group buy"}
                </h1>
                <PromotionCountdown
                  startTime={formatDateTimePromotion(
                    promotionActivity?.promotion?.startAt
                  )}
                  endTime={formatDateTimePromotion(
                    promotionActivity?.promotion?.endAt
                  )}
                />
              </div>
              {promotionActivity.minimumPurchaseQuantity
                ? promotionActivity.minimumPurchaseQuantity > 0 && (
                    <PromotionRules
                      minimumPurchaseQuantity={
                        promotionActivity.minimumPurchaseQuantity
                      }
                    />
                  )
                : null}
            </>
          )}
          {/* <div className="my-4">โค้ดส่วนลด</div> */}
          <div>
            <ProductSelector
              setSelectedProductImage={setSelectedProductImage}
              tiers={product.tierVariations || []}
              models={product.models || []}
              onChange={setSelectedModel}
            />
          </div>
          <div className="my-4">
            <SetProductQuantity
              showLabelQuantity={false} // if you don't need to show "QUANTITY :"
              buyProductData={buyProductData}
              disable={!selectedModel ? true : false}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
          </div>
          {selectedModel ? (
            <div className="flex gap-2 items-center my-4">
              <span>มีสินค้าทั้งหมด</span>
              <span>{selectedModel.stock}</span>
              <span>ชิ้น</span>
            </div>
          ) : (
            <div className="my-4">
              {!selectedModel && (
                <p className="text-red-500">กรุณาเลือกตัวเลือกของสินค้าก่อน</p>
              )}
            </div>
          )}
          <div className="w-full sm:w-2/3">
            <AddToCartButton
              selectedModel={selectedModel}
              buyProductData={buyProductData}
            />
          </div>
          <PlaceOrder singleItem={selectedModel ? buyProductData : undefined} />
        </div>
      </div>
    </div>
  );
}
