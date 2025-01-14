"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
// import { ProductType } from "@/types/fetchTypes";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ProductType } from "@/types/productTypes";

type Props = {
  initialProduct?: ProductType | null;
};
export function SearchProductInEventForm({ initialProduct }: Props) {
  //  global state
  const productLists = useProductStore((state) => state.productLists);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProductInPromotion = usePromotionStore(
    (state) => state.selectProductInPromotion
  );
  const selectedProductInPromotion = usePromotionStore(
    (state) => state.selectedProductInPromotion
  );

  // local state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialProduct?.name || "");

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/all`
        );
        setProductLists(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProducts();
  }, [setProductLists]);

  useEffect(() => {
    const product = productLists?.find((product) => product.name === value);
    if (product) {
      selectProductInPromotion(product);
    }
  }, [productLists, selectProductInPromotion, value]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? productLists?.find((product) => product.name === value)?.name
              : "Select product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search product..." />
            <CommandList>
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup>
                {productLists?.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {product.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div>
        <div className="relative w-20 aspect-square">
          <Image
            fill
            src={
              selectedProductInPromotion?.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProductInPromotion.image}`
                : selectedProductInPromotion?.productVariants?.[0]?.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProductInPromotion.productVariants[0].image}`
                : "/no-image.png" // A fallback image path
            }
            alt={selectedProductInPromotion?.name || "Product image"}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {selectedProductInPromotion && (
          <div className="space-y-2 my-2 text-sm">
            <div>
              <span className="font-semibold">รหัสสินค้า :</span>
              {selectedProductInPromotion.sku}
            </div>
            <div>
              <span className="font-semibold">ชื่อสินค้า :</span>
              {selectedProductInPromotion.name}
            </div>
          </div>
        )}
        <Separator />
      </div>
    </>
  );
}
