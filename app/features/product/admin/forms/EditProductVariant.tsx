"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { ProductVariantType } from "@/types/fetchTypes";

// Define the schema for validation using zod
const EditProductVariantFormSchema = z.object({
  sku: z
    .string({ required_error: "กรุณาระบุรหัสสินค้า" })
    .trim()
    .min(1, "กรุณาระบุรหัสสินค้า"),
  color: z.string().trim().optional(),
  size: z.string().trim().optional(),
  price: z.coerce
    .number({ required_error: "กรุณาระบุราคาสินค้า" })
    .gte(1, "กรุณาระบุราคาสินค้า"),
  stock: z.coerce
    .number({ required_error: "กรุณาระบุจำนวนสินค้า" })
    .gte(1, "กรุณาระบุจำนวนสินค้า"),
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
    .nullable(),
});

type EditProductFormValues = z.infer<typeof EditProductVariantFormSchema>;

type Props = {
  productVariant: ProductVariantType;
  open: boolean;
  setOpen: (status: boolean) => void;
};

export function EditProductVariant({ productVariant, open, setOpen }: Props) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProduct = useProductStore((state) => state.selectProduct);

  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(EditProductVariantFormSchema), // validate data with the schema
    defaultValues: {
      // productId: selectedProduct?.id,
      sku: productVariant?.sku || "",
      color: productVariant?.color || "",
      size: productVariant?.size || "",
      price: productVariant?.price || 0,
      stock: productVariant?.stock || 0,
      images: [],
    },
  });

  useEffect(() => {
    if (productVariant) {
      form.reset({
        sku: productVariant.sku,
        color: productVariant.color,
        size: productVariant.size,
        price: productVariant.price,
        stock: productVariant.stock,
        images: [],
      });
      // แสดงรูปภาพที่มีอยู่จาก productVariant ถ้ามี
      setImagePreviews(
        productVariant.image
          ? [process.env.NEXT_PUBLIC_IMAGE_HOST_URL + productVariant.image]
          : []
      );
    }
  }, [productVariant, form]);

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

  function onSubmit(data: EditProductFormValues) {
    const ProductVariantFormData = new FormData();

    // data.images.forEach((image: any) => {
    // });
    ProductVariantFormData.append("id", productVariant?.id || "");
    ProductVariantFormData.append("sku", data.sku || "");
    ProductVariantFormData.append("color", data.color || "");
    ProductVariantFormData.append("size", data.size || "");
    ProductVariantFormData.append("price", data.price.toString());
    ProductVariantFormData.append("stock", data.stock.toString());

    if (data.images && data.images.length > 0) {
      ProductVariantFormData.append("image", data.images[0].file);
    }

    ProductVariantFormData.forEach((value, key) => {
      console.log(key, value);
    });

    const updateProductVariant = async () => {
      try {
        // Step 1: สร้าง Event ก่อน
        const productResult = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/products/variants/${productVariant?.id}`,
          ProductVariantFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (productResult) {
          const newProducts = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products/all`
          );

          const updateSelectedProduct = newProducts.data.find(
            (item: ProductVariantType) => item.id === productVariant?.productId
          );

          selectProduct(updateSelectedProduct);
          setProductLists(newProducts.data);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    updateProductVariant();
  }

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[640px] h-fit p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">เพิ่มตัวเลือกสินค้า</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-8">
            <h1 className="text-xl font-bold">เพิ่มตัวเลือกสินค้า</h1>
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[calc(100vh-250px)] px-2">
                  <div className="space-y-6 p-2">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสสินค้า</FormLabel>
                          <FormControl>
                            <Input placeholder="กรอกรหัสของสินค้า" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>สี</FormLabel>
                          <FormControl>
                            <Input placeholder="ระบุสี" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ขนาด</FormLabel>
                          <FormControl>
                            <Input placeholder="ระบุขนาด" {...field} />
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
                                        currentImages?.filter(
                                          (_, i) => i !== index
                                        ) ?? [];

                                      // ตั้งค่า images ใหม่
                                      form.setValue(
                                        "images",
                                        updatedImages as never
                                      );

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
                          <FormLabel>ราคาขาย</FormLabel>
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
                          <FormLabel>จำนวนสินค้า</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="กรอกจำนวนสินค้า"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>
                <div className="w-full flex justify-end py-3">
                  <Button type="submit">บันทึก</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
