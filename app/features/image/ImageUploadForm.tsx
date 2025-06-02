// "use client";

// import { deleteImage, uploadSingleImage } from "@/services/imageService";
// import clsx from "clsx";
// import { forwardRef, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
// import toast from "react-hot-toast";
// import Loading from "@/components/shared/Loading";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { ImageUp } from "lucide-react";
// import {
//   type AspectRatio,
//   aspectRatioClass,
//   type Height,
//   type Width,
//   withClass,
// } from "@/utils/imageUploadUtils";

// type Props<
//   TFieldValues extends FieldValues,
//   TName extends Path<TFieldValues>
// > = {
//   field: ControllerRenderProps<TFieldValues, TName>;
//   remove?: () => void;
//   aspectRatio?: AspectRatio;
//   width?: Width;
//   height?: Height;
// };

// const ImageUploadForm = forwardRef<
//   HTMLDivElement,
//   Props<FieldValues, Path<FieldValues>>
// >(function ImageUploadForm(
//   { field, remove, aspectRatio = "1/1", width = "40", height = "40" },
//   ref
// ) {
//   const [uploading, setUploading] = useState(false);

//   const handleUploadSuccess = (imageId: string) => {
//     field.onChange(imageId);
//   };

//   const handleRemoveImage = async () => {
//     field.onChange("");
//     field.value && remove && remove();

//     if (field.value) {
//       await deleteImage(field.value);
//     }
//   };

//   const onDrop = async (acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     if (!file) return;

//     try {
//       setUploading(true);
//       const uploaded = await uploadSingleImage(file);
//       if (uploaded?.data?.id) {
//         handleUploadSuccess(uploaded.data.id);
//       }
//     } catch (error) {
//       toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const maxSize = 5 * 1024 * 1024;
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "image/jpeg": [],
//       "image/jpg": [],
//       "image/png": [],
//       "image/webp": [],
//     },
//     maxSize,
//     multiple: false,
//     onDropRejected: (rejections) => {
//       rejections.forEach(({ errors, file }) => {
//         errors.forEach((error) => {
//           if (error.code === "file-too-large") {
//             toast.error(
//               `ไฟล์ ${file.name} มีขนาดเกิน ${maxSize / (1024 * 1024)}MB`
//             );
//           }
//         });
//       });
//     },
//   });

//   // For demo purposes, use a placeholder image URL when no NEXT_PUBLIC_IMAGE_HOST_URL is set
//   const getImageUrl = (imageId: string) => {
//     const baseUrl = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;
//     if (baseUrl) {
//       return `${baseUrl}/${imageId}`;
//     }
//     // Fallback for demo - in production you should always have the base URL
//     return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
//       "Uploaded Image"
//     )}`;
//   };

//   return (
//     <div ref={ref} className={clsx("relative", withClass(width, height))}>
//       <div className="relative w-full h-full flex justify-center items-center border-2 border-dashed">
//         {uploading && (
//           <div className="absolute top-0 left-0 w-full h-full bg-gray-50 flex items-center justify-center z-50">
//             <Loading size={40} />
//           </div>
//         )}

//         {field.value ? (
//           <div
//             className={clsx(
//               "relative w-full max-h-full",
//               aspectRatioClass[aspectRatio]
//             )}
//           >
//             <Image
//               src={getImageUrl(field.value) || "/placeholder.svg"}
//               alt="Uploaded"
//               sizes="300px"
//               fill
//               style={{ objectFit: "contain" }}
//             />
//             <button
//               type="button"
//               onClick={handleRemoveImage}
//               className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
//             >
//               ลบ
//             </button>
//           </div>
//         ) : (
//           <div
//             {...getRootProps()}
//             className="w-full h-full flex flex-col justify-center items-center gap-2 p-2 cursor-pointer"
//           >
//             <Input
//               {...getInputProps()}
//               id="photo"
//               type="file"
//               className="hidden"
//             />
//             <div className="text-[14px] text-center font-semibold">
//               <ImageUp className="text-primary" />
//             </div>
//             <div className="text-[12px] text-gray-400 text-center">
//               ไฟล์ .jpg, .png, .webp ไม่เกิน 5MB.
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default ImageUploadForm;

"use client";

import type React from "react";

import { deleteImage, uploadSingleImage } from "@/services/imageService";
import clsx from "clsx";
import { forwardRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import toast from "react-hot-toast";
import Loading from "@/components/shared/Loading";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ImageUp } from "lucide-react";
import {
  type AspectRatio,
  aspectRatioClass,
  type Height,
  type Width,
  withClass,
} from "@/utils/imageUploadUtils";

type Props<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  remove?: () => void;
  aspectRatio?: AspectRatio;
  width?: Width;
  height?: Height;
};

// Create the inner component with proper generics
function ImageUploadFormInner<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  {
    field,
    remove,
    aspectRatio = "1/1",
    width = "40",
    height = "40",
  }: Props<TFieldValues, TName>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [uploading, setUploading] = useState(false);

  const handleUploadSuccess = (imageId: string) => {
    field.onChange(imageId);
  };

  const handleRemoveImage = async () => {
    field.onChange("");
    field.value && remove && remove();

    if (field.value) {
      await deleteImage(field.value);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await uploadSingleImage(file);
      if (uploaded?.data?.id) {
        handleUploadSuccess(uploaded.data.id);
      }
    } catch (error) {
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  const maxSize = 5 * 1024 * 1024;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize,
    multiple: false,
    onDropRejected: (rejections) => {
      rejections.forEach(({ errors, file }) => {
        errors.forEach((error) => {
          if (error.code === "file-too-large") {
            toast.error(
              `ไฟล์ ${file.name} มีขนาดเกิน ${maxSize / (1024 * 1024)}MB`
            );
          }
        });
      });
    },
  });

  // For demo purposes, use a placeholder image URL when no NEXT_PUBLIC_IMAGE_HOST_URL is set
  const getImageUrl = (imageId: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;
    if (baseUrl) {
      return `${baseUrl}/${imageId}`;
    }
    // Fallback for demo - in production you should always have the base URL
    return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
      "Uploaded Image"
    )}`;
  };

  return (
    <div ref={ref} className={clsx("relative", withClass(width, height))}>
      <div className="relative w-full h-full flex justify-center items-center border-2 border-dashed">
        {uploading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-50 flex items-center justify-center z-50">
            <Loading size={40} />
          </div>
        )}

        {field.value ? (
          <div
            className={clsx(
              "relative w-full max-h-full",
              aspectRatioClass[aspectRatio]
            )}
          >
            <Image
              src={getImageUrl(field.value) || "/placeholder.svg"}
              alt="Uploaded"
              sizes="300px"
              fill
              style={{ objectFit: "contain" }}
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
          <div
            {...getRootProps()}
            className="w-full h-full flex flex-col justify-center items-center gap-2 p-2 cursor-pointer"
          >
            <Input
              {...getInputProps()}
              id="photo"
              type="file"
              className="hidden"
            />
            <div className="text-[14px] text-center font-semibold">
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

// Use forwardRef with proper typing to maintain generics
const ImageUploadForm = forwardRef(ImageUploadFormInner) as <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  props: Props<TFieldValues, TName> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => ReturnType<typeof ImageUploadFormInner>;

export default ImageUploadForm;
