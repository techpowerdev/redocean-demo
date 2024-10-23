"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Form valiation lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// drag and drop
import { useDropzone } from "react-dropzone";

import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
import Loading from "@/components/shared/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// zod schema
const formSchema = z.object({
  productName: z
    .string({ required_error: "กรุณากรอกชื่อสินค้า" })
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า"),
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
      }),
      { required_error: "เลือกอย่างน้อย 1 รูป" }
    )
    .nonempty("เลือกอย่างน้อย 1 รูป"),
  description: z
    .string({ required_error: "กรุณาระบุคำอธิบาย" })
    .trim()
    .min(20, "กรุณาระบุคำอธิบายอย่างน้อย 20 ตัวอักษร"),
  price: z
    .number({
      required_error: "กรุณาระบุราคาขาย",
      invalid_type_error: "ระบุราคาเป็นตัวเลขเท่านั้น",
    })
    .min(10, "ราคาขั้นตำ่ 10 บาท"),
  promotionPrice: z
    .number({
      required_error: "กรุณาระบุราคาโปรโมชั่น",
      invalid_type_error: "ระบุราคาเป็นตัวเลขเท่านั้น",
    })
    .min(10, "ราคาขั้นตำ่ 10 บาท"),
  // contactNumber: z
  //   .string({
  //     required_error: "Contact is required",
  //   })
  //   .regex(/^[0-9]{10}$/, "Invalid phone number"),
  inStock: z.boolean().optional(),
  stock: z.number({
    required_error: "กรุณาระบุจำนวนสินค้าในสต็อค",
    invalid_type_error: "ระบุจำนวนเป็นตัวเลขเท่านั้น",
  }),
});

export type FormData = z.infer<typeof formSchema>;

export default function AddProduct() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: undefined,
      images: [],
      description: undefined,
      price: undefined,
      promotionPrice: undefined,
      inStock: false,
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

    const currentImages = getValues("images") || [];
    const updatedImages = [...currentImages, ...newImages];

    setValue("images", updatedImages as never);
    trigger("images");

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
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

  const onSubmit = async (data: FormData) => {
    setSuccess(false);
    setErrorMessage("");
    setIsLoading(true);
    console.log(data);
    // const submittionResult = await createAd({
    //   ...data,
    //   userEmail: session.data.user.email,
    // });
    // const submittionResult = () => console.log("submit");
    // console.log("submittionResult:", submittionResult);
    // if (submittionResult.error) {
    //   setErrorMessage(submittionResult.message);
    //   return;
    // }
    reset();
    setImagePreviews([]);
    setIsLoading(false);
    setSuccess(true);
  };

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
    setErrorMessage("เกิดข้อมูลผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">เพิ่มสินค้า</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold">เพิ่มสินค้า</h1>
          </CardHeader>
          <CardContent className="-mt-3">
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="productName">ชื่อสินค้า</Label>
                  <Input
                    {...register("productName")}
                    id="productName"
                    placeholder="กรอกชื่อสินค้า"
                  />
                  {errors.productName && (
                    <p className="text-[12px] text-red-500">
                      {errors.productName.message}
                    </p>
                  )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="photo">รูปสินค้า</Label>
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
                    {errors.images?.message &&
                      typeof errors.images.message === "string" && (
                        <p className="text-[12px] text-red-500">
                          {errors.images.message}
                        </p>
                      )}
                    <div className="flex justify-start items-center gap-x-2 gap-y-4 flex-wrap my-2">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-[120px] xl:w-[50px] h-[120px] xl:h-[50px] border-2 border-accent-800 rounded-md"
                        >
                          <ResponsiveImage
                            src={preview}
                            alt={`Preview ${index}`}
                          />
                          <CircleX
                            onClick={(event) => {
                              event.stopPropagation();
                              const updatedImages = getValues("images").filter(
                                (_, i) => i !== index
                              );
                              setValue("images", updatedImages as never);
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                              trigger("images");
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
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">คำอธิบายเกี่ยวกับสินค้า</Label>
                    <Textarea
                      {...register("description")}
                      id="description"
                      placeholder="กรอกคำอธิบาย"
                    />
                    {errors.description && (
                      <p className="text-[12px] text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="price">ราคา</Label>
                      <Input
                        {...register("price", {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        min={1}
                        id="price"
                        placeholder="ระบุราคาขาย"
                      />
                      {errors.price && (
                        <p className="text-[12px] text-red-500">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="promotionPrice">ราคาโปรโมชั่น</Label>
                      <Input
                        {...register("promotionPrice", {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        min={1}
                        id="promotionPrice"
                        placeholder="ระบุราคาโปรโมชั่น"
                      />
                      {errors.promotionPrice && (
                        <p className="text-[12px] text-red-500">
                          {errors.promotionPrice.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        {...register("inStock")}
                        id="inStock"
                        className="w-4 h-4 accent-black"
                      />

                      <label
                        htmlFor="inStock"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        มีสินค้าพร้อมส่ง
                      </label>
                      {errors.inStock && (
                        <p className="text-[12px] text-red-500">
                          {errors.inStock.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="stock">จำนวนสินค้าในสต็อค</Label>
                      <Input
                        {...register("stock", {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        min={1}
                        id="stock"
                        placeholder="ระบุจำนวนสินค้า"
                      />
                      {errors.stock && (
                        <p className="text-[12px] text-red-500">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="bg-gray-200 relative flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                  <CircleAlert size={20} className="text-gray-400" />
                  <span className="text-sm">กำลังบันทึก...</span>
                  <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <Loading size={26} />
                  </div>
                </div>
              ) : errorMessage.length > 0 ? (
                <div className="bg-red-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                  <CircleAlert size={20} className="text-red-500" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              ) : (
                success && (
                  <div className="bg-green-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                    <CircleCheckBig size={20} className="text-green-500" />
                    <span className="text-sm">เพิ่มสินค้าใหม่สำเร็จ</span>
                  </div>
                )
              )}
              <div className="mt-6 flex justify-end items-center gap-2">
                <Button
                  onClick={() => reset()}
                  className="bg-secondary-foreground hover:bg-secondary-foreground/80"
                >
                  ล้างข้อมูล
                </Button>
                <Button type="submit" className="w-fit">
                  บันทึก
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
