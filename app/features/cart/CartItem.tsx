// "use client";

// import { Button } from "@/components/ui/button";
// import { CartProductType } from "@/state-stores/cartProductStore";
// import React from "react";

// type Props = {
//   item: CartProductType;
//   onRemove: (cartItemId: string) => Promise<void>;
//   onUpdateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
// };

// export default function CartItem({ item, onRemove, onUpdateQuantity }: Props) {
//   return (
//     <div className="cart-item">
//       <h3>{item.id}</h3>
//       <p>SKU: {item.sku}</p>
//       <p>Price: ${item.unitPrice}</p>
//       <p>Quantity: {item.quantity}</p>
//       <Button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
//         -
//       </Button>
//       <Button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
//         +
//       </Button>
//       <Button onClick={() => onRemove(item.id)}>Remove</Button>
//     </div>
//   );
// }

// version 2
"use client";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SetProductQuantity from "../promotion/SetProductQuantity";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import {
  CartItemType,
  useCartServerStore,
} from "@/state-stores/cartServerStore";
import { Trash2 } from "lucide-react";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const token = useCurrentUserStore((state) => state.token);

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
          onClick={() => handleRemoveProductFromCart(token || "", item.id)}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="w-full grid grid-cols-2">
        <div className="flex justify-center">
          <SetProductQuantity
            cartCounter={true}
            cartProduct={item}
            handleQtyDecrease={() =>
              handleCartQtyDecrease(token || "", item.id, -1)
            }
            handleQtyIncrease={() =>
              handleCartQtyIncrease(token || "", item.id, 1)
            }
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
