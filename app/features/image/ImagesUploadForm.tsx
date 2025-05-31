// "use client";

// import { useFieldArray, Control } from "react-hook-form";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { ImagePlus } from "lucide-react";
// import clsx from "clsx";
// import FileUploadForm from "@/app/features/image/ImageUploadForm";
// import {
//   AspectRatio,
//   Height,
//   Width,
//   withClass,
// } from "@/utils/imageUploadUtils";

// type Props = {
//   control: Control<any>; // you can replace `any` with your actual form type
//   aspectRatio?: AspectRatio;
//   width?: Width;
//   height?: Height;
// };

// export default function ImagesUploadForm({
//   control,
//   aspectRatio = "1/1",
//   width = "40",
//   height = "40",
// }: Props) {
//   const {
//     fields: imageFields,
//     append: appendImage,
//     remove: removeImage,
//   } = useFieldArray({
//     control,
//     name: `images`,
//   });

//   // const watchImages = useWatch({
//   //   control,
//   //   name: `images`,
//   // });

//   // เพิ่ม field ว่างอันแรกให้เสมอ
//   // useEffect(() => {
//   //   if (!watchImages || watchImages.length === 0) {
//   //     appendImage(""); // เพิ่มค่าว่าง 1 ค่า
//   //   }
//   // }, []);

//   return (
//     <div className="flex flex-wrap gap-2">
//       {imageFields.map((image, imageIndex) => (
//         <FormField
//           key={image.id}
//           control={control}
//           name={`images.${imageIndex}`}
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <FileUploadForm
//                   field={field}
//                   remove={() => removeImage(imageIndex)}
//                   width={width}
//                   height={height}
//                   aspectRatio={aspectRatio}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       ))}

//       {/* ปุ่มเพิ่มรูป */}
//       <div className={clsx(withClass(width, height))}>
//         <button
//           type="button"
//           onClick={() => appendImage("")}
//           className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 border-2 border-dashed"
//         >
//           <ImagePlus className="text-slate-200" />
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import {
//   useFieldArray,
//   Control,
//   FieldValues,
//   ArrayPath,
//   FieldArray,
//   Path,
// } from "react-hook-form";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { ImagePlus } from "lucide-react";
// import clsx from "clsx";
// import ImageUploadForm from "@/app/features/image/ImageUploadForm";
// import {
//   AspectRatio,
//   Height,
//   Width,
//   withClass,
// } from "@/utils/imageUploadUtils";

// // Define a constraint for our generic type to ensure it has an images array
// interface WithImages {
//   images: string[];
// }

// type Props<T extends FieldValues & WithImages> = {
//   control: Control<T>;
//   aspectRatio?: AspectRatio;
//   width?: Width;
//   height?: Height;
//   name?: ArrayPath<T>;
// };

// export default function ImagesUploadForm<T extends FieldValues & WithImages>({
//   control,
//   aspectRatio = "1/1",
//   width = "40",
//   height = "40",
//   name = "images" as ArrayPath<T>,
// }: Props<T>) {
//   const {
//     fields: imageFields,
//     append: appendImage,
//     remove: removeImage,
//   } = useFieldArray({
//     control,
//     name,
//   });

//   // Helper function to create a properly typed path for nested array fields
//   const getFieldPath = (index: number): ArrayPath<T> => {
//     return `${name}.${index}` as ArrayPath<T>;
//   };

//   // Create a properly typed empty field value
//   const createEmptyField = (): FieldArray<T, typeof name> => {
//     return "" as unknown as FieldArray<T, typeof name>;
//   };

//   return (
//     <div className="flex flex-wrap gap-2">
//       {imageFields.map((field, imageIndex) => (
//         <FormField
//           key={field.id}
//           control={control}
//           name={getFieldPath(imageIndex) as Path<T>}
//           render={({ field }) => (
//             <FormItem>
//               <FormControl>
//                 <ImageUploadForm
//                   field={field}
//                   remove={() => removeImage(imageIndex)}
//                   width={width}
//                   height={height}
//                   aspectRatio={aspectRatio}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       ))}

//       {/* ปุ่มเพิ่มรูป */}
//       <div className={clsx(withClass(width, height))}>
//         <button
//           type="button"
//           onClick={() => appendImage(createEmptyField())}
//           className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 border-2 border-dashed"
//         >
//           <ImagePlus className="text-slate-200" />
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  useFieldArray,
  type Control,
  type FieldValues,
  type ArrayPath,
  type FieldArray,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus } from "lucide-react";
import clsx from "clsx";
import ImageUploadForm from "./ImageUploadForm";
import {
  type AspectRatio,
  type Height,
  type Width,
  withClass,
} from "@/utils/imageUploadUtils";
import { forwardRef } from "react";

// Define a constraint for our generic type to ensure it has an images array
interface WithImages {
  images: string[];
}

type Props<T extends FieldValues & WithImages> = {
  control: Control<T>;
  aspectRatio?: AspectRatio;
  width?: Width;
  height?: Height;
  name?: ArrayPath<T>;
};

const ImagesUploadForm = forwardRef<HTMLDivElement, Props<any>>(
  function ImagesUploadForm(
    {
      control,
      aspectRatio = "1/1",
      width = "40",
      height = "40",
      name = "images" as ArrayPath<any>,
    },
    ref
  ) {
    const {
      fields: imageFields,
      append: appendImage,
      remove: removeImage,
    } = useFieldArray({
      control,
      name,
    });

    // Helper function to create a properly typed path for nested array fields
    const getFieldPath = (index: number): ArrayPath<any> => {
      return `${name}.${index}` as ArrayPath<any>;
    };

    // Create a properly typed empty field value
    const createEmptyField = (): FieldArray<any, typeof name> => {
      return "" as unknown as FieldArray<any, typeof name>;
    };

    return (
      <div ref={ref} className="flex flex-wrap gap-2">
        {imageFields.map((field, imageIndex) => (
          <FormField
            key={field.id}
            control={control}
            name={getFieldPath(imageIndex) as Path<any>}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploadForm
                    field={field}
                    remove={() => removeImage(imageIndex)}
                    width={width}
                    height={height}
                    aspectRatio={aspectRatio}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* ปุ่มเพิ่มรูป */}
        <div className={clsx(withClass(width, height))}>
          <button
            type="button"
            onClick={() => appendImage(createEmptyField())}
            className="w-full h-full flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 border-2 border-dashed"
          >
            <ImagePlus className="text-slate-200" />
          </button>
        </div>
      </div>
    );
  }
);

export default ImagesUploadForm;
