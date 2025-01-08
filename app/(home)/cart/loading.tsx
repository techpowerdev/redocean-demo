import Loading from "@/components/shared/Loading";
import React from "react";

export default function loading() {
  return (
    <div className="bg-gray-600 absolute top-0 bottom-0 flex justify-center items-center">
      <Loading />
    </div>
  );
}
