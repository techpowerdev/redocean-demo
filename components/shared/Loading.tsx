import React from "react";
import Spinner from "./Spinner";

type Props = {
  size?: number;
};
export default function Loading({ size = 26 }: Props) {
  return (
    <div className="w-full h-full  z-50 opacity-50 flex justify-center items-center">
      <Spinner size={size} />
    </div>
  );
}
