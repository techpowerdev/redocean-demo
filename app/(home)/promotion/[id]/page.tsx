import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { getPromotionById } from "@/services/promotionServices";
import { FetchOnePromotionResponseType } from "@/types/promotionTypes";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  // fetch data
  const fetchData: FetchOnePromotionResponseType = await getPromotionById(id);
  const promotion = fetchData.data;

  const imageUrl =
    promotion?.images && promotion.images?.length > 0
      ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${promotion?.images?.[0].url}`
      : "";

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: promotion.name,
    description: promotion.description,
    openGraph: {
      title: promotion.name,
      description: promotion.description,
      url: `${process.env.NEXT_PUBLIC_CLIENT_HOST_URL}/promotion/${promotion.id}`,
      // siteName: "Red Ocean Marketing",
      images: [
        {
          url: imageUrl,
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
      title: promotion.name,
      description: promotion.description,
      images:
        promotion?.images?.map(
          (image) => process.env.NEXT_PUBLIC_IMAGE_HOST_URL + image.url
        ) || [],
    },
  };
}

export default async function Campaign({ params }: Props) {
  // fetch data
  const promotion: FetchOnePromotionResponseType = await getPromotionById(
    (
      await params
    ).id
  );

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="font-semibold">{promotion.data.name}</h1>
      {promotion.data.images && promotion.data.images.length > 0 && (
        <ResponsiveImage
          src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${promotion.data.images?.[0].url}`}
          alt="promotion-image"
        />
      )}
      <Link href={"/"}>
        <Button>สั่งซื้อสินค้า</Button>
      </Link>
    </div>
  );
}
