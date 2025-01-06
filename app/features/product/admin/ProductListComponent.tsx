"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProductList } from "./ProductList";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Loading from "@/components/shared/Loading";
import { getAllProducts } from "@/services/productServices";
import { FetchAllProductResponseType, ProductType } from "@/types/productTypes";

export default function ProductListComponent() {
  const productLists = useProductStore((state) => state.productLists);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]); // State for filtered products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true); // Set loading to true when fetching
      try {
        const products: FetchAllProductResponseType = await getAllProducts();
        if (products) {
          setProductLists(products.data);
        }
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("ไม่สามารถโหลดสินค้าได้"); // Set error message
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchAllProducts();
  }, [setProductLists]);

  useEffect(() => {
    // Filter products based on the search term
    if (searchTerm && productLists) {
      const results = productLists.filter((product) =>
        product.name
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(searchTerm.replace(/\s+/g, "").toLowerCase())
      );

      setFilteredProducts(results);
    } else {
      setFilteredProducts(productLists || []); // Set to empty array if undefined
    }
  }, [searchTerm, productLists]);

  let component;
  if (loading) {
    component = (
      <div>
        <Loading />
      </div>
    ); // Loading state
  }

  if (error) {
    component = <div className="text-center text-red-500">{error}</div>; // Display error message
  }

  if (searchTerm && filteredProducts.length === 0) {
    component = <div className="text-center">ไม่พบสินค้า</div>; // No products found
  }

  return (
    <>
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
        </form>
      </div>
      {component ? (
        component
      ) : (
        <div className="m-0">
          <ProductList items={filteredProducts} />
        </div>
      )}
    </>
  );
}
