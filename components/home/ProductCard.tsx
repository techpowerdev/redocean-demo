"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import ProductImage from "./ProductImage";
import SetColor from "./SetColor";
import SetQuantity from "./SetQuantity";
import { Button } from "../ui/button";
import { CartProductType, SelectedImgType } from "@/types/product";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
interface Props {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    images: Array<{ color: string; colorCode: string; image: string }>; // Assuming images are an array of objects with URL and alt text
    quantity?: number; // Quantity should be a number
    price: number;
  };
}

export default function ProductCard({ product }: Props) {
  const { user } = useUser();

  // If you need to define a type
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] }, // Set the initial image as index 0 first
    quantity: 1,
    price: product.price,
  });

  // useContext api
  const { cartProducts, handleAddProductToCart } = useCart();

  // State to handle the visibility of the 'Add to Cart' button
  const [isProductInCart, setIsProductInCart] = useState(false);

  // use for navigate to another page
  const router = useRouter();

  useEffect(() => {
    // hide add to cart button
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex(
        (item) => item.id === product.id
      );
      if (existingIndex > -1) {
        // show add to cart button
        setIsProductInCart(true);
      }
    }
  }, [cartProducts]); // run when cart items in local storage is changed

  // retrieve the highest rating
  // const productRating =
  //   product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
  //   product.reviews.length;

  const handleColorSelect = useCallback((value: SelectedImgType) => {
    setCartProduct((prev) => {
      return { ...prev, selectedImg: value }; // set new selectedImg property only
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
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

  const handleAddToCart = (product: CartProductType) => {
    if (!user) {
      router.push("/login"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
    } else {
      handleAddProductToCart(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 my-5">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-y-4 w-full p-8">
        <h1 className="text-xl">{product.name}</h1>
        <p className="text-xl font-medium">{formatPrice(product.price)}</p>

        {/* <p className="flex items-center justify-start gap-2">
          <Rating value={productRating} readOnly /> {product.reviews.length}{" "}
          reviews
        </p> */}
        <hr />
        <p>{product.description}</p>
        <p className="font-medium">
          หมวดหมู่ : <span className="font-extralight">{product.category}</span>
        </p>
        <p className="font-medium">
          ยี่ห้อ : <span className="font-extralight">{product.brand}</span>
        </p>
        {/* <p className="text-primary font-medium">
          {product.inStock ? "มีสินค้า" : "สินค้าหมด"}
        </p> */}
        <hr className="w-full lg:w-1/2" />
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
          <div className="flex flex-col gap-4">
            <div className="font-medium">
              <SetColor
                cartProduct={cartProduct} // Pass the new product object that has only one image
                images={product.images} // Pass all the images in the old product object
                handleColorSelect={handleColorSelect} // Function to change the image in the cartProduct state
              />
            </div>
            <hr className="w-full lg:w-1/2" />
            <SetQuantity
              // cartCounter={true} // if you don't need to show "QUANTITY :"
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Button
              size={"lg"}
              className="w-full lg:w-1/2 bg-primary text-lg"
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
