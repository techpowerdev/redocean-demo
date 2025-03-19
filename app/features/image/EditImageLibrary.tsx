"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/types/baseTypes";
import {
  getAllImages,
  uploadImage,
  deleteImages,
  updateImage,
  deleteImage,
} from "@/services/imageService";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditImageLibrary() {
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[] | null>(null);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tag, setTag] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // ฟิลด์สำหรับจัดการแก้ไขแท็กของแต่ละภาพ
  const [editedTags, setEditedTags] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      const response = await getAllImages();
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
      const response = await getAllImages();
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

  const handleSelectImage = (image: Image) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleTagChange = (imageId: string, newTag: string) => {
    setEditedTags((prevTags) => ({ ...prevTags, [imageId]: newTag }));
  };

  const handleSaveTag = async (imageId: string) => {
    try {
      const newTag = editedTags[imageId];
      if (newTag) {
        await updateImage(imageId, newTag);
        const response = await getAllImages();
        setImages(response.data);
        setSelectedImages([]);
        toast.success("อัปเดตแท็กแล้ว");
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      const response = await getAllImages();
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

  const handleDeleteSelectedImage = async () => {
    if (selectedImages.length === 0) return;
    try {
      await deleteImages(selectedImages.map((img) => img.id));
      const response = await getAllImages();
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

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">คลังรูปภาพ</h1>

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
      {filteredImages ? (
        filteredImages.length > 0 ? (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">รูปภาพที่ค้นหา</h3>
            <div className="grid grid-cols-6 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`flex flex-col items-center justify-between gap-4 p-2 border rounded cursor-pointer ${
                    selectedImages.some((img) => img.id === image.id)
                      ? "border-blue-500 bg-blue-100"
                      : ""
                  }`}
                >
                  <div
                    className="w-full h-auto"
                    onClick={() => handleSelectImage(image)}
                  >
                    <ResponsiveImage
                      src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${image.url}`}
                      alt="Image"
                    />
                  </div>
                  {/* แก้ไข tag */}
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Input
                      value={editedTags[image.id] || image.tag || ""}
                      onChange={(e) =>
                        handleTagChange(image.id, e.target.value)
                      }
                      placeholder="แก้ไข tag"
                    />
                    <Button onClick={() => handleSaveTag(image.id)}>
                      อัปเดตแท็ก
                    </Button>
                    <Button onClick={() => handleDelete(image.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4 text-red-500">ไม่พบรูปภาพที่ค้นหา</div>
        )
      ) : null}

      {/* รูปภาพทั้งหมด */}
      <div>
        <h3 className="font-semibold mb-2">รูปภาพทั้งหมด</h3>
        <div className="grid grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`flex flex-col items-center justify-between gap-4 p-2 border rounded cursor-pointer ${
                selectedImages.some((img) => img.id === image.id)
                  ? "border-blue-500 bg-blue-100"
                  : ""
              }`}
            >
              <div
                className="w-full h-auto"
                onClick={() => handleSelectImage(image)}
              >
                <ResponsiveImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${image.url}`}
                  alt="Image"
                />
              </div>
              {/* แก้ไข tag */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Input
                  value={editedTags[image.id] || image.tag || ""}
                  onChange={(e) => handleTagChange(image.id, e.target.value)}
                  placeholder="แก้ไข tag"
                />
                <Button onClick={() => handleSaveTag(image.id)}>
                  อัปเดตแท็ก
                </Button>
                <Button onClick={() => handleDelete(image.id)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ปุ่มจัดการ */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="destructive"
          onClick={handleDeleteSelectedImage}
          disabled={selectedImages.length === 0}
        >
          ลบรูปภาพที่เลือก
        </Button>
      </div>
    </div>
  );
}
