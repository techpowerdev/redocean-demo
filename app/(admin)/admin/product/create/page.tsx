"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { CircleX } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { createProduct, getAllProducts } from "@/services/productServices";
import { useRouter } from "next/navigation";

// Define the schema for validation using zod
const ProductFormSchema = z.object({
  sku: z
    .string({ required_error: "กรุณาระบุรหัสสินค้า" })
    .trim()
    .min(1, "กรุณาระบุรหัสสินค้า"),
  name: z
    .string({ required_error: "กรุณาระบุชื่อสินค้า" })
    .trim()
    .min(1, "กรุณาระบุชื่อสินค้า"),
  description: z
    .string({ required_error: "กรุณาระบุคำอธิบาย" })
    .trim()
    .min(5, "กรุณาระบุคำอธิบายอย่างน้อย 5 ตัวอักษร"),
  images: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
        type: z.enum([
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ]),
        file: z.any(),
      })
    )
    .optional()
    .nullable(), // <--- ปรับให้เป็น optional
  price: z.coerce.number({
    required_error: "กรุณาระบุราคาสินค้า",
    invalid_type_error: "กรุณาระบุราคาสินค้า",
  }),
  stock: z.coerce.number({
    required_error: "กรุณาระบุจำนวนสินค้า",
    invalid_type_error: "กรุณาระบุจำนวนสินค้า",
  }),
});

// Create form input type
type ProductFormValues = z.infer<typeof ProductFormSchema>;

export default function CreateProduct() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const setProductLists = useProductStore((state) => state.setProductLists);

  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema), // validate data with the schema
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      images: [],
      price: 0,
      stock: 0,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    // Clear previous images and set the new image
    form.setValue("images", newImages as never);
    form.trigger("images");

    // Update image previews to show the latest image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews([reader.result as string]); // Only keep the latest image preview
    };
    reader.readAsDataURL(newImages[0].file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  async function onSubmit(data: ProductFormValues) {
    const ProductFormData = new FormData();

    if (data.images && data.images.length > 0) {
      ProductFormData.append("image", data.images[0].file);
    }

    ProductFormData.append("sku", data.sku);
    ProductFormData.append("name", data.name);
    ProductFormData.append("description", data.description);
    ProductFormData.append("price", data.price.toString());
    ProductFormData.append("stock", data.stock.toString());

    ProductFormData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const productResult = await createProduct(ProductFormData);

      if (productResult) {
        const updatedProducts = await getAllProducts();

        setProductLists(updatedProducts.data);
      }
      toast.success("เพิ่มสินค้าแล้ว");
      router.push("/admin/product");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  }

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      console.log(form.formState.errors);
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 p-2">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสสินค้า</FormLabel>
                <FormControl>
                  <Input placeholder="กรอกรหัสสินค้า" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อสินค้า</FormLabel>
                <FormControl>
                  <Input placeholder="กรอกชื่อสินค้า" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รายละเอียดของสินค้า</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="กรอกรายละเอียดสินค้า"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Image */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <div className="grid w-full items-center gap-1.5">
                <FormLabel htmlFor="photo">รูปสินค้า</FormLabel>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 p-2 text-center"
                >
                  <Input
                    {...getInputProps()}
                    id="photo"
                    type="file"
                    className=""
                  />
                  <span className="text-[14px] text-center font-semibold">
                    ลากและวางรูปภาพที่นี่, หรือคลิกเพื่อเลือก
                  </span>
                  <FormMessage />
                  <div className="flex justify-start items-center gap-x-2 gap-y-4 flex-wrap my-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative w-56 border-2 border-accent-800 rounded-md"
                      >
                        <ResponsiveImage
                          src={preview}
                          alt={`Preview ${index}`}
                        />
                        <CircleX
                          onClick={(event) => {
                            event.stopPropagation();

                            // ตรวจสอบว่ามี images อยู่หรือไม่
                            const currentImages =
                              form.getValues("images") ?? [];

                            // กรองข้อมูลเพื่อเอารูปภาพที่ไม่ต้องการออก
                            const updatedImages =
                              currentImages?.filter((_, i) => i !== index) ??
                              [];

                            // ตั้งค่า images ใหม่
                            form.setValue("images", updatedImages as never);

                            // อัพเดท preview images
                            setImagePreviews((prev) =>
                              prev.filter((_, i) => i !== index)
                            );

                            // ตรวจสอบค่าของ images ใหม่อีกครั้ง
                            form.trigger("images");
                          }}
                          size={20}
                          className="text-red-400 hover:text-red-500 cursor-pointer absolute -top-3 -right-1"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[12px] text-gray-400 text-center">
                    อัพโหลดได้เฉพาะไฟล์ .jpg, .png, and .webp เท่านั้น
                    และต้องมีขนาดไม่เกิน 5MB.
                  </span>
                </div>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name={`price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ราคา</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="กรอกราคาสินค้า"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`stock`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนสต็อค</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    // min={0}
                    placeholder="กรอกจำนวนสินค้า"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}
