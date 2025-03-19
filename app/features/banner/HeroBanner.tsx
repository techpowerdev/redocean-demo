"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Banner } from "@/types/baseTypes";

type Props = {
  banners: Banner[];
};

export default function HeroBanner({ banners }: Props) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to move to the next banner
  const nextContent = () => {
    setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
  };

  // Function to move to the previous banner
  const prevContent = () => {
    setCurrentBanner(
      (prevBanner) => (prevBanner - 1 + banners.length) % banners.length
    );
  };

  // Function to start the autoplay
  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      nextContent();
    }, 2000); // Change the interval time as needed (in milliseconds)
  };

  // Function to stop the autoplay
  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start autoplay on mount
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay(); // Cleanup on unmount
  }, []);

  return (
    <div
      className="w-full flex flex-col gap-2 bg-border/30 pb-1 md:pb-3"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div className="relative">
        <ResponsiveImage
          alt="Banner"
          src={`${
            banners[currentBanner].image
              ? process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                banners[currentBanner].image.url
              : "/no-image.png"
          }`}
        />
        <span
          className="absolute top-1/2 transform -translate-y-1/2 left-2 cursor-pointer flex justify-center items-center rounded-full bg-border w-4 h-4 md:w-8 md:h-8"
          onClick={prevContent}
        >
          <ChevronLeft className="text-primary w-4" />
        </span>
        <span
          className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer flex justify-center items-center rounded-full bg-border w-4 h-4 md:w-8 md:h-8"
          onClick={nextContent}
        >
          <ChevronRight className="text-primary w-4" />
        </span>
      </div>
      <div className="flex justify-center items-center gap-2">
        {banners.map((item, i) => (
          <span
            key={item.id}
            onClick={() => setCurrentBanner(i)}
            className={`rounded-full w-[5px] h-[5px] md:w-[10px] md:h-[10px] border border-primary cursor-pointer 
                ${i === currentBanner ? "bg-primary" : "bg-none"}`}
          />
        ))}
      </div>
    </div>
  );
}
