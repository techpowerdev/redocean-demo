"use client";

import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import ProductActionBarComponent from "@/app/features/product/admin/ProductActionBarComponent";
import ProductDetailComponent from "@/app/features/product/admin/ProductDetailComponent";
import ProductListComponent from "@/app/features/product/admin/ProductListComponent";
import { ProductRightActionToolbar } from "@/app/features/product/admin/ProductRightActionToolbar";

export default function Product() {
  return (
    <PagePanelLayout
      LeftHeading="สินค้า"
      RightHeading="รายละเอียดสินค้า"
      LeftActionBarComponent={<ProductActionBarComponent />}
      LeftComponent={<ProductListComponent />}
      RightComponent={<ProductDetailComponent />}
      RightActionBarComponent={<ProductRightActionToolbar />}
    />
  );
}
