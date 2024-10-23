import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import { mails } from "./data/data";
import OrderDetailComponent from "@/app/(admin)/admin/components/OrderDetailComponent";
import OrderListComponent from "@/app/(admin)/admin/components/OrderListComponent";

export default function page() {
  const ComponentDetail = (
    <OrderDetailComponent
      mail={
        mails.find(
          (item) => item.id === "6c84fb90-12c4-11e1-840d-7b25c5ee775a"
        ) || null
      }
    />
  );

  return (
    <PagePanelLayout
      LeftHeading="คำสั่งซื้อ"
      RightHeading="รายละเอียดคำสั่งซื้อ"
      // LeftActionBarComponent={<OrderActionBarComponent />}
      LeftComponent={<OrderListComponent />}
      RightComponent={ComponentDetail}
    />
  );
}
