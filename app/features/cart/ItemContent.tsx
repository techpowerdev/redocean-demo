"use client";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CartProductType,
  useCartProductStore,
} from "@/state-stores/cartProductStore";
import SetProductQuantity from "../promotion/SetProductQuantity";

interface ItemContentProps {
  item: CartProductType;
}

export default function ItemContent({ item }: ItemContentProps) {
  const handleRemoveProductFromCart = useCartProductStore(
    (state) => state.handleRemoveProductFromCart
  );
  const handleCartQtyIncrease = useCartProductStore(
    (state) => state.handleCartQtyIncrease
  );
  const handleCartQtyDecrease = useCartProductStore(
    (state) => state.handleCartQtyDecrease
  );

  return (
    <div className="grid grid-cols-5 text-xs gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row justify-self-start gap-2 md:gap-4">
        <Link href={`/product/${item.productId}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={
                item?.image
                  ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.image}`
                  : "/no-image.png" // A fallback image path
              }
              alt={item?.name || "Product image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${item.productId}`}>
            {truncateText(60, item.name)}
            {", " + item.color}
            {", " + item.size}
          </Link>
          {/* <div>{item.selectedImg.color}</div> */}
          <div className="w-[70px]">
            <Button
              size={"sm"}
              variant={"link"}
              className="text-primary p-0 underline uppercase"
              onClick={() => handleRemoveProductFromCart(item)}
            >
              ลบออก
            </Button>
          </div>
        </div>
      </div>
      <div className="justify-self-center">{formatPrice(item.unitPrice)}</div>
      <div className="justify-self-center col-span-2 sm:col-span-1">
        <SetProductQuantity
          cartCounter={true}
          cartProduct={item}
          handleQtyIncrease={() => handleCartQtyIncrease(item)}
          handleQtyDecrease={() => handleCartQtyDecrease(item)}
        />
      </div>
      <div className="justify-self-end">
        {formatPrice(item.unitPrice * item.quantity)}
      </div>
    </div>
  );
}
