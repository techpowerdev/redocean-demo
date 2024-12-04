"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ResponsiveImage from "@/components/shared/ResponsiveImage";

const banners = [
  {
    id: 1,
    href: "https://img.lazcdn.com/us/domino/d568a9cb-0dbe-4b2b-a156-65ee1ea43f14_TH-1976-688.jpg_2200x2200q80.jpg_.avif",
  },
  {
    id: 2,
    href: "https://img.lazcdn.com/us/domino/ecb0c2e6-9e69-4279-af7e-df587bb8464d_TH-1976-688.jpg_2200x2200q80.jpg_.avif",
  },
  {
    id: 3,
    href: "https://img.lazcdn.com/us/domino/d61099c7-adc8-4e98-9285-ee52b1f062a0_TH-1976-688.jpg_2200x2200q80.jpg_.avif",
  },
];

export default function HeroBanner() {
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
      <div className="relative ">
        <ResponsiveImage alt="Banner" src={banners[currentBanner].href} />
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
