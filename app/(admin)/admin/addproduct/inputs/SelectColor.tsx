"use client";

import { useCallback, useEffect, useState } from "react";
import SelectImage from "./SelectImage";
import { ImageType } from "../AddProductForm";

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated: boolean;
}

export default function SelectColor({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
}: SelectColorProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }
  }, [isProductCreated]);

  const handleFileChange = useCallback((value: File) => {
    console.log("handle file:", value);
    setFile(value);
    addImageToState({ ...item, image: value });
  }, []);

  const handleCheck = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.checked);

    console.log("handle check");

    if (!e.target.checked) {
      setFile(null);
      removeImageFromState(item);
    }
  }, []);
  return (
    <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-slate-200 items-center p-2">
      <div className="flex flex-row gap-2 items-center h-[60px]">
        <input
          type="checkbox"
          id={item.color}
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="font-normal cursor-pointer">
          {item.color}
        </label>
      </div>
      <>
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {file && (
          <div className="flex flex-row gap-2 text-sm col-span-2 items-center justify-between">
            <p>{file?.name}</p>
            <div className=" w-[70px]">
              <button
                className="btn btn-xs btn-primary text-xs font-extralight"
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              >
                Cancle
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
