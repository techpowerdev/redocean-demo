"use client";

import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";
import { PromotionType } from "@/types/fetchTypes";

type Props = {
  promotion: PromotionType;
};

export default function SocialShare({ promotion }: Props) {
  const shareUrl =
    "https://7d23-101-108-150-129.ngrok-free.app/campaign/cm45rwl6l0001kpgwr8ho569e"; // แก้ไข URL เป็นของคุณ
  const shareTitle = "รวมออเดอร์กันซื้อถูกกว่า แชร์ต่อให้เพื่อนเลย New!!!";
  // const shareDescription =
  //   "โปรโมชั่นสุดคุ้ม! รวมพลังเพื่อน ๆ สั่งซื้อได้ในราคาสุดพิเศษ แชร์เลย!social";
  const shareDescription = promotion.description;

  return (
    <>
      {/* Share Buttons */}
      <div className="flex justify-center items-center gap-4 p-4">
        <span>แชร์</span>
        {/* Line Share */}
        {/* title เปลี่ยนแปลงทันที ไม่ cache */}
        <LineShareButton url={shareUrl} title={shareTitle}>
          <LineIcon size={32} round />
        </LineShareButton>

        {/* Facebook Share */}
        {/* og เหมือนจะมาจาก homepage */}
        <FacebookShareButton
          url={shareUrl}
          quote={shareDescription}
          hashtag="#คุ้มค่า #khumkha"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        {/* Twitter Share */}
        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </div>
    </>
  );
}
