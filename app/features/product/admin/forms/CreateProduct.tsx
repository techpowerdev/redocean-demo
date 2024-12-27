"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CirclePlus, CircleX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/state-stores/admin/adminProductStore";

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
  // images: z
  //   .array(
  //     z.object({
  //       name: z.string(),
  //       size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
  //       type: z.enum([
  //         "image/jpeg",
  //         "image/jpg",
  //         "image/png",
  //         "image/gif",
  //         "image/webp",
  //       ]),
  //       file: z.any(),
  //     }),
  //     { required_error: "กรุณาเลือกรูปสินค้า" }
  //   )
  //   .nonempty("กรุณาเลือกรูปสินค้า"),
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
  // .gte(1, "กรุณาระบุราคาสินค้า"),
  stock: z.coerce.number({
    required_error: "กรุณาระบุจำนวนสินค้า",
    invalid_type_error: "กรุณาระบุจำนวนสินค้า",
  }),
  // hasVariant: z.boolean().default(true),
});

// Create form input type
type ProductFormValues = z.infer<typeof ProductFormSchema>;

export function CreateProduct() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const setProductLists = useProductStore((state) => state.setProductLists);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema), // validate data with the schema
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      images: [],
      price: 0,
      stock: 0,
      // hasVariant: true,
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

  // multiple image
  // const onDrop = (acceptedFiles: File[]) => {
  //   const newImages = acceptedFiles.map((file) => ({
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     file: file,
  //   }));

  //   const currentImages = form.getValues("images") || [];
  //   const updatedImages = [...currentImages, ...newImages];

  //   form.setValue("images", updatedImages as never);
  //   form.trigger("images");

  //   acceptedFiles.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreviews((prev) => [...prev, reader.result as string]);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/jpeg": [],
  //     "image/jpg": [],
  //     "image/png": [],
  //     "image/webp": [],
  //   },
  //   maxSize: 5 * 1024 * 1024, // 5MB
  // });

  function onSubmit(data: ProductFormValues) {
    const ProductFormData = new FormData();

    // data.images.forEach((image: any) => {
    // });

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

    const createProduct = async () => {
      try {
        // Step 1: สร้าง Event ก่อน
        const productResult = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          ProductFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (productResult) {
          const updatedProducts = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products/all`
          );

          setProductLists(updatedProducts.data.data);
        }
        toast.success("เพิ่มสินค้าแล้ว");
      } catch (error) {
        toast.error("เพิ่มสินค้าไม่สำเร็จ");
        console.error("Error occurred:", error);
      }
    };

    createProduct();
  }

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      console.log(form.formState.errors);
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  // const hasVariant = useWatch({
  //   control: form.control,
  //   name: "hasVariant",
  // });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] h-fit p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">เพิ่มสินค้า</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-8">
            <h1 className="text-xl font-bold">เพิ่มสินค้า</h1>
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
                    {/* hasVariant */}
                    {/* <FormField
                      control={form.control}
                      name="hasVariant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0  ">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>เป็นสินค้าไม่มีตัวเลือก</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* render when hasVariant => false  */}
                    {/* {hasVariant && ( */}
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
                    {/* )} */}
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
