"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
// type Props = {
//   searchParams: { [key: string]: string | string[] | undefined };
// };
export default function ProductPage() {
  const availableColors = ["แดง", "เขียว", "เหลือง"];
  const availableSizes = ["17กรัม", "20กรัม", "30กรัม"];

  // const selectedColor = (searchParams.color || availableColors?.[0]) as string;
  // const selectedSize = (searchParams.size || availableSizes?.[0]) as string;

  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("color");
  const selectedSize = searchParams.get("size");

  return (
    <div>
      <div>{selectedColor + "-" + selectedSize}</div>
      {availableColors.map((color, index) => (
        <Link
          key={index}
          href={`?color=${color}&size=${selectedSize}`}
          // href={`?${new URLSearchParams({
          //   color: color,
          //   size: selectedSize,
          // })}`}
          className={`py-2 px-4 rounded
                  ${
                    selectedColor === color
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200"
                  }
                    `}
        >
          {color}
        </Link>
      ))}
      {availableSizes.map((size, index) => (
        <Link
          key={index}
          href={`?color=${selectedColor}&size=${size}`}
          // href={`?${new URLSearchParams({
          //   color: selectedColor,
          //   size: size,
          // })}`}
          className={`py-2 px-4 rounded
                  ${
                    selectedSize === size
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200"
                  }
                    `}
        >
          {size}
        </Link>
      ))}
    </div>
  );
}
