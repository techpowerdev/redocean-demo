import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

type Props = {
  images: string[] | null;
  setSelectedProductImage: (image: string | null) => void;
  selectedProductImage: string | null;
};
export default function ProductImageSelector({
  images,
  setSelectedProductImage,
  selectedProductImage,
}: Props) {
  // const plugin = React.useRef(
  //   Autoplay({ delay: 2000, stopOnInteraction: true })
  // );

  return (
    <div className="relative px-7 sm:px-14">
      <Carousel
        // plugins={[plugin.current]}
        className="w-full"
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="-ml-1">
          {images?.map((img, i) => (
            <CarouselItem
              key={i}
              className="pl-3 basis-1/3 sm:basis-1/3 md:basis-1/4"
            >
              <Image
                key={i}
                src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${img}`}
                width={200}
                height={200}
                alt={`thumb-${i}`}
                onMouseOver={() => setSelectedProductImage(img)}
                className={`w-full h-full object-contain rounded border ${
                  selectedProductImage === img
                    ? "border-orange-500"
                    : "border-gray-300"
                } cursor-pointer`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
