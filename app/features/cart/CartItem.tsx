"use client";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SetProductQuantity from "./SetProductQuantity";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { Trash2 } from "lucide-react";
import { CartItemType } from "@/types/cartTypes";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const handleRemoveProductFromCart = useCartServerStore(
    (state) => state.handleRemoveProductFromCart
  );
  const handleCartQtyIncrease = useCartServerStore(
    (state) => state.handleCartQtyIncrease
  );
  const handleCartQtyDecrease = useCartServerStore(
    (state) => state.handleCartQtyDecrease
  );

  return (
    <div className="flex flex-col items-start gap-4 border-t-[1.5px] border-slate-200 py-4 ">
      <div className="w-full flex justify-between items-center">
        <div className="relative min-w-[70px] aspect-square">
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
        <div className="w-full flex gap-2 flex-wrap">
          <div>{item.name}</div>

          <div>{item.variantOptions && `${item.variantOptions}`}</div>
        </div>

        <Button
          className="bg-white text-primary border-2 rounded-full w-9 h-9 hover:text-white"
          onClick={() => handleRemoveProductFromCart(item.id)}
        >
          <Trash2 />
        </Button>
      </div>

      {item.discount > 0 ? (
        <div className="flex flex-col gap-2 text-sm">
          <span className="line-through text-red-500">
            {formatPrice(item.unitPrice)}
          </span>
          <span className="text-slate-500">
            ส่วนลด {formatPrice(item.discount)}
          </span>
          <span className="text-green-500">
            เหลือเพียง {formatPrice(item.unitPrice - item.discount)}
          </span>
        </div>
      ) : (
        <span>{formatPrice(item.unitPrice)}</span>
      )}
      {item.warningMessage && (
        <span className="text-sm text-primary">{item.warningMessage}</span>
      )}
      <div className="w-full grid grid-cols-2">
        <div className="flex justify-center">
          <SetProductQuantity
            cartCounter={true}
            cartProduct={item}
            handleQtyDecrease={() => handleCartQtyDecrease(item.id, 1)}
            handleQtyIncrease={() => handleCartQtyIncrease(item.id, 1)}
          />
        </div>
        <div className="text-end">
          {formatPrice(
            item.unitPrice * item.quantity - item.discount * item.quantity
          )}
        </div>
      </div>
    </div>
  );
}
