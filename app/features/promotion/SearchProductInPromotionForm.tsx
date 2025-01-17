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
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Image from "next/image";
import { FetchAllProductResponseType, ProductType } from "@/types/productTypes";
import { getAllProducts } from "@/services/productServices";

type Props = {
  selectedProduct: ProductType | null;
  setSelectedProduct: (selectedProduct: ProductType) => void;
};
export function SearchProductInPromotionForm({
  selectedProduct,
  setSelectedProduct,
}: Props) {
  //  global state
  const productLists = useProductStore((state) => state.productLists);
  const setProductLists = useProductStore((state) => state.setProductLists);

  // local state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedProduct?.id);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products: FetchAllProductResponseType = await getAllProducts();
        setProductLists(products.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const product = productLists?.find((product) => product.id === value);
    if (product) {
      setSelectedProduct(product);
    }
  }, [productLists, value]);

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
              ? productLists?.find((product) => product.id === value)?.name
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
                    value={product.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === product.id ? "opacity-100" : "opacity-0"
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
              selectedProduct?.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProduct.image}`
                : selectedProduct?.productVariants?.[0]?.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProduct.productVariants[0].image}`
                : "/no-image.png" // A fallback image path
            }
            alt={selectedProduct?.name || "Product image"}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {selectedProduct && (
          <div className="space-y-2 my-2 text-sm">
            <div>
              <span className="font-semibold">รหัสสินค้า :</span>
              {selectedProduct.sku}
            </div>
            <div>
              <span className="font-semibold">ชื่อสินค้า :</span>
              {selectedProduct.name}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
