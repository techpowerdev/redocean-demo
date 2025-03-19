import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Banner } from "@/types/baseTypes";
import { Trash2 } from "lucide-react";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

type BannerCardProps = {
  index: number;
  banner: Banner;
  moveBanner: (dragIndex: number, hoverIndex: number) => void;
  deleteBanner: (id: string) => void;
};

export default function BannerCard({
  index,
  banner,
  moveBanner,
  deleteBanner,
}: BannerCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "banner",
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveBanner(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "banner",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center justify-between bg-white p-4 rounded shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex items-center space-x-4">
        <div>
          <ResponsiveImage
            src={`${
              banner.image
                ? process.env.NEXT_PUBLIC_IMAGE_HOST_URL + banner.image?.url
                : "/no-image.png"
            }`}
            alt="Banner Image"
          />
        </div>
      </div>
      <button
        onClick={() => deleteBanner(banner.id)}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
