import BannerManager from "@/app/features/banner/BannerManager";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";

export default function page() {
  return (
    <div className="p-4">
      <PageTitle title="จัดการแบนเนอร์" className="mb-4" />
      <BannerManager />
    </div>
  );
}
