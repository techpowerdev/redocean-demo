"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  calculateDiscountedPrice,
  DiscountType,
} from "@/utils/calculateDiscountedPrice";
import ProductImage from "@/app/features/product/ProductImages";
import SetProductQuantity from "@/app/features/product/SetProductQuantity";
import { searchProductVariant } from "@/services/productServices";
import ProductOptions from "@/app/features/product/ProductOptions";
import { VariantOption } from "@/types/baseTypes";
import { Product, PromotionActivity, Promotion } from "@/types/baseTypes";
import PlaceOrderCheckout from "@/app/features/checkout/forms/PlaceOrderCheckout";
import AddProductToCart from "@/app/features/product/AddProductToCart";
import PromotionRules from "@/app/features/promotion/PromotionRules";
interface Props {
  isActive: boolean;
  promotion: Promotion;
  promotionActivity: PromotionActivity;
  product: Product;
}

export type selectedVariantType = {
  id: string;
  productId: string;
  sku: string;
  variantOptions: VariantOption[];
  price: number;
  stock: number;
};

export default function PromotionProductCard({
  isActive,
  promotion,
  promotionActivity,
  product,
}: Props) {
  const productVariants = product.productVariants;
  const defaultOption = product.hasVariant
    ? productVariants?.[0]?.variantOptions
    : {};

  // local state
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | undefined>
  >(defaultOption || {});

  const handleResetOptions = () => {
    setSelectedOptions({});
  };

  const [selectedVariant, setSelectedVariant] =
    useState<selectedVariantType | null>(null);

  const [createOrderData, setCreateOrderData] = useState({
    productId: "",
    sku: "",
    quantity: 1,
    promotionActivityId: "",
    promotionType: "",
  });

  const handleQtyIncrease = useCallback(async () => {
    if (selectedVariant) {
      if (createOrderData.quantity + 1 > selectedVariant.stock) {
        toast.error("จำนวนสินค้าไม่เพียงพอ");
        return;
      }
    }

    setCreateOrderData((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [createOrderData.quantity, selectedVariant]);

  const handleQtyDecrease = useCallback(() => {
    if (createOrderData.quantity === 1) {
      return;
    }

    setCreateOrderData((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [createOrderData]);

  const handleOptionChange = (key: string, value: string | undefined) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchProductVariant(
          product.id,
          selectedOptions
        );
        const productVariant: selectedVariantType = response.data;

        if (productVariant) {
          setSelectedVariant(productVariant);
          setCreateOrderData({
            productId: product.id,
            sku: productVariant.sku,
            quantity: 1,
            promotionActivityId: promotionActivity.id,
            promotionType: promotion.type,
          });
        } else {
          setSelectedVariant(null);
          setCreateOrderData({
            productId: "",
            sku: "",
            quantity: 1,
            promotionActivityId: "",
            promotionType: "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [
    product.id,
    promotion.type,
    promotionActivity,
    promotionActivity.id,
    selectedOptions,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-5">
      <ProductImage
        product={product}
        variants={productVariants}
        selectedOption={selectedOptions}
      />

      <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        {/* Display Price and Stock */}
        {selectedVariant ? (
          <>
            {promotionActivity ? (
              <div className="flex flex-col">
                <p className="text-xl font-bold mb-2 line-through">
                  {formatPrice(selectedVariant.price)}
                </p>
                <h1>ลดเหลือเพียง</h1>
                {promotionActivity.discountAmount &&
                promotionActivity.discountAmount > 0 ? (
                  <span className="text-lg text-green-500">
                    {formatPrice(
                      calculateDiscountedPrice(
                        selectedVariant.price,
                        promotionActivity.discountAmount,
                        promotionActivity.discountType as DiscountType
                      ).discountedPrice
                    )}
                  </span>
                ) : null}
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold mb-2">
                  {formatPrice(selectedVariant.price)}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {promotionActivity ? (
              <div className="flex flex-col">
                <div>
                  <p className="text-xl font-bold mb-2 line-through">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <h1>ลดเหลือเพียง</h1>
                {promotionActivity.discountAmount &&
                promotionActivity.discountAmount > 0 ? (
                  <span className="text-lg text-green-500">
                    {formatPrice(
                      calculateDiscountedPrice(
                        product.price,
                        promotionActivity.discountAmount,
                        promotionActivity.discountType as DiscountType
                      ).discountedPrice
                    )}
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="text-xl font-bold mb-2">
                {formatPrice(product.price)}
              </p>
            )}
          </>
        )}

        {product.hasVariant && (
          <ProductOptions
            productVariants={productVariants}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
            handleResetOptions={handleResetOptions}
          />
        )}

        <div>
          <label className="block font-semibold mb-1">รายละเอียด:</label>{" "}
          {product.description}
        </div>

        <div className="w-full flex flex-col gap-4">
          <SetProductQuantity
            showLabelQuantity={false} // if you don't need to show "QUANTITY :"
            product={createOrderData}
            handleQtyIncrease={handleQtyIncrease}
            handleQtyDecrease={handleQtyDecrease}
          />
          <AddProductToCart
            isActive={isActive}
            product={createOrderData}
            stock={selectedVariant?.stock || 0}
          />
          {isActive && <PlaceOrderCheckout singleItem={createOrderData} />}
          {promotionActivity.minimumPurchaseQuantity
            ? promotionActivity.minimumPurchaseQuantity > 0 && (
                <PromotionRules
                  minimumPurchaseQuantity={
                    promotionActivity.minimumPurchaseQuantity
                  }
                />
              )
            : null}
        </div>
      </div>
    </div>
  );
}
