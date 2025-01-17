// "use client";

// import ResponsiveImage from "@/components/shared/ResponsiveImage";
// import { getAllBanners, updateBannerOrder } from "@/services/bannerServices";
// import { BannerType, FetchAllBannersResponse } from "@/types/bannerTypes";
// import React, { useEffect, useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// export default function BannerManager() {
//   const [banners, setBanners] = useState<BannerType[]>([]);

//   // จัดเรียงแบนเนอร์
//   const moveBanner = async (dragIndex: number, hoverIndex: number) => {
//     const updatedBanners = [...banners];
//     const [removed] = updatedBanners.splice(dragIndex, 1);
//     updatedBanners.splice(hoverIndex, 0, removed);
//     setBanners(updatedBanners);

//     // อัปเดตลำดับในฐานข้อมูล

//     await updateNewBannerOrder(updatedBanners);
//   };

//   const updateNewBannerOrder = async (updatedBanners: BannerType[]) => {
//     // ส่งข้อมูลทั้งหมดที่มีการอัปเดตลำดับ
//     const bannersWithUpdatedOrder = updatedBanners.map((banner, index) => ({
//       id: banner.id,
//       order: index + 1, // ใช้ index + 1 เป็นลำดับใหม่
//     }));

//     try {
//       await updateBannerOrder(bannersWithUpdatedOrder);
//     } catch (error) {
//       console.error("Failed to update banner order:", error);
//     }
//   };

//   // ลบแบนเนอร์
//   const deleteBanner = (id: string) => {
//     setBanners(banners.filter((banner) => banner.id !== id));
//   };

//   useEffect(() => {
//     const fetchAllBanners = async () => {
//       const response: FetchAllBannersResponse = await getAllBanners();
//       setBanners(response.data);
//     };
//     fetchAllBanners();
//   }, []);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="container mx-auto p-4">
//         <h1 className="text-xl font-bold mb-4">Manage Banners</h1>
//         <button
//           // onClick={addBanner}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//         >
//           Add Banner
//         </button>
//         <div className="space-y-4">
//           {banners.map((banner, index) => (
//             <BannerCard
//               key={banner.id}
//               index={index}
//               banner={banner}
//               moveBanner={moveBanner}
//               deleteBanner={deleteBanner}
//             />
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   );
// }

// type BannerCardProps = {
//   index: number;
//   banner: BannerType;
//   moveBanner: (dragIndex: number, hoverIndex: number) => void;
//   deleteBanner: (id: string) => void;
// };

// const BannerCard: React.FC<BannerCardProps> = ({
//   index,
//   banner,
//   moveBanner,
//   deleteBanner,
// }) => {
//   const ref = React.useRef<HTMLDivElement>(null);

//   const [, drop] = useDrop({
//     accept: "banner",
//     hover: (item: { index: number }) => {
//       if (!ref.current) return;
//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) return;

//       moveBanner(dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   const [{ isDragging }, drag] = useDrag({
//     type: "banner",
//     item: { index },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       className={`flex items-center justify-between bg-white p-4 rounded shadow ${
//         isDragging ? "opacity-50" : "opacity-100"
//       }`}
//     >
//       <div className="flex items-center space-x-4">
//         <div>
//           <ResponsiveImage
//             src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${banner.image?.url}`}
//             alt="Banner Image"
//           />
//         </div>
//       </div>
//       <button
//         onClick={() => deleteBanner(banner.id)}
//         className="bg-red-500 text-white px-4 py-2 rounded"
//       >
//         Delete
//       </button>
//     </div>
//   );
// };

import BannerManager from "@/app/features/banner/BannerManager";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";

export default function page() {
  return (
    <div className="p-4">
      <PageTitle title="จัดการแบนเนอร์" className="mb-4" />
      <BannerManager />
    </div>
  );
}
