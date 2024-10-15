import React from "react";
import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="w-full h-full bg-primary-foreground z-50 opacity-50 flex justify-center items-center">
      <Spinner size={60} />
    </div>
  );
}
