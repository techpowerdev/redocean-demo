import React from "react";
import { CreateProduct } from "./forms/CreateProduct";

export default function ProductActionBarComponent() {
  return (
    <div className="flex justify-end items-center gap-2">
      <CreateProduct />
    </div>
  );
}
