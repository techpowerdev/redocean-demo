// "use client";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
// import { Product } from "@/types/types";
// import Loading from "@/components/shared/Loading";

// export default function SearchProduct() {
//   const productLists = useProductStore((state) => state.productLists);
//   const setProductLists = useProductStore((state) => state.setProductLists);
//   const [searchTerm, setSearchTerm] = useState(""); // State for search input
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for filtered products
//   const [loading, setLoading] = useState(true); // State for loading
//   const [error, setError] = useState<string | null>(null); // State for error message

//   useEffect(() => {
//     const getAllProducts = async () => {
//       setLoading(true); // Set loading to true when fetching
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/products`
//         );
//         setProductLists(data);
//         setLoading(false); // Set loading to false after data is fetched
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setError("ไม่สามารถโหลดสินค้าได้"); // Set error message
//         setLoading(false); // Set loading to false in case of error
//       }
//     };
//     getAllProducts();
//   }, [setProductLists]);

//   useEffect(() => {
//     // Filter products based on the search term
//     if (searchTerm && productLists) {
//       const results = productLists.filter((product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProducts(results);
//     } else {
//       setFilteredProducts(productLists || []); // Set to empty array if undefined
//     }
//   }, [searchTerm, productLists]);

//   let component;
//   if (loading) {
//     component = (
//       <div>
//         <Loading />
//       </div>
//     ); // Loading state
//   }

//   if (error) {
//     component = <div className="text-center text-red-500">{error}</div>; // Display error message
//   }

//   if (searchTerm && filteredProducts.length === 0) {
//     component = <div className="text-center">ไม่พบสินค้า</div>; // No products found
//   }

//   return (
//     <>
//       <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <form onSubmit={(e) => e.preventDefault()}>
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search"
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)} // Update search term
//             />
//           </div>
//         </form>
//         {component
//           ? component
//           : productLists?.map((item) => <div key={item.id}>{item.name}</div>)}
//       </div>
//     </>
//   );
// }
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function SearchProduct() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มกิจกรรม
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] h-full p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">เพิ่มกิจกรรม</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-10">
            <h1 className="text-xl font-bold">สร้างกิจกรรม</h1>
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? frameworks.find((framework) => framework.value === value)
                        ?.label
                    : "Select framework..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[200px] p-0"
                // style={{ pointerEvents: "auto" }}
              >
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
