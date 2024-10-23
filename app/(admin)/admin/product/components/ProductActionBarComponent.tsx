import React from "react";
import AddProduct from "./AddProduct";

export default function ProductActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      <AddProduct />
    </div>
  );
}
