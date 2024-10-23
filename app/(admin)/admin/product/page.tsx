import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import ProductListComponent from "@/app/(admin)/admin/product/components/ProductListComponent";
import ProductDetailComponent from "@/app/(admin)/admin/product/components/ProductDetailComponent";
import { mails } from "../data/data";
import ProductActionBarComponent from "./components/ProductActionBarComponent";

export default function page() {
  const ComponentDetail = (
    <ProductDetailComponent
      mail={
        mails.find(
          (item) => item.id === "6c84fb90-12c4-11e1-840d-7b25c5ee775a"
        ) || null
      }
    />
  );

  return (
    <PagePanelLayout
      LeftHeading="สินค้า"
      RightHeading="รายละเอียดสินค้า"
      LeftActionBarComponent={<ProductActionBarComponent />}
      LeftComponent={<ProductListComponent />}
      RightComponent={ComponentDetail}
    />
  );
}
