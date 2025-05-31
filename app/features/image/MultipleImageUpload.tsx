"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { deleteImage, uploadSingleImage } from "@/services/imageService";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Image from "next/image";
import { ImageMinus, ImageUp } from "lucide-react";
import { ImagePlus } from "lucide-react";

export const widthClass: Record<string, string> = {
  "40": "w-40",
  "52": "w-52",
  "64": "w-64",
  "80": "w-80",
  "96": "w-96",
};

export const heightClass: Record<string, string> = {
  "40": "h-40",
  "52": "h-52",
  "64": "h-64",
  "80": "h-80",
  "96": "h-96",
};

// ฟังก์ชันเลือก Tailwind class ตามค่าที่กำหนด
export const withClass = (width: string, height: string) => {
  return `${widthClass[width] || ""} ${heightClass[height] || ""}`.trim();
};

export type ImageStateType = {
  id: string;
  url: string;
};

type MultipleImageUploadProps = {
  images: ImageStateType[];
  setImages: React.Dispatch<React.SetStateAction<ImageStateType[]>>; // ✅ ใช้ React.SetStateAction
  aspectRatio?: "1/1" | "2/3" | "3/4" | "4/5" | "16/9";
  width?: "40" | "52" | "64" | "80" | "96";
  height?: "40" | "52" | "64" | "80" | "96";
};

export default function MultipleImageUpload({
  images,
  setImages,
  aspectRatio = "1/1",
  width = "40",
  height = "40",
}: MultipleImageUploadProps) {
  const addImageUpload = () => {
    setImages((prev) => [...prev, { id: "", url: "" }]); // ✅ แก้ไข Type ของ prev
  };

  const updateImageId = (index: number, image: ImageStateType) => {
    const updatedImages = [...images];
    updatedImages[index] = image;
    setImages(updatedImages);
  };

  const removeImageUpload = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <>
      {images.map((item, index) => (
        <div key={index} className={clsx("relative", withClass(width, height))}>
          <ImageUpload
            image={item}
            onUploadSuccess={(image) => updateImageId(index, image)}
            onRemove={() => removeImageUpload(index)}
            aspectRatio={aspectRatio}
          />
        </div>
      ))}
      <div className={clsx(withClass(width, height))}>
        <button
          type="button"
          onClick={addImageUpload}
          className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 border-2 border-dashed"
        >
          <ImagePlus className="text-slate-200" />
        </button>
      </div>
    </>
  );
}

export const aspectRatioClass = {
  "1/1": "aspect-[1/1]",
  "2/3": "aspect-[1/1]",
  "3/4": "aspect-[1/1]",
  "4/5": "aspect-[1/1]",
  "16/9": "aspect-[16/9]",
};

type ImageUploadProps = {
  image: ImageStateType;
  onUploadSuccess: (image: ImageStateType) => void;
  onRemove: () => void;
  aspectRatio?: "1/1" | "2/3" | "3/4" | "4/5" | "16/9"; // ✅ รองรับอัตราส่วนที่กำหนด
};

// ImageUpload component
function ImageUpload({
  image,
  onUploadSuccess,
  onRemove,
  aspectRatio = "1/1", // ✅ ค่าเริ่มต้น
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<ImageStateType | null>(
    null
  );

  const handleUploadSuccess = (imageData: ImageStateType) => {
    setUploadedImage(imageData);
    onUploadSuccess(imageData);
  };

  const handleRemoveImage = async () => {
    if (uploadedImage?.id) {
      await deleteImage(uploadedImage?.id);
      setUploadedImage(null);
      onRemove();
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await uploadSingleImage(file);
      if (uploaded?.data?.id) {
        handleUploadSuccess({
          id: uploaded?.data?.id,
          url: uploaded?.data?.url,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const maxSize = 5 * 1024 * 1024; // 5MB

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: maxSize,
    multiple: false,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors, file }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(
              `ไฟล์ ${file.name} มีขนาดใหญ่เกิน ${maxSize / (1024 * 1024)}MB`
            );
          }
        });
      });
    },
  });

  useEffect(() => {
    if (image.url != "") {
      setUploadedImage(image);
    }
  }, [image]);

  return (
    <div className="relative w-full h-full flex justify-center items-center border-2 border-dashed">
      {uploading && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 flex items-center justify-center z-50">
          <Loading size={40} />
        </div>
      )}

      {uploadedImage ? (
        <div
          className={clsx(
            "relative w-full max-h-full",
            aspectRatioClass[aspectRatio]
          )}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${uploadedImage.id}`}
            alt="Uploaded"
            sizes="300px"
            fill
            style={{
              objectFit: "contain",
            }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
          >
            ลบ
          </button>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className={clsx(
              "w-full h-full flex flex-col justify-center items-center gap-2 p-2 cursor-pointer"
            )}
          >
            <Input
              {...getInputProps()}
              id="photo"
              type="file"
              className="hidden"
            />
            <div className="text-[14px] text-center font-semibold">
              {/* ลากวางรูปที่นี่ หรือคลิกเพื่อเลือก */}
              <ImageUp className="text-primary" />
            </div>
            <div className="text-[12px] text-gray-400 text-center">
              ไฟล์ .jpg, .png, .webp ไม่เกิน 5MB.
            </div>
          </div>
          <div className="relative h-full flex justify-items-center items-center bg-black">
            <button
              type="button"
              onClick={onRemove}
              className="absolute bottom-1 right-1 bg-red-500 bg-opacity-60 hover:bg-opacity-100 text-white text-xs px-2 py-1 rounded"
            >
              <ImageMinus size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
