// "use client";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { ProductList } from "./ProductList";
// import axios from "axios";

// export default function ProductListComponent() {
//   const [products, setProducts] = useState();

//   useEffect(() => {
//     const getAllProducts = async () => {
//       const products = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/products`
//       );
//       setProducts(products.data);
//     };
//     getAllProducts();
//   }, []);
//   return (
//     <>
//       <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <form>
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search" className="pl-8" />
//           </div>
//         </form>
//       </div>
//       <div className="m-0">
//         <ProductList items={products} />
//       </div>
//     </>
//   );
// }

// version good
// "use client";

// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import React, { useEffect } from "react";
// import { ProductList } from "./ProductList";
// import axios from "axios";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
// import AddProduct from "./AddProduct";

// export default function ProductListComponent() {
//   const productLists = useProductStore((state) => state.productLists);
//   const setProductLists = useProductStore((state) => state.setProductLists);

//   useEffect(() => {
//     const getAllProducts = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/products`
//         );
//         setProductLists(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     console.log("use effect");
//     getAllProducts();
//   }, []);

//   return (
//     <>
//       <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <form>
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search" className="pl-8" />
//           </div>
//         </form>
//       </div>
//       <div className="m-0">
//         <ProductList items={productLists} />
//         {/* <ProductList /> */}
//       </div>
//     </>
//   );
// }

// new version
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProductList } from "./ProductList";
import axios from "axios";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { Product } from "@/types/types";
import Loading from "@/components/shared/Loading";

export default function ProductListComponent() {
  const productLists = useProductStore((state) => state.productLists);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // State for filtered products
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message

  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true); // Set loading to true when fetching
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        setProductLists(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("ไม่สามารถโหลดสินค้าได้"); // Set error message
        setLoading(false); // Set loading to false in case of error
      }
    };
    getAllProducts();
  }, [setProductLists]);

  useEffect(() => {
    // Filter products based on the search term
    if (searchTerm && productLists) {
      const results = productLists.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
