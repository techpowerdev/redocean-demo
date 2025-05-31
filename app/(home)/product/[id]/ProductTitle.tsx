"use client";

import React from "react";

type Props = {
  productName: string;
  productDescription: string;
};
export default function ProductTitle({
  productName,
  productDescription,
}: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{productName}</h1>
      <p className="text-gray-600 mb-4">{productDescription}</p>
    </div>
  );
}
