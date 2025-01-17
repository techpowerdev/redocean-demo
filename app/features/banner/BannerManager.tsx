"use client";

import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBannerOrder,
} from "@/services/bannerServices";
import { BannerType, FetchAllBannersResponseType } from "@/types/bannerTypes";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BannerCard from "./BannerCard";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BannerManager() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tag, setTag] = useState("");
  const [banners, setBanners] = useState<BannerType[]>([]);

  const handleUpload = async () => {
    if (!file || !tag) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tag", tag); // ส่ง tag ไปพร้อมรูป
      await createBanner(formData);
      const response: FetchAllBannersResponseType = await getAllBanners();
      setBanners(response.data);
      setFile(null);
      setTag("");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // จัดเรียงแบนเนอร์
  const moveBanner = async (dragIndex: number, hoverIndex: number) => {
    const updatedBanners = [...banners];
    const [removed] = updatedBanners.splice(dragIndex, 1);
    updatedBanners.splice(hoverIndex, 0, removed);
    setBanners(updatedBanners);

    // อัปเดตลำดับในฐานข้อมูล
    await updateNewBannerOrder(updatedBanners);
  };

  const updateNewBannerOrder = async (updatedBanners: BannerType[]) => {
    // ส่งข้อมูลทั้งหมดที่มีการอัปเดตลำดับ
    const bannersWithUpdatedOrder = updatedBanners.map((banner, index) => ({
      id: banner.id,
      order: index + 1, // ใช้ index + 1 เป็นลำดับใหม่
    }));

    try {
      await updateBannerOrder(bannersWithUpdatedOrder);
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
      const response: FetchAllBannersResponseType = await getAllBanners();
      setBanners(response.data);
    };
    fetchAllBanners();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto">
        <div className="mb-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Input
            className="mt-2"
            placeholder="แท็กของรูปภาพ"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <Button
            className="mt-2"
            onClick={handleUpload}
            disabled={!file || isUploading || !tag}
          >
            {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
          </Button>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {banners.map((banner, index) => (
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
