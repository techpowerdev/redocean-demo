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
import { useEventStore } from "@/state-stores/admin/adminEventStore";

export function SearchProductInEventForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const productLists = useProductStore((state) => state.productLists);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProductInEvent = useEventStore(
    (state) => state.selectProductInEvent
  );

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        setProductLists(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProducts();
  }, [setProductLists]);

  useEffect(() => {
    const product = productLists?.find((product) => product.name === value);
    if (product) {
      selectProductInEvent(product);
    }
  }, [productLists, selectProductInEvent, value]);

  return (
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
  );
}
