import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import ProductListComponent from "@/app/(admin)/admin/product/components/ProductListComponent";
import ProductDetailComponent from "@/app/(admin)/admin/product/components/ProductDetailComponent";
import ProductActionBarComponent from "./components/ProductActionBarComponent";

export default function page() {
  return (
    <PagePanelLayout
      LeftHeading="สินค้า"
      RightHeading="รายละเอียดสินค้า"
      LeftActionBarComponent={<ProductActionBarComponent />}
      LeftComponent={<ProductListComponent />}
      RightComponent={<ProductDetailComponent />}
    />
  );
}
