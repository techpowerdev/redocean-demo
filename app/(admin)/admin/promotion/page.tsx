import React from "react";
import PagePanelLayout from "../components/shared/PagePanelLayout";
import PromotionActionBarComponent from "@/app/features/promotion/PromotionActionBarComponent";
import PromotionListComponent from "@/app/features/promotion/PromotionListComponent";
import PromotionDetailComponent from "@/app/features/promotion/PromotionDetailComponent";
import { PromotionRightActionToolbar } from "@/app/features/promotion/PromotionRightActionToolbar";

export default function page() {
  return (
    <PagePanelLayout
      LeftHeading="กิจกรรม"
      RightHeading="รายละเอียดกิจกรรม"
      LeftActionBarComponent={<PromotionActionBarComponent />}
      LeftComponent={<PromotionListComponent />}
      RightComponent={<PromotionDetailComponent />}
      RightActionBarComponent={<PromotionRightActionToolbar />}
    />
  );
}
