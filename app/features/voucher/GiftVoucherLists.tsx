import React from "react";
import GiftVoucherCard from "@/app/features/voucher/GiftVoucherCard";
import { VoucherGroup } from "@/types/baseTypes";
import { Button } from "@/components/ui/button";

type Props = {
  voucherGroups: VoucherGroup[];
};
export default function GiftVoucherLists({ voucherGroups }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl">
      {voucherGroups.map((voucherGroup) => (
        <div key={voucherGroup.id}>
          <GiftVoucherCard
            storeName={voucherGroup.storeName}
            value={voucherGroup.amount}
            // serialNumber="TH2025042900001"
            expiryDate={voucherGroup.expiresAt}
            backgroundColor="#DC2626"
            textColor="#ffffff"
            borderColor="#DC2626"
            // qrValue="https://www.lotuss.com/th/voucher/TH2025042900001"
          />
          <Button className="w-full my-2">สั่งซื้อ</Button>
        </div>
      ))}
    </div>
  );
}
