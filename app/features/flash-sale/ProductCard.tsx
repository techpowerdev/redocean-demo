import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    discountType?: string;
    discount: number;
    sold?: number;
    badges?: string[];
  };
  promotionId?: string | null;
}

export default function ProductCard({
  product,
  promotionId,
}: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}?promotionId=${promotionId}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative p-2">
          <Image
            src={
              `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${product.image}` ||
              "placeholder.svg"
            }
            alt={product.name}
            width={200}
            height={200}
            className="w-full aspect-square object-contain"
          />

          {product.discount > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-bl-lg font-bold">
              <div className="text-[10px] sm:text-xs">ลด</div>
              <div className="text-xs sm:text-base">
                {product.discountType === "percent"
                  ? `${product.discount}%`
                  : `฿${product.discount.toLocaleString()}`}
              </div>
            </div>
          )}

          {product.badges && product.badges.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-1">
              {product.badges.map((badge, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "text-xs h-4 px-1 rounded-sm",
                    badge === "Mall"
                      ? "bg-red-500 text-white"
                      : badge === "Preferred"
                      ? "bg-orange-500 text-white"
                      : badge === "Free Shipping"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-red-500"
                  )}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-xs line-clamp-2 h-8">{product.name}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              {product.originalPrice > product.discountedPrice && (
                <span className="text-gray-400 text-xs line-through">
                  ฿{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-red-500 text-xl font-bold">
                ฿{product.discountedPrice.toLocaleString()}
              </span>
            </div>
            <Button type="button">ซื้อเลย</Button>
          </div>

          {product.sold && (
            <div className="mt-1 text-xs text-gray-500">
              Sold: {product.sold}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
