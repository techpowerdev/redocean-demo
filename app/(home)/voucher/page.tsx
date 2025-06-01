import BuyVoucherClient from "@/app/features/voucher/BuyVoucherClient";
import GiftVoucherCard from "@/app/features/voucher/GiftVoucherCard";
import GiftVoucherLists from "@/app/features/voucher/GiftVoucherLists";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { getAllVoucherGroupsForSell } from "@/services/voucherServices";

export default async function Home() {
  const fetchVoucherGroups = await getAllVoucherGroupsForSell();
  const voucherGroups = fetchVoucherGroups.data;
  if (voucherGroups && voucherGroups.length === 0) {
    return <div>ยังไม่มี eVouchers</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Container>
        <div className="py-4">
          <h1 className="text-3xl font-bold mb-8 text-center">บัตร eVoucher</h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {voucherGroups.map((voucherGroup) => (
              <div key={voucherGroup.id}>
                <BuyVoucherClient voucherGroup={voucherGroup} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
