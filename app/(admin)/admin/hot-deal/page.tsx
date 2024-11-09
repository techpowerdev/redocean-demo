import React from "react";
import PagePanelLayout from "@/app/(admin)/admin/components/shared/PagePanelLayout";
import EventDetail from "./components/EventDetail";
import EventItemComponent from "./components/EventItemComponent";

export default function page() {
  return (
    <PagePanelLayout
      LeftHeading="สินค้าที่เข้าร่วมกิจกรรม"
      RightHeading="รายละเอียดกิจกรรม"
      // LeftActionBarComponent={<ProductActionBarComponent />}
      LeftComponent={<EventItemComponent />}
      RightComponent={<EventDetail />}
    />
  );
}
