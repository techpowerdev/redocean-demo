"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  CartProductType,
  useCartProductStore,
} from "@/state-stores/cartProductStore";
import SetProductQuantity from "./SetProductQuantity";
import {
  ProductType,
  ProductVariantType,
  PromotionActivityType,
  PromotionType,
} from "@/types/fetchTypes";
import PromotionProductImage from "./PromotionProductImage";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import toast from "react-hot-toast";
import {
  calculateDiscountedPrice,
  DiscountType,
} from "@/utils/calculateDiscountedPrice";
// import { getProductVariantStock } from "@/actions/productServices";
interface Props {
  promotion: PromotionType;
  promotionActivity: PromotionActivityType;
  product: ProductType;
  productVariants: ProductVariantType[] | null | undefined;
}

export default function GroupBuyPromotionProductCard({
  promotion,
  promotionActivity,
  product,
  productVariants,
}: Props) {
  // global states
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const cartProducts = useCartProductStore((state) => state.cartProducts);
  const addProductsToCart = useCartProductStore(
    (state) => state.addProductsToCart
  );

  // local states
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantType | null>(null);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const [cartProduct, setCartProduct] = useState<CartProductType>({
    productId: product.id,
    productVariantId: productVariants?.[0]?.id || "",
    promotionType: promotion.type,
    promotionId: promotion.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    sku: productVariants?.[0]?.sku || "",
    color: productVariants?.[0]?.color || "",
    size: productVariants?.[0]?.size || "",
    image: productVariants?.[0]?.image || "",
    quantity: 1,
    unitPrice: productVariants?.[0]?.price || 0,
    discount: null,
    stock: productVariants?.[0]?.stock || 0,
  });

  useEffect(() => {
    // hide add to cart button
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.productVariantId === cartProduct.productVariantId
      );
      if (existingIndex > -1) {
        // show add to cart button
        setIsProductInCart(true);
      }
    }
  }, [cartProduct, cartProducts]); // run when cart items in local storage is changed

  // หาสีและขนาดที่มีอยู่
  const availableColors = Array.from(
    new Set(product.productVariants?.map((variant) => variant.color))
  );

  const allAvailableSizes = Array.from(
    new Set(product.productVariants?.map((variant) => variant.size))
  );

  const availableSizes = Array.from(
    new Set(
      product.productVariants
        ?.filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size)
    )
  );

  useEffect(() => {
    const variant = product.productVariants?.find(
      (variant) =>
        variant.color === selectedColor && variant.size === selectedSize
    );
    setSelectedVariant(variant || null);

    if (variant) {
      const updateCartData = {
        productVariantId: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        image:
          variant.image ||
          product.image ||
          product.productVariants?.[0].image ||
          "",
        // unitPrice: variant.price,
        unitPrice: calculateDiscountedPrice(
          variant.price,
          promotionActivity?.discountAmount ||
            promotionActivity?.discountGroupAmount ||
            0,
          promotionActivity.discountType as DiscountType
        ).discountedPrice,
        stock: variant.stock,
      };
      setCartProduct({ ...cartProduct, ...updateCartData });
    }
  }, [selectedColor, selectedSize]);

  const handleQtyIncrease = useCallback(async () => {
    // const stock = await getProductVariantStock(selectedColor, selectedSize);
    if (cartProduct.quantity + 1 > 99) {
      toast.error("จำนวนสินค้าไม่เพียงพอ");
      return;
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct]);

  const handleAddToCart = async (product: CartProductType) => {
    if (!currentUser) {
      router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
      return;
    }
    // if (!currentUser.phoneVerified) {
    //   router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
    //   return;
    // }

    if (!selectedColor) {
      return toast.error("กรุณาเลือกสี");
    }

    if (!selectedSize) {
      return toast.error("กรุณาเลือกขนาด");
    }

    // if (!selectedVariant) {
    //   return toast.error("กรุณาเลือกตัวเลือกสินค้า");
    // }

    // fetch stock and check available
    // const stock = await getProductVariantStock(cartProduct.productVariantId);
    // if (cartProduct.quantity > stock) {
    //   toast.error("จำนวนสินค้าไม่เพียงพอ");
    //   return;
    // }
    addProductsToCart([product]);
    setSelectedColor("");
    setSelectedSize("");
    setSelectedVariant(null);

    setTimeout(() => {
      toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
      router.push("/cart");
    }, 600);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const productVariant = await getProductVariantStock(
  //       selectedColor,
  //       selectedSize
  //     );
  //     if (cartProduct.quantity + 1 > productVariant.data) {
  //       toast.error("จำนวนสินค้าไม่เพียงพอ");
  //       return;
  //     }
  //   };
  //   fetchData();
  // }, [selectedColor, selectedSize]);
  const [isEventTime, setIsEventTime] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(promotion.startAt);
    const endDate = new Date(promotion.endAt);

    // คำนวณเวลาที่เหลือ (มิลลิวินาที)
    const timeUntilStart = startDate.getTime() - now.getTime();
    const timeUntilEnd = endDate.getTime() - now.getTime();

    // ตรวจสอบสถานะเริ่มต้น
    if (timeUntilStart > 0) {
      setIsEventTime(false); // ยังไม่ถึงเวลาเริ่ม
      setTimeout(() => setIsEventTime(true), timeUntilStart); // อัปเดตเมื่อถึงเวลาเริ่ม
    } else if (timeUntilEnd > 0) {
      setIsEventTime(true); // กำลังอยู่ในช่วงกิจกรรม
      setTimeout(() => setIsEventTime(false), timeUntilEnd); // อัปเดตเมื่อกิจกรรมสิ้นสุด
    } else {
      setIsEventTime(false); // กิจกรรมสิ้นสุดแล้ว
    }
  }, [promotion.startAt, promotion.endAt]);
  console.log(
    productVariants
      ?.map((variant) => variant.image)
      .filter((item) => item !== null)
  );

  const getImages: string[] =
    productVariants
      ?.map((variant) => variant.image)
      .filter((item) => item !== null) || [];

  const images =
    getImages.length > 0 ? getImages : product?.image ? [product.image] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-5">
      <PromotionProductImage
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
      />

      <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
        <h1 className="text-xl">{product.name}</h1>
        {/* Display Price and Stock */}
        {selectedVariant ? (
          <>
            <p className="text-xl font-bold mb-2 line-through">
              {formatPrice(selectedVariant.price)}
            </p>
            <div className="flex flex-col">
              <h1>เหลือเพียง</h1>
              {promotionActivity.discountAmount && (
                <span className="text-lg text-green-500">
                  {formatPrice(
                    calculateDiscountedPrice(
                      selectedVariant.price,
                      promotionActivity.discountAmount,
                      promotionActivity.discountType as DiscountType
                    ).discountedPrice
                  )}
                </span>
              )}

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
          </>
        ) : (
          <>
            <p className="text-xl font-bold mb-2 line-through">
              {formatPrice(product.price)}
            </p>
            <div className="flex flex-col">
              <h1>เหลือเพียง</h1>
              {promotionActivity.discountAmount && (
                <span className="text-lg text-green-500">
                  {formatPrice(
                    calculateDiscountedPrice(
                      product.price,
                      promotionActivity.discountAmount,
                      promotionActivity.discountType as DiscountType
                    ).discountedPrice
                  )}
                </span>
              )}
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
          </>
        )}
        {/* <p className="text-xl font-medium">
          {formatPrice(cartProduct.unitPrice)}
        </p> */}

        {/* Color Picker */}
        <div className="mb-2">
          <label className="block font-semibold mb-1">เลือกสี:</label>
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`py-2 px-4 rounded ${
                  selectedColor === color
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Size Picker */}
        {selectedColor ? (
          <div className="mb-2">
            <label className="block font-semibold mb-1">เลือกขนาด:</label>
            <div className="flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 rounded ${
                    selectedSize === size
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <label className="block font-semibold mb-1">เลือกขนาด:</label>
            <div className="flex gap-2">
              {allAvailableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 rounded ${
                    selectedSize === size
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* <p className="font-medium">
          หมวดหมู่ : <span className="font-extralight">{event.category}</span>
        </p>
        <p className="font-medium">
          ยี่ห้อ : <span className="font-extralight">{event.brand}</span>
        </p> */}
        {/* <p className="text-primary font-medium">
          {event.inStock ? "มีสินค้า" : "สินค้าหมด"}
        </p> */}
        {/* <hr className="w-full lg:w-1/2" /> */}
        <div>
          <label className="block font-semibold mb-1">รายละเอียด:</label>{" "}
          {product.description}
        </div>

        {isProductInCart ? (
          <div>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle className="text-teal-400" size={20} />
              <span>เพิ่มสินค้าในตะกร้าแล้ว</span>
            </p>
            <Button
              size={"lg"}
              className="w-full lg:w-1/2 bg-primary text-lg"
              onClick={() => router.push("/cart")}
            >
              ดูตะกร้าสินค้า
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="font-medium">
              {/* <SetColor
                cartProduct={cartProduct} // Pass the new product object that has only one image
                images={product.images} // Pass all the images in the old product object
                handleColorSelect={handleColorSelect} // Function to change the image in the cartProduct state
              /> */}
            </div>
            {/* <hr className="w-full lg:w-1/2" /> */}
            <SetProductQuantity
              // cartCounter={true} // if you don't need to show "QUANTITY :"
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />

            <Button
              size={"lg"}
              className="w-full lg:w-1/2 bg-primary text-lg"
              disabled={!isEventTime}
              onClick={() => handleAddToCart(cartProduct)}
            >
              เพิ่มสินค้าลงตะกร้า
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// version2
// "use client";

// import { formatPrice } from "@/utils/formatPrice";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";
// import { MdCheckCircle } from "react-icons/md";
// import { Button } from "../../../../components/ui/button";
// import {
//   CartProductType,
//   useCartProductStore,
// } from "@/state-stores/cartProductStore";
// import SetProductQuantity from "./SetProductQuantity";
// import {
//   ProductType,
//   ProductVariantType,
//   PromotionActivityType,
//   PromotionType,
// } from "@/types/fetchTypes";
// import PromotionProductImage from "./PromotionProductImage";
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import toast from "react-hot-toast";
// import { getProductVariantStock } from "@/actions/productServices";
// interface Props {
//   promotion: PromotionType;
//   promotionActivity: PromotionActivityType;
//   product: ProductType;
//   productVariants: ProductVariantType[] | null | undefined;
// }

// export default function GroupBuyPromotionProductCard({
//   promotion,
//   promotionActivity,
//   product,
//   productVariants,
// }: Props) {
//   // global states
//   const currentUser = useCurrentUserStore((state) => state.currentUser);
//   const cartProducts = useCartProductStore((state) => state.cartProducts);
//   const addProductsToCart = useCartProductStore(
//     (state) => state.addProductsToCart
//   );

//   // local states
//   const router = useRouter();
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [variantStock, setVariantStock] = useState<number>(0);
//   const [selectedVariant, setSelectedVariant] =
//     useState<ProductVariantType | null>(null);
//   const [isProductInCart, setIsProductInCart] = useState(false);

//   const [cartProduct, setCartProduct] = useState<CartProductType>({
//     productId: product.id,
//     productVariantId: productVariants ? productVariants[0].id : "",
//     promotionType: promotion.type,
//     promotionId: promotion.id,
//     sku: product.sku,
//     name: product.name,
//     description: product.description,
//     sku: productVariants ? productVariants[0].sku : "",
//     color: productVariants ? productVariants[0].color : "",
//     size: productVariants ? productVariants[0].size : "",
//     image: productVariants ? productVariants[0].image : "",
//     quantity: 1,
//     unitPrice: productVariants ? productVariants[0].price : 0,
//     discount: null,
//     stock: productVariants ? productVariants[0].stock : 0,
//   });

//   useEffect(() => {
//     // hide add to cart button
//     setIsProductInCart(false);
//     if (cartProducts) {
//       const existingIndex = cartProducts.findIndex(
//         (item) => item.productVariantId === cartProduct.productVariantId
//       );
//       if (existingIndex > -1) {
//         // show add to cart button
//         setIsProductInCart(true);
//       }
//     }
//   }, [cartProduct, cartProducts]); // run when cart items in local storage is changed

//   // หาสีและขนาดที่มีอยู่
//   const availableColors = Array.from(
//     new Set(product.productVariants?.map((variant) => variant.color))
//   );

//   const availableSizes = Array.from(
//     new Set(product.productVariants?.map((variant) => variant.size))
//   );

//   // useEffect(() => {
//   //   const variant = product.productVariants?.find(
//   //     (variant) =>
//   //       variant.color === selectedColor && variant.size === selectedSize
//   //   );
//   //   setSelectedVariant(variant || null);

//   //   if (variant) {
//   //     const updateCartData = {
//   //       productVariantId: variant.id,
//   //       sku: variant.sku,
//   //       color: variant.color,
//   //       size: variant.size,
//   //       image: variant.image,
//   //       unitPrice: variant.price,
//   //       stock: variant.stock,
//   //     };
//   //     setCartProduct({ ...cartProduct, ...updateCartData });
//   //   }
//   // }, [selectedColor, selectedSize, product.productVariants, cartProduct]);

//   const handleQtyIncrease = useCallback(async () => {
//     // const stock = await getProductVariantStock(selectedColor, selectedSize);
//     // if (cartProduct.quantity + 1 > stock) {
//     //   toast.error("จำนวนสินค้าไม่เพียงพอ");
//     //   return;
//     // }

//     setCartProduct((prev) => {
//       return { ...prev, quantity: prev.quantity + 1 };
//     });
//   }, [cartProduct]);

//   const handleQtyDecrease = useCallback(() => {
//     if (cartProduct.quantity === 1) {
//       return;
//     }

//     setCartProduct((prev) => {
//       return { ...prev, quantity: prev.quantity - 1 };
//     });
//   }, [cartProduct]);

//   const handleAddToCart = async (product: CartProductType) => {
//     if (!currentUser) {
//       router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
//       toast.error("กรุณาเชื่อมต่อไลน์");
//       return;
//     }
//     // if (!currentUser.phoneVerified) {
//     //   router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
//     //   return;
//     // }

//     if (availableColors.length > 0 && !selectedColor) {
//       return alert("กรุณาเลือกสี");
//     }

//     if (availableSizes.length > 0 && !selectedSize) {
//       return alert("กรุณาเลือกขนาด");
//     }

//     // fetch stock and check available
//     // const stock = await getProductVariantStock(cartProduct.productVariantId);
//     if (cartProduct.quantity > variantStock) {
//       toast.error("จำนวนสินค้าไม่เพียงพอ");
//       return;
//     }
//     addProductsToCart([product]);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const productVariant = await getProductVariantStock(
//         product.id,
//         selectedColor || "",
//         selectedSize || ""
//       );
//       console.log("productVariant", productVariant);
//       if (productVariant) {
//         console.log(productVariant.id);
//         setVariantStock(productVariant.stock);
//       } else {
//         console.log("product not found");
//       }
//     };
//     fetchData();
//   }, [selectedColor, selectedSize]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 my-5">
//       <PromotionProductImage
//         images={productVariants?.map((product) => product.image) || []}
//       />
//       <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
//         <h1 className="text-xl">{product.name}</h1>
//         {/* Display Price and Stock */}
//         {selectedVariant ? (
//           <>
//             <p className="text-xl font-bold mb-2 line-through">
//               {formatPrice(selectedVariant.price)}
//             </p>
//             <div className="flex flex-col items-center space-x-2">
//               <h1>เหลือเพียง</h1>
//               {promotionActivity.discountAmount && (
//                 <span className="text-lg text-green-500">
//                   {formatPrice(
//                     selectedVariant.price - promotionActivity.discountAmount
//                   )}
//                 </span>
//               )}
//               <span className="p-1 text-xl">หรือ</span>
//               {promotionActivity.discountGroupAmount && (
//                 <span className="text-2xl text-red-600 font-bold">
//                   {formatPrice(
//                     selectedVariant.price - promotionActivity.discountGroupAmount
//                   )}
//                 </span>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="text-xl font-bold mb-2 line-through">
//               {formatPrice(product.price)}
//             </p>
//             <div className="flex flex-col">
//               <h1>เหลือเพียง</h1>
//               {promotionActivity.discountAmount && (
//                 <span className="text-lg text-green-500">
//                   {formatPrice(
//                     product.price - promotionActivity.discountAmount
//                   )}
//                 </span>
//               )}
//               <span className="p-2 text-xl">หรือ</span>
//               {promotionActivity.discountGroupAmount && (
//                 <div className="flex gap-1 items-center">
//                   <div className="text-2xl text-red-600 font-bold">
//                     {formatPrice(
//                       product.price - promotionActivity.discountGroupAmount
//                     )}
//                   </div>
//                   <div>{`(เมื่อมียอดสั่งซื้อครบ ${promotionActivity.minimumPurchaseQuantity} ชิ้น)`}</div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//         {/* <p className="text-xl font-medium">
//           {formatPrice(cartProduct.unitPrice)}
//         </p> */}

//         {/* Color Picker */}
//         <div className="mb-2">
//           <label className="block font-semibold mb-1">เลือกสี:</label>
//           <div className="flex gap-2">
//             {availableColors.map((color) => (
//               <button
//                 key={color}
//                 onClick={() => setSelectedColor(color)}
//                 className={`py-2 px-4 rounded ${
//                   selectedColor === color
//                     ? "bg-gray-700 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Size Picker */}
//         <div className="mb-2">
//           <label className="block font-semibold mb-1">เลือกขนาด:</label>
//           <div className="flex gap-2">
//             {availableSizes.map((size) => (
//               <button
//                 key={size}
//                 onClick={() => setSelectedSize(size)}
//                 className={`py-2 px-4 rounded ${
//                   selectedSize === size
//                     ? "bg-gray-700 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </div>
//         <p>{product.description}</p>
//         {isProductInCart ? (
//           <div>
//             <p className="mb-2 text-slate-500 flex items-center gap-1">
//               <MdCheckCircle className="text-teal-400" size={20} />
//               <span>เพิ่มสินค้าในตะกร้าแล้ว</span>
//             </p>
//             <Button
//               size={"lg"}
//               className="w-full lg:w-1/2 bg-primary text-lg"
//               onClick={() => router.push("/cart")}
//             >
//               ดูตะกร้าสินค้า
//             </Button>
//           </div>
//         ) : (
//           <div className="w-full flex flex-col gap-4">
//             {/* <hr className="w-full lg:w-1/2" /> */}
//             <SetProductQuantity
//               // cartCounter={true} // if you don't need to show "QUANTITY :"
//               cartProduct={cartProduct}
//               handleQtyIncrease={handleQtyIncrease}
//               handleQtyDecrease={handleQtyDecrease}
//             />
//             <Button
//               size={"lg"}
//               className="w-full lg:w-1/2 bg-primary text-lg"
//               onClick={() => handleAddToCart(cartProduct)}
//             >
//               เพิ่มสินค้าลงตะกร้า
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // version 2
// "use client";

// import { formatPrice } from "@/utils/formatPrice";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";
// import { MdCheckCircle } from "react-icons/md";
// import { Button } from "../../../../components/ui/button";
// import {
//   CartProductType,
//   useCartProductStore,
// } from "@/state-stores/cartProductStore";
// import SetProductQuantity from "./SetProductQuantity";
// import {
//   ProductType,
//   ProductVariantType,
//   PromotionActivityType,
//   PromotionType,
// } from "@/types/fetchTypes";
// import PromotionProductImage from "./PromotionProductImage";
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import toast from "react-hot-toast";
// import { getProductVariantStock } from "@/actions/productServices";

// interface Props {
//   promotion: PromotionType;
//   promotionActivity: PromotionActivityType;
//   product: ProductType;
//   productVariants: ProductVariantType[] | null | undefined;
// }

// export default function GroupBuyPromotionProductCard({
//   promotion,
//   promotionActivity,
//   product,
//   productVariants,
// }: Props) {
//   const currentUser = useCurrentUserStore((state) => state.currentUser);
//   const cartProducts = useCartProductStore((state) => state.cartProducts);
//   const addProductsToCart = useCartProductStore(
//     (state) => state.addProductsToCart
//   );

//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedVariant, setSelectedVariant] =
//     useState<ProductVariantType | null>(null);
//   const [isProductInCart, setIsProductInCart] = useState(false);
//   const [cartProduct, setCartProduct] = useState<CartProductType>({
//     productId: product.id,
//     productVariantId: productVariants ? productVariants[0]?.id : "",
//     promotionType: promotion.type,
//     promotionId: promotion.id,
//     sku: product.sku,
//     name: product.name,
//     description: product.description,
//     sku: productVariants ? productVariants[0]?.sku : "",
//     color: productVariants ? productVariants[0]?.color : "",
//     size: productVariants ? productVariants[0]?.size : "",
//     image: productVariants ? productVariants[0]?.image : "",
//     quantity: 1,
//     unitPrice: productVariants ? productVariants[0]?.price : 0,
//     discount: null,
//     stock: productVariants ? productVariants[0]?.stock : 0,
//   });

//   const router = useRouter();

//   useEffect(() => {
//     setIsProductInCart(false);
//     if (cartProducts) {
//       const existingIndex = cartProducts.findIndex(
//         (item) => item.productVariantId === cartProduct.productVariantId
//       );
//       if (existingIndex > -1) {
//         setIsProductInCart(true);
//       }
//     }
//   }, [cartProduct, cartProducts]);

//   const availableColors = Array.from(
//     new Set(product.productVariants?.map((variant) => variant.color))
//   );

//   const allAvailableSizes = Array.from(
//     new Set(product.productVariants?.map((variant) => variant.size))
//   );

//   const availableSizes = Array.from(
//     new Set(
//       product.productVariants
//         ?.filter((variant) => variant.color === selectedColor)
//         .map((variant) => variant.size)
//     )
//   );

//   useEffect(() => {
//     const variant = product.productVariants?.find(
//       (variant) =>
//         variant.color === selectedColor && variant.size === selectedSize
//     );
//     setSelectedVariant(variant || null);

//     if (variant) {
//       const updateCartData = {
//         productVariantId: variant.id,
//         sku: variant.sku,
//         color: variant.color,
//         size: variant.size,
//         image: variant.image,
//         unitPrice: variant.price,
//         stock: variant.stock,
//       };
//       setCartProduct({ ...cartProduct, ...updateCartData });
//     }
//   }, [selectedColor, selectedSize, product.productVariants, cartProduct]);

//   const handleQtyIncrease = useCallback(async () => {
//     const stock = await getProductVariantStock(cartProduct.productVariantId);
//     if (cartProduct.quantity + 1 > stock) {
//       toast.error("จำนวนสินค้าไม่เพียงพอ");
//       return;
//     }
//     setCartProduct((prev) => {
//       return { ...prev, quantity: prev.quantity + 1 };
//     });
//   }, [cartProduct]);

//   const handleQtyDecrease = useCallback(() => {
//     if (cartProduct.quantity === 1) {
//       return;
//     }
//     setCartProduct((prev) => {
//       return { ...prev, quantity: prev.quantity - 1 };
//     });
//   }, [cartProduct]);

//   const handleAddToCart = async (product: CartProductType) => {
//     if (!currentUser) {
//       router.push("/login-line");
//       toast.error("กรุณาเชื่อมต่อไลน์");
//       return;
//     }

//     const stock = await getProductVariantStock(cartProduct.productVariantId);
//     if (cartProduct.quantity > stock) {
//       toast.error("จำนวนสินค้าไม่เพียงพอ");
//       return;
//     }
//     addProductsToCart([product]);
//   };

//   const isVariantOutOfStock = (color: string, size: string) => {
//     const variant = productVariants?.find(
//       (variant) => variant.color === color && variant.size === size
//     );
//     return variant ? variant.stock === 0 : true;
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 my-5">
//       <PromotionProductImage
//         images={productVariants?.map((product) => product.image) || []}
//       />
//       <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
//         <h1 className="text-xl">{product.name}</h1>
//         <p>{product.description}</p>

//         {selectedVariant ? (
//           <>
//             <p className="text-xl font-bold mb-2">
//               {formatPrice(selectedVariant.price)}
//             </p>
//           </>
//         ) : (
//           <>
//             <p className="text-xl font-bold mb-2">
//               {formatPrice(product.price)}
//             </p>
//           </>
//         )}

//         <div className="mb-2">
//           <label className="block font-semibold mb-1">เลือกสี:</label>
//           <div className="flex gap-2">
//             {availableColors.map((color) => (
//               <button
//                 key={color}
//                 onClick={() => setSelectedColor(color)}
//                 className={`py-2 px-4 rounded ${
//                   selectedColor === color
//                     ? "bg-gray-700 text-white"
//                     : "bg-gray-200"
//                 } ${
//                   isVariantOutOfStock(color, selectedSize || "")
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//                 disabled={isVariantOutOfStock(color, selectedSize || "")}
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </div>

//         {selectedColor ? (
//           <div className="mb-2">
//             <label className="block font-semibold mb-1">เลือกขนาด:</label>
//             <div className="flex gap-2">
//               {availableSizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`py-2 px-4 rounded ${
//                     selectedSize === size
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-200"
//                   } ${
//                     isVariantOutOfStock(selectedColor, size)
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   disabled={isVariantOutOfStock(selectedColor, size)}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="mb-2">
//             <label className="block font-semibold mb-1">เลือกขนาด:</label>
//             <div className="flex gap-2">
//               {allAvailableSizes.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`py-2 px-4 rounded ${
//                     selectedSize === size
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-200"
//                   } ${
//                     isVariantOutOfStock(selectedColor || "", size)
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                   disabled={isVariantOutOfStock(selectedColor || "", size)}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {isProductInCart ? (
//           <div>
//             <p className="mb-2 text-slate-500 flex items-center gap-1">
//               <MdCheckCircle className="text-teal-400" size={18} />{" "}
//               ในตะกร้าสินค้า
//             </p>
//             <SetProductQuantity
//               cartProduct={cartProduct}
//               handleQtyIncrease={handleQtyIncrease}
//               handleQtyDecrease={handleQtyDecrease}
//             />
//           </div>
//         ) : (
//           <Button
//             className="mt-3"
//             onClick={() => handleAddToCart(cartProduct)}
//             disabled={isVariantOutOfStock(
//               selectedColor || "",
//               selectedSize || ""
//             )}
//           >
//             เพิ่มไปยังตะกร้า
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }
