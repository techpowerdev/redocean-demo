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
import AddProductToCart from "@/app/features/product/AddProductToCart";
import {
  // CartProductType,
  ProductType,
  VariantOption,
} from "@/types/productTypes";
import { AddProductToCardInputType } from "@/types/cartTypes";
interface Props {
  product: ProductType;
}

export type selectedVariantType = {
  id: string;
  productId: string;
  sku: string;
  variantOptions: VariantOption[];
  price: number;
  stock: number;
};

export default function ProductCard({ product }: Props) {
  const productVariants = product.productVariants;
  const promotionActivity = product.promotionActivities?.[0];
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

  const [cartProduct, setCartProduct] = useState<AddProductToCardInputType>({
    productId: "",
    sku: "",
    quantity: 1,
    promotionActivityId: "",
  });

  const handleQtyIncrease = useCallback(async () => {
    if (selectedVariant) {
      if (cartProduct.quantity + 1 > selectedVariant.stock) {
        toast.error("จำนวนสินค้าไม่เพียงพอ");
        return;
      }
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct.quantity, selectedVariant]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct]);

  const handleOptionChange = (key: string, value: string | undefined) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await searchProductVariant(product.id, selectedOptions);
      const productVariant: selectedVariantType = response.data;
      console.log("productVariant::", productVariant);

      if (productVariant) {
        setSelectedVariant(productVariant);
        setCartProduct({
          productId: product.id,
          sku: productVariant.sku,
          quantity: 1,
          promotionActivityId: promotionActivity?.id || "",
        });
      } else {
        setSelectedVariant(null);
        setCartProduct({
          productId: "",
          sku: "",
          quantity: 1,
          promotionActivityId: "",
        });
      }
    };
    fetchData();
  }, [product.id, promotionActivity, promotionActivity?.id, selectedOptions]);

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
            cartCounter={false} // if you don't need to show "QUANTITY :"
            cartProduct={cartProduct}
            handleQtyIncrease={handleQtyIncrease}
            handleQtyDecrease={handleQtyDecrease}
          />
          <AddProductToCart
            product={cartProduct}
            stock={selectedVariant?.stock || 0}
          />
        </div>
      </div>
    </div>
  );
}
