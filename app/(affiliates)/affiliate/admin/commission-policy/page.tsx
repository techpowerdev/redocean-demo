"use client";

import React, { useEffect, useState } from "react";
import UpdateCommissionPolicyForm from "@/app/features/affiliate/forms/UpdateCommissionPolicyForm";
import { getAffiliateCommissionPolicy } from "@/services/affiliateServices";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetAffiliateCommissionPolicyResponse } from "@/types/affiliateTypes";

export default function CommissionPolicyPage() {
  const [commissionPolicy, setCommisionPolicy] = useState<
    GetAffiliateCommissionPolicyResponse["data"] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const commissionPolicy = await getAffiliateCommissionPolicy();
      setCommisionPolicy(commissionPolicy.data);
    };
    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">จัดการค่าคอมมิชชั่น</h1>
      {commissionPolicy ? (
        <UpdateCommissionPolicyForm commissionPolicy={commissionPolicy} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-red-500">
            ยังไม่มีการกำหนดนโยบายค่าคอมมิชชั่น
          </div>
          <Link href={"/affiliate/admin/commission-policy/create"}>
            <Button>กำหนดนโยบายค่าคอมมิชชั่น</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
