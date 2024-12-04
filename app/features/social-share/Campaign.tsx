import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { PromotionType } from "@/types/fetchTypes";
import SocialShare from "./SocialShare";

const domain = "https://7d23-101-108-150-129.ngrok-free.app";
const shareImage =
  "https://7d23-101-108-150-129.ngrok-free.app/_next/image?url=https%3A%2F%2Fimg.lazcdn.com%2Fus%2Fdomino%2Fd61099c7-adc8-4e98-9285-ee52b1f062a0_TH-1976-688.jpg_2200x2200q80.jpg_.avif&w=3840&q=75";

type Props = {
  promotion: PromotionType;
};

export async function generateMetadata(
  { promotion }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  // const id = promotion.id; // promotion id
  // fetch promotion data
  // const promotion = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: promotion.name,
    description: "รวมออเดอร์กันซื้อถูกกว่า แชร์ต่อให้เพื่อนเลยSocaial",
    openGraph: {
      title: "RED OCEAN MARKETINGG",
      description: "รวมออเดอร์กันซื้อถูกกว่า แชร์ต่อให้เพื่อนเลยsocial",
      url: domain,
      siteName: "Red Ocean Marketing",
      images: [
        {
          url: shareImage,
          width: 800,
          height: 600,
          alt: "Promotional Banner",
        },
        ...previousImages,
      ],
      locale: "en_TH",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "RED OCEAN MARKETING",
      description: "รวมออเดอร์กันซื้อถูกกว่า แชร์ต่อให้เพื่อนเลยsocial",
      images: [shareImage],
    },
  };
}

export default function Campaign({ promotion }: Props) {
  return (
    <div>
      <h1>Campaign : {promotion.name}</h1>
      <SocialShare promotion={promotion} />
    </div>
  );
}
