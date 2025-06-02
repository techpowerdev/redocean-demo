import React from "react";
import UpdateCommissionPolicyForm from "@/app/features/affiliate/forms/UpdateCommissionPolicyForm";
import { getAffiliateCommissionPolicy } from "@/services/affiliateServices";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function commissionPolicyPage() {
  const commissionPolicy = await getAffiliateCommissionPolicy();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">จัดการค่าคอมมิชชั่น</h1>
      {commissionPolicy?.data ? (
        <UpdateCommissionPolicyForm commissionPolicy={commissionPolicy.data} />
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
