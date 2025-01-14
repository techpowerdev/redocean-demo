"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useCallback, useEffect, useState } from "react";

// import { ProductType, VariantOption } from "@/types/fetchTypes";
import toast from "react-hot-toast";
import {
  calculateDiscountedPrice,
  DiscountType,
} from "@/utils/calculateDiscountedPrice";
import ProductImage from "./ProductImages";
import SetProductQuantity from "./SetProductQuantity";
import { searchProductVariant } from "@/services/productServices";
import ProductOptions from "./ProductOptions";
import AddProductToCart from "./AddProductToCart";
import {
  CartProductType,
  ProductType,
  VariantOption,
} from "@/types/productTypes";
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

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    productId: "",
    promotionActivityId: "",
    sku: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    specialDiscount: 0,
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
          promotionActivityId: promotionActivity?.id || "",
          sku: productVariant.sku,
          quantity: 1,
          unitPrice: productVariant.price,
          discount: promotionActivity
            ? calculateDiscountedPrice(
                productVariant?.price,
                promotionActivity?.discountAmount ||
                  promotionActivity?.discountGroupAmount ||
                  0,
                promotionActivity?.discountType as DiscountType
              ).discountAmount
            : 0,
        });
      } else {
        setSelectedVariant(null);
        setCartProduct({
          productId: "",
          promotionActivityId: "",
          sku: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
        });
      }
    };
    fetchData();
  }, [product.id, promotionActivity, promotionActivity?.id, selectedOptions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-5">
      {/* <ProductImage
        images={
          (
            productVariants
              ?.filter((variant) => variant.image !== null)
              .map((variant) => variant.image) || []
          ).length > 0
            ? productVariants
                ?.filter((variant) => variant.image !== null)
                .map((variant) => variant.image)
            : product?.image
            ? [product.image]
            : []
        }
        selectedVariantImage={selectedVariant?.image || null}
      /> */}
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

                {promotionActivity.discountGroupAmount &&
                promotionActivity.discountGroupAmount > 0 ? (
                  <>
                    <span className="p-2 text-xl">หรือ</span>
                    <div className="flex gap-1 items-center">
                      <div className="text-2xl text-red-600 font-bold">
                        {formatPrice(
                          calculateDiscountedPrice(
                            selectedVariant.price,
                            promotionActivity.discountGroupAmount,
                            promotionActivity.discountType as DiscountType
                          ).discountedPrice
                        )}
                      </div>
                      <div>{`(เมื่อมียอดสั่งซื้อครบ ${promotionActivity.minimumPurchaseQuantity} ชิ้น)`}</div>
                    </div>
                  </>
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
                {promotionActivity.discountGroupAmount &&
                promotionActivity.discountGroupAmount > 0 ? (
                  <>
                    <span className="p-2 text-xl">หรือ</span>
                    <div className="flex gap-1 items-center">
                      <div className="text-2xl text-red-600 font-bold">
                        {formatPrice(
                          calculateDiscountedPrice(
                            product.price,
                            promotionActivity.discountGroupAmount,
                            promotionActivity.discountType as DiscountType
                          ).discountedPrice
                        )}
                      </div>
                      <div>{`(เมื่อมียอดสั่งซื้อครบ ${promotionActivity.minimumPurchaseQuantity} ชิ้น)`}</div>
                    </div>
                  </>
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
