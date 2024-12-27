"use client";

import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";

type Props = {
  shareUrl: string;
  shareTitle: string;
  shareDescription: string;
};

export default function SocialShare({
  shareUrl,
  shareTitle,
  shareDescription,
}: Props) {
  return (
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
        // hashtag="#คุ้มค่า #khumkha"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton url={shareUrl} title={shareTitle}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
}
