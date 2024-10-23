import React from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export default function ResponsiveImage({ src, alt }: Props) {
  return (
    <Image
      alt={alt}
      // Importing an image will
      // automatically set the width and height
      src={src}
      sizes="100vw"
      // Make the image display full width
      style={{
        width: "100%",
        height: "100%",
      }}
      width={40}
      height={40}
    />
  );
}
