"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { SearchProductInEventForm } from "./SearhProductInEventForm";
import { useEventStore } from "@/state-stores/admin/adminEventStore";
import { Label } from "@/components/ui/label";

// Define the schema for validation using zod
const EventFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทกิจกรรม"),
  title: z.string().min(1, "กรุณาระบุชื่อกิจกรรม"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
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
  startTime: z.string().min(1, "กรุณาระบุวันเวลาเริ่มต้น"),
  endTime: z.string().min(1, "กรุณาระบุวันเวลาสิ้นสุด"),
  productName: z.string().min(1, "กรุณาระบุชื่อสินค้า"),
  productDescription: z.string().min(1, "กรุณาระบุรายละเอียดสินค้า"),
  productImages: z.array(z.string()),
  productPrice: z.coerce.number().gte(1, "กรุณาระบุราคาขายตั้งต้น"),
  productStock: z.coerce.number().gte(1, "กรุณาระบุจำนวนสินค้า"),
  targetAmount: z.coerce.number().gte(1, "กรุณาระบุจำนวนออเดอร์เป้าหมาย"),
  finalPrice: z.coerce.number().gte(1, "กรุณาระบุราคาขายตามเป้าหมาย"),
});

// Create form input type
type EventFormValues = z.infer<typeof EventFormSchema>;

export function GroupBuyEventForm() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const selectedProductInEvent = useEventStore(
    (state) => state.selectedProductInEvent
  );
  const setEventLists = useEventStore((state) => state.setEventLists);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema), // validate data with the schema
    defaultValues: {
      // event data
      type: "groupBuyEvent",
      title: "",
      description: "",
      images: [],
      startTime: "",
      endTime: "",
      // group buy event data
      productName: "",
      productDescription: "",
      productImages: [],
      productPrice: 0,
      productStock: 0,
      targetAmount: 0,
      finalPrice: 0,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    const currentImages = form.getValues("images") || [];
    const updatedImages = [...currentImages, ...newImages];

    form.setValue("images", updatedImages as never);
    form.trigger("images");

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

  function onSubmit(data: EventFormValues) {
    const EventFormData = new FormData();

    data.images.forEach((image: any) => {
      EventFormData.append("images", image.file);
    });

    EventFormData.append("type", "groupBuyEvent");
    EventFormData.append("title", data.title);
    EventFormData.append("description", data.description);
    EventFormData.append("startTime", data.startTime);
    EventFormData.append("endTime", data.endTime);

    EventFormData.forEach((value, key) => {
      console.log(key, value);
    });

    const createEvent = async () => {
      let eventResult: any; // Declare eventResult here
      try {
        // Step 1: สร้าง Event ก่อน
        eventResult = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/events`,
          EventFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Step 2: สร้าง Group Buy Event
        const GroupBuyEventFormData = {
          productName: data.productName,
          productDescription: data.productDescription,
          productImages: data.productImages,
          productPrice: data.productPrice,
          productStock: data.productStock,
          targetAmount: data.targetAmount,
          finalPrice: data.finalPrice,
          eventId: eventResult.data.id,
        };

        const GroupBuyEventResult = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/events/group-buy`,
          GroupBuyEventFormData
        );

        console.log(GroupBuyEventResult);
      } catch (error) {
        console.error("Error occurred:", error);

        // Step 3: ตรวจสอบชนิดของ error
        if (axios.isAxiosError(error)) {
          console.error("Error message:", error.message);
          console.error("Error response data:", error.response?.data);

          // Step 4: หากการบันทึก Group Buy Event ล้มเหลว ให้ลบ Event ที่สร้างขึ้นไปแล้ว
          if (error.response && error.response.status !== 200) {
            try {
              await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/events/${eventResult.data.id}`
              );
              console.log(
                "Rolled back event creation due to failure in group-buy event creation."
              );
            } catch (rollbackError) {
              console.error(
                "Failed to rollback event creation:",
                rollbackError
              );
            }
          }
        } else {
          // หาก error ไม่ใช่ AxiosError
          console.error("Unexpected error:", error);
        }
      }

      const newEvents = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events/all`
      );

      setEventLists(newEvents.data);
    };

    createEvent();
  }

  // function onSubmit(data: EventFormValues) {
  //   const EventFormData = new FormData();

  //   data.images.forEach((image: any) => {
  //     EventFormData.append("images", image.file);
  //   });

  //   EventFormData.append("type", "groupBuyEvent");
  //   EventFormData.append("title", data.title);
  //   EventFormData.append("description", data.description);
  //   EventFormData.append("startTime", data.startTime);
  //   EventFormData.append("endTime", data.endTime);

  //   // แสดงข้อมูลใน form
  //   EventFormData.forEach((value, key) => {
  //     console.log(key, value);
  //   });

  //   const createEvent = async () => {
  //     try {
  //       const eventResult = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/events`,
  //         EventFormData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       // GroupBuyEventFormData
  //       const GroupBuyEventFormData = {
  //         productName: data.productName,
  //         productDescription: data.productDescription,
  //         productImages: data.productImages,
  //         productPrice: data.productPrice,
  //         productStock: data.productStock,
  //         targetAmount: data.targetAmount,
  //         finalPrice: data.finalPrice,
  //         eventId: eventResult.data.id,
  //       };

  //       const GroupBuyEventResult = await axios.post(
  //         `${process.env.NEXT_PUBLIC_API_URL}/events/group-buy`,
  //         GroupBuyEventFormData
  //       );
  //       console.log(GroupBuyEventResult);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   createEvent();
  // }

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  useEffect(() => {
    // ดึงค่าจาก product ที่เลือก มาใช้เลย
    if (selectedProductInEvent) {
      const imageUrls = selectedProductInEvent.images?.map(
        (image) => image.url
      );
      form.setValue(`productDescription`, selectedProductInEvent.description);
      form.setValue(`productName`, selectedProductInEvent.name);
      imageUrls && form.setValue(`productImages`, imageUrls);
    }
  }, [form, selectedProductInEvent]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Tabs */}
        <Tabs defaultValue="event" className="w-full">
          <ScrollArea className="h-[calc(100vh-250px)] px-2">
            {/* Event data */}
            <TabsContent value="event" className="space-y-6 px-2">
              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันเวลาเริ่มต้น</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันเวลาเริ่มต้น</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={
                          field.value ? new Date(field.value) : new Date()
                        } // Handle the case where the value might be null
                        onChange={(date: Date | null) => field.onChange(date)} // Ensure the type is Date | null
                        showTimeSelect
                        dateFormat="Pp"
                        className="border" // Optional, for custom styling
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>วันเวลาสิ้นสุด</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อกิจกรรม</FormLabel>
                    <FormControl>
                      <Input placeholder="กรอกชื่อกิจกรรม" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รายละเอียดกิจกรรม</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="กรอกรายละเอียดกิจกรรม"
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
                    <FormLabel htmlFor="photo">รูปกิจกรรม</FormLabel>
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
                                const updatedImages = form
                                  .getValues("images")
                                  .filter((_, i) => i !== index);
                                form.setValue("images", updatedImages as never);
                                setImagePreviews((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
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
            </TabsContent>

            {/* GroupBuyEvent data */}
            <TabsContent value="eventDetail" className="space-y-6 px-2">
              {/* product reference */}
              <Label className="mr-4">เลือกสินค้า</Label>
              <SearchProductInEventForm />

              <FormField
                control={form.control}
                name={`productName`}
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
                name={`productDescription`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รายละเอียดสินค้า</FormLabel>
                    <FormControl>
                      <Textarea placeholder="กรอกรายละเอียดสินค้า" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`productPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคาขายตั้งต้น</FormLabel>
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
                name={`productStock`}
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
              <FormField
                control={form.control}
                name={`targetAmount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนออเดอร์เป้าหมาย</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="กรอกจำนวนออเดอร์เป้าหมาย"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`finalPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคาขายตามเป้าหมาย</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="กรอกราคาขายตามเป้าหมาย"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </ScrollArea>

          <div className="flex flex-col gap-2 p-3">
            <TabsList className="my-2 w-full flex gap-2 justify-between">
              <TabsTrigger value="event">ย้อนกลับ</TabsTrigger>
              <TabsTrigger value="eventDetail">หน้าถัดไป</TabsTrigger>
            </TabsList>
            <div className="w-full flex justify-end">
              <Button type="submit">บันทึก</Button>
            </div>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
