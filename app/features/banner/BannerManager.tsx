// "use client";

// import {
//   createBanner,
//   deleteBanner,
//   getAllBanners,
//   updateBannerOrder,
// } from "@/services/bannerServices";
// import { Banner } from "@/types/baseTypes";
// import React, { useEffect, useState } from "react";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import BannerCard from "./BannerCard";
// import toast from "react-hot-toast";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function BannerManager() {
//   const [file, setFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [tag, setTag] = useState("");
//   const [banners, setBanners] = useState<Banner[]>([]);

//   const handleUpload = async () => {
//     if (!file || !tag) return;
//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("tag", tag); // ส่ง tag ไปพร้อมรูป
//       await createBanner(formData);
//       const response = await getAllBanners();
//       setBanners(response.data);
//       setFile(null);
//       setTag("");
//     } catch (error) {
//       if (error instanceof Error) {
//         const errorMessage = error.message;
//         toast.error(errorMessage);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // จัดเรียงแบนเนอร์
//   const moveBanner = async (dragIndex: number, hoverIndex: number) => {
//     const updatedBanners = [...banners];
//     const [removed] = updatedBanners.splice(dragIndex, 1);
//     updatedBanners.splice(hoverIndex, 0, removed);
//     setBanners(updatedBanners);

//     // อัปเดตลำดับในฐานข้อมูล
//     await updateNewBannerOrder(updatedBanners);
//   };

//   const updateNewBannerOrder = async (updatedBanners: Banner[]) => {
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
//   const removeBanner = async (id: string) => {
//     setBanners(banners.filter((banner) => banner.id !== id));
//     try {
//       await deleteBanner(id);
//     } catch (error) {
//       if (error instanceof Error) {
//         const errorMessage = error.message;
//         toast.error(errorMessage);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchAllBanners = async () => {
//       const response = await getAllBanners();
//       setBanners(response.data);
//     };
//     fetchAllBanners();
//   }, []);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="mx-auto">
//         <div className="mb-4">
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//           />
//           <Input
//             className="mt-2"
//             placeholder="แท็กของรูปภาพ"
//             value={tag}
//             onChange={(e) => setTag(e.target.value)}
//           />
//           <Button
//             className="mt-2"
//             onClick={handleUpload}
//             disabled={!file || isUploading || !tag}
//           >
//             {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
//           </Button>
//         </div>

//         <div className="grid grid-cols-6 gap-4">
//           {banners?.map((banner, index) => (
//             <BannerCard
//               key={banner.id}
//               index={index}
//               banner={banner}
//               moveBanner={moveBanner}
//               deleteBanner={removeBanner}
//             />
//           ))}
//         </div>
//       </div>
//     </DndProvider>
//   );
// }
"use client";

import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBannerOrder,
} from "@/services/bannerServices";
import { Banner } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BannerCard from "./BannerCard";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImagesUploadForm from "../image/ImagesUploadForm";

const BannerSchema = z.object({
  images: z.array(z.string()).min(1, "อัปโหลดอย่างน้อย 1 รูป"),
});

// Create form input type
type BannerFormValues = z.infer<typeof BannerSchema>;

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(BannerSchema), // validate data with the schema
    defaultValues: {
      images: [],
    },
  });

  async function onSubmit(data: BannerFormValues) {
    try {
      const banners = data.images.map((image) => ({
        imageId: image,
      }));
      await createBanner({ banners });
      const bannersData = await getAllBanners();
      setBanners(bannersData.data);
      form.reset();
    } catch (error) {
      toast.success("เกิดข้อผิดพลาดบางอย่าง");
      console.error("Error occurred:", error);
    }
  }

  // จัดเรียงแบนเนอร์
  const moveBanner = async (dragIndex: number, hoverIndex: number) => {
    const updatedBanners = [...banners];
    const [removed] = updatedBanners.splice(dragIndex, 1);
    updatedBanners.splice(hoverIndex, 0, removed);
    setBanners(updatedBanners);

    // อัปเดตลำดับในฐานข้อมูล
    await updateNewBannerOrder(updatedBanners);
  };

  const updateNewBannerOrder = async (updatedBanners: Banner[]) => {
    // ส่งข้อมูลทั้งหมดที่มีการอัปเดตลำดับ
    const banners = updatedBanners.map((banner, index) => ({
      id: banner.id,
      sortOrder: index + 1, // ใช้ index + 1 เป็นลำดับใหม่
      imageId: banner.image?.id,
    }));

    try {
      await updateBannerOrder({ banners });
    } catch (error) {
      console.error("Failed to update banner order:", error);
    }
  };

  // ลบแบนเนอร์
  const removeBanner = async (id: string) => {
    setBanners(banners.filter((banner) => banner.id !== id));
    try {
      await deleteBanner(id);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    const fetchAllBanners = async () => {
      const response = await getAllBanners();
      setBanners(response.data);
    };
    fetchAllBanners();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto">
        <div className="my-6">
          {" "}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Image */}
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>แบนเนอร์</FormLabel>
                    {form.formState.errors.images?.message && <FormMessage />}
                  </FormItem>
                )}
              />
              <ImagesUploadForm control={form.control} />
              <div className="flex justify-start">
                <Button type="submit" className="w-fit">
                  อัปโหลดแบนเนอร์
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {banners?.map((banner, index) => (
            <BannerCard
              key={banner.id}
              index={index}
              banner={banner}
              moveBanner={moveBanner}
              deleteBanner={removeBanner}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
