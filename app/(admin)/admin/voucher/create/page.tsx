import CreateVoucherForm from "@/app/features/voucher/CreateVoucherForm";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";

export default function CreateVoucher() {
  return (
    <div className="p-4">
      <PageTitle title="เพิ่มบัตร eVoucher" className="mb-4" />
      <CreateVoucherForm />
    </div>
  );
}
