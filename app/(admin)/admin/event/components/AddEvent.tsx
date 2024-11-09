"use client";

import * as React from "react";

// data picker
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";

// Form valiation lib
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// drag and drop
// import { useDropzone } from "react-dropzone";

// import ResponsiveImage from "@/components/shared/ResponsiveImage";
// import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react";
// import Loading from "@/components/shared/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import axios from "axios";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { GroupBuyEventForm } from "./forms/GroupBuyEventForm";
// import { Separator } from "@/components/ui/separator";
import { FormSwitcher } from "./forms/FormSwitcher";
import { eventForms } from "./forms/eventForms";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useEventStore } from "@/state-stores/admin/adminEventStore";

// // zod schema
// const formSchema = z.object({
//   name: z
//     .string({ required_error: "กรุณากรอกชื่อกิจกรรม" })
//     .trim()
//     .min(1, "กรุณากรอกชื่อกิจกรรม"),
//   images: z
//     .array(
//       z.object({
//         name: z.string(),
//         size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
//         type: z.enum([
//           "image/jpeg",
//           "image/jpg",
//           "image/png",
//           "image/gif",
//           "image/webp",
//         ]),
//         file: z.any(),
//       }),
//       { required_error: "เลือกอย่างน้อย 1 รูป" }
//     )
//     .nonempty("เลือกอย่างน้อย 1 รูป"),
//   description: z
//     .string({ required_error: "กรุณาระบุคำอธิบาย" })
//     .trim()
//     .min(1, "กรุณากรอกคำอธิบายกิจกรรม"),
//   discountPrice: z.number({
//     required_error: "กรุณาระบุราคาส่วนลด",
//     invalid_type_error: "ระบุราคาส่วนลดเป็นตัวเลขเท่านั้น",
//   }),
//   discountPercent: z.number({
//     required_error: "กรุณาระบุเปอร์เซ็นต์ส่วนลด",
//     invalid_type_error: "ระบุเปอร์เซ็นต์ส่วนลดเป็นตัวเลขเท่านั้น",
//   }),
//   startDate: z.string({ required_error: "กรุณาเลือกวันที่และเวลาเริ่มต้น" }),
//   endDate: z.string({ required_error: "กรุณาเลือกวันที่และเวลาสิ้นสุด" }),
// });

// export type FormType = z.infer<typeof formSchema>;

export default function AddEvent() {
  const selectedEventForm = useEventStore((state) => state.selectedEventForm);

  // const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(
  //   null
  // );
  // const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(
  //   null
  // );

  // const setProductLists = useProductStore((state) => state.setProductLists);

  // const [isLoading, setIsLoading] = React.useState(false);
  // const [errorMessage, setErrorMessage] = React.useState("");
  // const [success, setSuccess] = React.useState(false);
  // const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  //   setValue,
  //   trigger,
  //   getValues,
  // } = useForm<FormType>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: undefined,
  //     description: undefined,
  //     images: [],
  //     discountPrice: undefined,
  //     discountPercent: undefined,
  //     startDate: undefined,
  //     endDate: undefined,
  //   },
  // });

  // const onDrop = (acceptedFiles: File[]) => {
  //   const newImages = acceptedFiles.map((file) => ({
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     file: file,
  //   }));

  //   // Clear previous images and set the new image
  //   setValue("images", newImages as never);
  //   trigger("images");

  //   // Update image previews to show the latest image
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImagePreviews([reader.result as string]); // Only keep the latest image preview
  //   };
  //   reader.readAsDataURL(newImages[0].file);
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

  // use code below for dropzone  if need to select multiple image
  // const onDrop = (acceptedFiles: File[]) => {
  //   const newImages = acceptedFiles.map((file) => ({
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     file: file,
  //   }));

  //   const currentImages = getValues("images") || [];
  //   const updatedImages = [...currentImages, ...newImages];

  //   setValue("images", updatedImages as never);
  //   trigger("images");

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

  // const onSubmit = async (data: FormType) => {
  // const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  //   setSuccess(false);
  //   setErrorMessage("");
  //   setIsLoading(true);
  //   console.log(data);
  //   const formData = new FormData();

  //   // เพิ่มไฟล์ลงใน FormData
  //   data.images.forEach((image: any) => {
  //     formData.append("images", image.file);
  //   });

  //   // ใช้ Object.entries เพื่อเพิ่มฟิลด์ข้อมูลอื่นๆ
  //   Object.entries(data).forEach(([key, value]) => {
  //     if (key !== "images") {
  //       // ยกเว้นฟิลด์ images เพราะเราได้เพิ่มไปแล้ว
  //       formData.append(key, value);
  //     }
  //   });

  //   // แสดงข้อมูลใน form
  //   formData.forEach((value, key) => {
  //     console.log(key, value);
  //   });

  //   const response = await axios.post(
  //     `${process.env.NEXT_PUBLIC_API_URL}/products`,
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );

  //   const newProducdts = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_URL}/products`
  //   );

  //   setProductLists(newProducdts.data);

  //   if (response.data.error) {
  //     setErrorMessage(response.data.message);
  //     return;
  //   }

  //   reset();
  //   setImagePreviews([]);
  //   setIsLoading(false);
  //   setSuccess(true);
  // };

  // const onError = (errors: unknown) => {
  //   console.error("Validation errors:", errors);
  //   setErrorMessage("เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง");
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มกิจกรรม
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] h-fit p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">เพิ่มกิจกรรม</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-10">
            <div className="flex justify-end items-center gap-2 mt-1">
              <h1>เลือกกิจกรรม </h1>
              <div
                className={cn(
                  "flex h-[52px] items-center justify-center"
                  // isCollapsed ? "h-[52px]" : "px-2"
                )}
              >
                <FormSwitcher isCollapsed={false} forms={eventForms} />
              </div>
            </div>
            {/* <h1 className="text-xl font-bold">เพิ่มกิจกรรม</h1> */}
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            {/* <ScrollArea className="h-[calc(100vh-200px)]"> */}
            {/* <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="name">ชื่อกิจกรรม</label>
                  <input
                    {...register("name")}
                    id="name"
                    placeholder="กรอกชื่อกิจกรรม"
                    className="border p-2 rounded"
                  />
                  {errors.name && (
                    <p className="text-[12px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="photo">รูปกิจกรรม</label>
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
                    <label htmlFor="description">
                      คำอธิบายเกี่ยวกับกิจกรรม
                    </label>
                    <textarea
                      {...register("description")}
                      id="description"
                      placeholder="กรอกคำอธิบาย"
                      className="border p-2 rounded"
                    />
                    {errors.description && (
                      <p className="text-[12px] text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="discountPrice">ราคาส่วนลด</label>
                      <input
                        {...register("discountPrice", {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        id="discountPrice"
                        placeholder="ระบุราคาส่วนลด"
                        className="border p-2 rounded"
                      />
                      {errors.discountPrice && (
                        <p className="text-[12px] text-red-500">
                          {errors.discountPrice.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="discountPercent">เปอร์เซ็นต์ส่วนลด</label>
                      <input
                        {...register("discountPercent", {
                          setValueAs: (value) => Number(value),
                        })}
                        type="number"
                        id="discountPercent"
                        placeholder="ระบุเปอร์เซ็นต์ส่วนลด"
                        className="border p-2 rounded"
                      />
                      {errors.discountPercent && (
                        <p className="text-[12px] text-red-500">
                          {errors.discountPercent.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="startDate">
                        เลือกวันที่และเวลาเริ่มต้น
                      </label>
                      <DatePicker
                        {...register("startDate", {
                          setValueAs: (value) => value,
                        })}
                        selected={selectedStartDate}
                        onChange={(date) => {
                          setSelectedStartDate(date);
                          setValue(
                            "startDate",
                            date
                              ? date.toLocaleString("en-GB", {
                                  timeZone: "UTC",
                                })
                              : ""
                          ); // ตั้งค่าฟิลด์ใน form
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        className="border p-2 rounded"
                        timeIntervals={30} // ตั้งเวลาให้เลือกทุก ๆ 30 นาที
                        placeholderText="เลือกวันที่และเวลา"
                        isClearable
                      />
                      {errors.startDate && (
                        <p className="text-[12px] text-red-500">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="endDate">เลือกวันที่และเวลาสิ้นสุด</label>
                      <DatePicker
                        {...register("endDate", {
                          setValueAs: (value) => value,
                        })}
                        selected={selectedEndDate}
                        onChange={(date) => {
                          setSelectedEndDate(date);
                          setValue(
                            "endDate",
                            date
                              ? date.toLocaleString("en-GB", {
                                  timeZone: "UTC",
                                })
                              : ""
                          ); // ตั้งค่าฟิลด์ใน form
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy h:mm aa"
                        className="border p-2 rounded"
                        timeIntervals={30} // ตั้งเวลาให้เลือกทุก ๆ 30 นาที
                        placeholderText="เลือกวันที่และเวลา"
                        isClearable
                      />
                      {errors.endDate && (
                        <p className="text-[12px] text-red-500">
                          {errors.endDate.message}
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
                    <span className="text-sm">เพิ่มกิจกรรมใหม่สำเร็จ</span>
                  </div>
                )
              )}
              <div className="mt-6 flex justify-end items-center gap-2">
                <Button
                  size={"lg"}
                  onClick={() => reset()}
                  className="text-base bg-secondary-foreground hover:bg-secondary-foreground/80"
                >
                  ล้างข้อมูล
                </Button>
                <Button size={"lg"} type="submit" className="text-base w-fit">
                  บันทึก
                </Button>
              </div>
            </form> */}
            {selectedEventForm === "GroupBuyEvent" && <GroupBuyEventForm />}
            {/* </ScrollArea> */}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
