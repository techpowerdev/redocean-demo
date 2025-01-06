"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FetchAllImagesResponseType, ImageType } from "@/types/imageTypes";
import {
  getAllImages,
  uploadImage,
  deleteImages,
} from "@/services/imageService";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: ImageType[]) => void;
};

export default function ImageLibrary({ isOpen, onClose, onSelect }: Props) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageType[] | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<ImageType[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tag, setTag] = useState("");
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      const response: FetchAllImagesResponseType = await getAllImages();
      setImages(response.data);
    };
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file || !tag) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tag", tag); // ส่ง tag ไปพร้อมรูป
      await uploadImage(formData);
      const response: FetchAllImagesResponseType = await getAllImages();
      setImages(response.data);
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

  const handleSearch = () => {
    if (searchTag) {
      setFilteredImages(
        images.filter((image) =>
          image.tag?.toLowerCase().includes(searchTag.toLowerCase())
        )
      );
    } else {
      setFilteredImages(null); // แสดงทั้งหมดถ้าไม่มีคำค้นหา
    }
  };

  const handleSelectImage = (image: ImageType) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleDelete = async () => {
    if (selectedImages.length === 0) return;
    try {
      await deleteImages(selectedImages.map((img) => img.id));
      const response: FetchAllImagesResponseType = await getAllImages();
      setImages(response.data);
      setSelectedImages([]);
      setFilteredImages(null);
      toast.success("ลบรูปภาพแล้ว");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleSelect = () => {
    onSelect(selectedImages);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>คลังรูปภาพ</DialogTitle>
        </DialogHeader>

        {/* ฟอร์มอัปโหลด */}
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

        {/* ค้นหาตาม tag */}
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="ค้นหาด้วยแท็กรูปภาพ"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
          <Button onClick={handleSearch}>ค้นหา</Button>
        </div>

        {/* แสดงรายการรูปภาพ */}
        <ScrollArea className="mb-4 pr-4" style={{ height: "300px" }}>
          {filteredImages ? (
            filteredImages.length > 0 ? (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">รูปภาพที่ค้นหา</h3>
                <div className="grid grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`flex items-center justify-center p-2 border rounded cursor-pointer ${
                        selectedImages.some((img) => img.id === image.id)
                          ? "border-blue-500 bg-blue-100"
                          : ""
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <div className="w-full h-auto">
                        <ResponsiveImage
                          src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${image.url}`}
                          alt="Image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 text-red-500">ไม่พบรูปภาพที่ค้นหา</div>
            )
          ) : null}
          <div>
            <h3 className="font-semibold mb-2">รูปภาพทั้งหมด</h3>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`flex items-center justify-center p-2 border rounded cursor-pointer ${
                    selectedImages.some((img) => img.id === image.id)
                      ? "border-blue-500 bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleSelectImage(image)}
                >
                  <div className="w-full h-auto">
                    <ResponsiveImage
                      src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${image.url}`}
                      alt="Image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* ปุ่มจัดการ */}
        <div className="mt-4 flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={selectedImages.length === 0}
          >
            ลบรูปภาพที่เลือก
          </Button>
          <Button onClick={handleSelect} disabled={selectedImages.length === 0}>
            ใช้รูปภาพที่เลือก
          </Button>
        </div>
        {/* <EditImageLibrary isOpen={isOpen} onClose={onClose} /> */}
      </DialogContent>
    </Dialog>
  );
}
