"use client";

import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

// interface Props {
//   product: Product | null;
// }
type Image = {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  eventId: string;
};
type Event = {
  id: string;
  name: string;
  description: string;
  discountType: string;
  discountAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: Image;
  createdAt: string;
  updatedAt: string;
  products: [];
};

// export default function ProductDetailComponent({ product }: Props) {
export default function EventDetail() {
  const [events, setEvents] = useState<Event[]>([]);
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  useEffect(() => {
    const fetchEvent = async () => {
      const events = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events`
      );
      // console.log(events.data);
      // console.log(events.data[0].image.url);
      setEvents(events.data);
    };
    fetchEvent();
  });
  return (
    <div className="h-full flex-1 flex flex-col justify-stretch">
      {events ? (
        <div className="flex flex-col flex-1 ">
          {events.map((item) => (
            <div key={item.id} className="grid grid-cols-[30%_1fr] gap-4 p-4">
              <div className="flex items-start gap-4 text-sm">
                {item.image && (
                  <div className="relative w-full aspect-square">
                    <Image
                      fill
                      src={`${
                        process.env.NEXT_PUBLIC_IMAGE_HOST_URL + item.image.url
                      }`}
                      alt={item.image.id}
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start justify-between">
                <div className="font-semibold text-xl">{item.name}</div>
                <div className="text-lg"> {item.description}</div>
                <div>
                  <p>
                    {item.discountType === "FIXED"
                      ? `ราคาส่วนลด : ${item.discountAmount}`
                      : `เปอร์เซ็นต์ : ${item.discountAmount}`}
                  </p>
                  <p>ราคาส่วนลดสูงสุด : {item.maxDiscount}</p>
                </div>
                <h1>เริ่มเมื่อ : {item.startDate}</h1>
                <h1>สิ้นสุด : {item.endDate}</h1>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          ยังไม่มีข้อมูล
        </div>
      )}
    </div>
  );
}
