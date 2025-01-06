"use client";

import ImageLibrary from "@/app/features/image/ImageLibrary";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { ImageType } from "@/types/imageTypes";
import { useState } from "react";

export default function ProductForm() {
  const [isLibraryOpen, setLibraryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageType[] | null>(
    null
  );

  return (
    <div>
      <button onClick={() => setLibraryOpen(true)}>เลือกรูปภาพ</button>
      <div className="grid grid-cols-6 gap-4">
        {selectedImages &&
          selectedImages.map((image) => (
            <div key={image.id}>
              <div className="w-full h-auto">
                <ResponsiveImage
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${image.url}`}
                  alt="Selected Image"
                />
              </div>
            </div>
          ))}
      </div>
      <ImageLibrary
        isOpen={isLibraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={setSelectedImages}
      />
    </div>
  );
}
