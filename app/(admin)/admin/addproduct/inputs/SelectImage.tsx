"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageType } from "../AddProductForm";

interface SelectImageProps {
  item?: ImageType;
  handleFileChange: (value: File) => void;
}
export default function SelectImage({
  item,
  handleFileChange,
}: SelectImageProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png"] }, //if you want to accept all image type
    // accept: { "image/jpeg": [".jpeg"], "image/png": [".png"] },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-r-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center"
    >
      <input {...getInputProps} className="hidden" />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>+ {item?.color} Image</p>
      )}
    </div>
  );
}
