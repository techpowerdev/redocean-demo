import Container from "@/components/shared/Container";
import { getAllBanners } from "@/services/bannerServices";
import { ShowUpcomingPromotion } from "@/app/features/promotion/ShowUpcomingPromotion";
import { getPromotions } from "@/services/promotionServices";
import GroupBuyLists from "../features/flash-sale/GroupBuyLists";
import FlashSaleLists from "../features/flash-sale/FlashSaleLists";
import { getAllVoucherGroupsForSell } from "@/services/voucherServices";
import SliderContainer from "@/components/shared/SliderContainer";
import BuyVoucherClient from "../features/voucher/BuyVoucherClient";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const banners = await getAllBanners();
  const promotions = await getPromotions("today");
  const upcomingPromotions = await getPromotions("upcoming");
  const voucherGroups = await getAllVoucherGroupsForSell();

  const filteredGroupbuyingPromotions = promotions?.data.filter(
    (promotion) => promotion?.type === "groupbuying"
  );

  const filteredFlashsalePromotions = promotions?.data.filter(
    (promotion) => promotion?.type === "flashsale"
  );

  return (
    <div>
      {/* Banners */}
      {banners?.data.length ? (
        <div className="pb-8">
          <SliderContainer
            options={{
              type: "loop", // ทำให้วนซ้ำ
              autoplay: true, // เริ่มเล่นอัตโนมัติ
              interval: 3000, // ความเร็วในการเลื่อน (มิลลิวินาที)
              // pauseOnHover: false, // ไม่หยุดเมื่อเมาส์ชี้
              // pauseOnFocus: false, // ไม่หยุดเมื่อโฟกัส
              // resetProgress: false, // ไม่รีเซ็ต progress เมื่อเลื่อนเอง
            }}
            breakpoints={{
              9999: { perPage: 1, arrows: false }, // แสดงแบบเดียวกันกับทุกหน้าจอ
            }}
          >
            {banners?.data?.map((banner) => (
              <div key={banner.id}>
                <ResponsiveImage
                  alt="Banner"
                  src={
                    `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${banner?.image?.id}` ||
                    "/placeholder.svg"
                  }
                />
              </div>
            ))}
          </SliderContainer>
        </div>
      ) : null}

      {/* Groupbuy */}
      {filteredGroupbuyingPromotions?.length > 0 && (
        <div className="pb-6 bg-orange-100">
          <GroupBuyLists promotions={filteredGroupbuyingPromotions} />
        </div>
      )}

      {/* Flashsale */}
      {filteredFlashsalePromotions?.length > 0 && (
        <div className="pb-6 bg-red-100">
          <FlashSaleLists promotions={filteredFlashsalePromotions} />
        </div>
      )}

      {/* upcoming soon */}
      {upcomingPromotions.data.length > 0 && (
        <div className="pt-2 pb-8 bg-gray-100">
          <Container>
            <h1 className="text-center sm:text-left text-2xl my-4">
              กิจกรรมที่กำลังจะมาถึงในเร็วๆนี้
            </h1>
            <ShowUpcomingPromotion promotions={upcomingPromotions.data} />
          </Container>
        </div>
      )}

      {voucherGroups.data.length ? (
        <div className="pt-2 pb-8 bg-gray-100">
          <Container>
            <h1 className="text-center sm:text-left text-2xl my-4">
              บัตร eVoucher
            </h1>
            <Link
              href={"/voucher"}
              className="w-full flex flex-row items-center justify-end gap-2 my-2"
            >
              ดูทั้งหมด
              <span className="flex items-center justify-center bg-black w-8 h-8 rounded-full">
                <ChevronRight size={20} className="text-white" />
              </span>
            </Link>
            <div className="my-4">
              <SliderContainer>
                {voucherGroups.data.map((voucherGroup) => (
                  <BuyVoucherClient
                    key={voucherGroup.id}
                    voucherGroup={voucherGroup}
                  />
                ))}
              </SliderContainer>
            </div>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
