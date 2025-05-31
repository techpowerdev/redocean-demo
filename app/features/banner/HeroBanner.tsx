"use client";

import React from "react";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Banner } from "@/types/baseTypes";
import { Splide, SplideProps, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; // base CSS

type Props = {
  banners: Banner[];
  showArrow?: boolean;
  showDots?: boolean;
  options?: SplideProps["options"];
};

export default function HeroBanner({
  banners,
  showArrow = false,
  showDots = false,
  options,
}: Props) {
  return (
    <>
      <div className="relative">
        <Splide
          options={{
            type: "slide",
            perPage: 1,
            gap: "1rem",
            pagination: showDots,
            arrows: showArrow,
            ...options,
          }}
          aria-label="Slider Container"
          className="relative"
        >
          {banners.map((banner, index) => (
            <SplideSlide key={index}>
              <ResponsiveImage
                alt="Banner"
                src={
                  `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${banner?.image?.id}` ||
                  "/no-image.png"
                }
              />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </>
  );
}
