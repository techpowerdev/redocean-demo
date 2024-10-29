"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import { formatDateTimeTH } from "@/utils/formatDate";
// const exampleData = [
//   {
//     barcode: "ED852942182TH",
//     status: "103",
//     status_description: "รับฝาก",
//     status_date: "19/07/2562 18:12:26+07:00",
//     statusDetail: "รับฝากสิ่งของ [เคาน์เตอร์บริการไปรษณีย์ คต.กาดสวนแก้ว]",
//     location: "คต.กาดสวนแก้ว",
//     postcode: "00131",
//     delivery_status: null,
//     delivery_description: null,
//     delivery_datetime: null,
//     receiver_name: null,
//     signature: null,
//     delivery_officer_name: null,
//     delivery_officer_tel: null,
//     office_name: null,
//     office_tel: null,
//     call_center_tel: "1545",
//   },
//   {
//     barcode: "ED852942182TH",
//     status: "201",
//     status_description: "ส่งออกจากที่ทำการกลางทาง",
//     status_date: "20/07/2562 15:12:15+07:00",
//     statusDetail:
//       "สิ่งของส่งออกจาก [เคาน์เตอร์บริการไปรษณีย์ คต.กาดสวนแก้ว] ไปยัง [ศูนย์คัดแยกหลักสี่]",
//     location: "คต.กาดสวนแก้ว",
//     postcode: "00131",
//     delivery_status: null,
//     delivery_description: null,
//     delivery_datetime: null,
//     receiver_name: null,
//     signature: null,
//     delivery_officer_name: null,
//     delivery_officer_tel: null,
//     office_name: null,
//     office_tel: null,
//     call_center_tel: "1545",
//   },
// ];

type TrackingItem = {
  barcode: string;
  status: string;
  status_description: string;
  status_date: string;
  statusDetail: string;
  location: string;
  postcode: string;
  receiver_name: string | null;
  office_tel: string | null;
  call_center_tel: string | null;
};

type Props = {
  id: string;
};

export default function Tracking({ id }: Props) {
  const [trackingData, setTrackingData] = useState<TrackingItem[] | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_THIAPOST_API_URL}/track`,
          {
            status: "all",
            language: "TH",
            barcode: ["OB145069709TH"],
          },
          {
            headers: {
              Authorization: `Token ${process.env.NEXT_PUBLIC_THIAPOST_API_TOKEN}`, // Attach the token here
            },
          }
        );
        console.log(response);
        const items = response.data.response.items["OB145069709TH"] || [];
        setTrackingData(items);
      } catch (error) {
        console.error("Failed to fetch tracking data", error);
      }
    };

    fetchTrackingData();
  }, [id]);

  if (!trackingData) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
        <Loading size={40} />
      </div>
    );
  }
  return (
    <div className="p-6 sm:p-10">
      <h1 className="text-xl font-bold pb-2">ติดตามสถานะการจัดส่ง</h1>
      <h2 className="font-bold pb-2">หมายเลขคำสั่งซื้อ: {id}</h2>
      <div className="after:absolute after:inset-y-0 after:w-px after:bg-red-500/20 relative pl-6 after:left-0 grid gap-10 dark:after:bg-red-400/20">
        {trackingData?.map((item, index) => (
          <div key={index} className="grid gap-1 text-sm relative">
            <div className="aspect-square w-3 bg-primary rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50" />
            <div className="text-lg font-bold">
              {formatDateTimeTH(item.status_date)}
            </div>
            <div className="font-bold">{item.status_description}</div>
            {item.receiver_name && (
              <div className="font-bold">ผู้รับ : {item.receiver_name}</div>
            )}
            <div className="text-gray-500 dark:text-gray-400">
              {item.statusDetail}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              สถานที่: {item.location} รหัสไปรษณีย์: {item.postcode}
            </div>
            {item.office_tel && (
              <div className="text-gray-500 dark:text-gray-400">
                Office Tel: {item.office_tel}
              </div>
            )}
            {item.call_center_tel && (
              <div className="text-gray-500 dark:text-gray-400">
                Call Center: {item.call_center_tel}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
