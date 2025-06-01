"use client";

import EditVoucherForm from "@/app/features/voucher/EditVoucherForm";
import PageTitle from "@/components/shared/PageTitle";
import { getVoucherGroupById } from "@/services/voucherServices";
import { VoucherGroup } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";

type Props = {
  params: { id: string };
};

export default function EditVoucher({ params }: Props) {
  const [voucherGroup, setVoucherGroup] = useState<VoucherGroup | null>(null);

  useEffect(() => {
    const fetchVoucherGroup = async () => {
      try {
        const result = await getVoucherGroupById(params.id);
        setVoucherGroup(result?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVoucherGroup();
  }, [params.id]);

  if (!voucherGroup)
    return (
      <div className="text-red-500 flex justify-center items-center h-screen">
        ไม่พบ voucher
      </div>
    );

  return (
    <div className="p-4">
      <PageTitle title="แก้ไขบัตร eVoucher" className="mb-4" />
      <EditVoucherForm voucherGroup={voucherGroup} />
    </div>
  );
}
