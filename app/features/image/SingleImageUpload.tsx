"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { deleteImage, uploadSingleImage } from "@/services/imageService";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Image from "next/image";
import {
  aspectRatioClass,
  ImageStateType,
  withClass,
} from "./MultipleImageUpload";
import { ImageUp } from "lucide-react";

type ImageUploadProps = {
  image: ImageStateType | null;
  setImage: React.Dispatch<React.SetStateAction<ImageStateType | null>>; // ✅ ใช้ React.SetStateAction
  aspectRatio?: "1/1" | "2/3" | "3/4" | "4/5" | "16/9";
  width?: "40" | "52" | "64" | "80" | "96";
  height?: "40" | "52" | "64" | "80" | "96";
};

export default function SingleImageUpload({
  image,
  setImage,
  aspectRatio = "1/1",
  width = "40",
  height = "40",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<ImageStateType | null>(
    null
  );

  const handleUploadSuccess = (imageData: ImageStateType) => {
    setUploadedImage(imageData);
    setImage(imageData);
  };

  const handleRemoveImage = async () => {
    if (uploadedImage?.id) {
      await deleteImage(uploadedImage?.id);
      setUploadedImage(null);
      setImage(null);
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
    if (image) {
      setUploadedImage(image);
    }
  }, [image]);

  return (
    <div className={clsx("relative", withClass(width, height))}>
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
              src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${uploadedImage.url}`}
              alt="Uploaded"
              sizes="300px"
              fill
              style={{
                objectFit: "contain",
              }}
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              ลบ
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
