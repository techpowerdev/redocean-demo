"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect } from "react";
import axios from "axios";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { EventItemList } from "./EventItemList";

export default function EventItemComponent() {
  // const productLists = useProductStore((state) => state.productLists);
  // const setProductLists = useProductStore((state) => state.setProductLists);
  // const eventProduct = productLists?.map((item) => item.isActive);

  // useEffect(() => {
  //   const getAllProducts = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/products`
  //       );
  //       setProductLists(data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };
  //   console.log("use effect");
  //   getAllProducts();
  // }, []);

  return (
    <div className="my-5">
      {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div> */}
      <div className="m-0">
        {/* <EventItemList items={productLists} /> */}
        <EventItemList />
      </div>
    </div>
  );
}
