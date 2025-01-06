"use client";

import { useWatch, useForm } from "react-hook-form";
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
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DiscountType } from "@/utils/calculateDiscountedPrice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateToDatetimeLocal } from "@/utils/formatDate";
import { Label } from "@/components/ui/label";
import { SearchProductInEventForm } from "./forms/SearhProductInEventForm";
import {
  FetchAllPromotionResponseType,
  PromotionType,
} from "@/types/promotionTypes";
import {
  getAllPromotions,
  updatePromotion,
} from "@/services/promotionServices";
import { CircleX } from "lucide-react";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { useDropzone } from "react-dropzone";

// Define the schema for validation using zod
const EventFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทกิจกรรม"),
  name: z.string().min(1, "กรุณาระบุชื่อกิจกรรม"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  startAt: z.string().min(1, "กรุณาระบุวันเวลาเริ่มต้น"),
  endAt: z.string().min(1, "กรุณาระบุวันเวลาสิ้นสุด"),
  // productId: z.string().min(1, "กรุณาเลือกสินค้า"),
  discountType: z.enum(["fixed", "percent"], {
    required_error: "กรุณาเลือกประเภทส่วนลด",
    invalid_type_error: "กรุณาเลือกประเภทส่วนลด",
  }),
  discountAmount: z.coerce.number({
    required_error: "กรุณาระบุจำนวนส่วนลด",
    invalid_type_error: "กรุณาระบุจำนวนส่วนลด",
  }),
  // discountGroupAmount: z.coerce.number({
  //   required_error: "กรุณาระบุจำนวนส่วนลดสูงสุด",
  //   invalid_type_error: "กรุณาระบุจำนวนส่วนลดสูงสุด",
  // }),
  minimumPurchaseQuantity: z.coerce.number({
    required_error: "กรุณาระบุจำนวนออเดอร์เป้าหมาย",
    invalid_type_error: "กรุณาระบุจำนวนออเดอร์เป้าหมาย",
  }),
  limitQuantity: z.boolean().default(false).optional(),
  maxQuantity: z.coerce.number({
    required_error: "กรุณาระบุจำนวนสินค้า",
    invalid_type_error: "กรุณาระบุจำนวนสินค้า",
  }),
  limitQuantityPerUser: z.boolean().default(false).optional(),
  maxQuantityPerUser: z.coerce.number({
    required_error: "กรุณาระบุสูงสุดที่สั่งซื้อได้ต่อคน",
    invalid_type_error: "กรุณาระบุสูงสุดที่สั่งซื้อได้ต่อคน",
  }),
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
});

type EventFormValues = z.infer<typeof EventFormSchema>;

type Props = {
  selectedPromotion: PromotionType | null;
  openEditForm: boolean;
  setOpenEditForm: () => void;
};

export function EditEvent({
  selectedPromotion,
  openEditForm,
  setOpenEditForm,
}: Props) {
  // global state
  const selectedProductInPromotion = usePromotionStore(
    (state) => state.selectedProductInPromotion
  );

  const selectProductInPromotion = usePromotionStore(
    (state) => state.selectProductInPromotion
  );
  const selectPromotion = usePromotionStore((state) => state.selectPromotion);
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );

  // local state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema), // validate data with the schema
    defaultValues: {
      // promotion data
      type: selectedPromotion?.type || "",
      name: selectedPromotion?.name || "",
      description: selectedPromotion?.description || "",
      startAt: selectedPromotion?.startAt
        ? formatDateToDatetimeLocal(selectedPromotion.startAt)
        : "",
      endAt: selectedPromotion?.endAt
        ? formatDateToDatetimeLocal(selectedPromotion.endAt)
        : "",
      // promotion activity data
      discountType:
        (selectedPromotion?.promotionActivities?.[0]
          ?.discountType as DiscountType) || "fixed",
      discountAmount:
        selectedPromotion?.promotionActivities?.[0]?.discountAmount || 0,
      limitQuantity: selectedPromotion?.promotionActivities?.[0]?.limitQuantity,
      maxQuantity:
        selectedPromotion?.promotionActivities?.[0]?.maxQuantity || 0,
      limitQuantityPerUser:
        selectedPromotion?.promotionActivities?.[0]?.limitQuantityPerUser,
      maxQuantityPerUser:
        selectedPromotion?.promotionActivities?.[0]?.maxQuantityPerUser || 0,
      minimumPurchaseQuantity:
        selectedPromotion?.promotionActivities?.[0]?.minimumPurchaseQuantity ||
        0,
      // discountGroupAmount:selectedPromotion?.promotionActivities?.[0]?.discountGroupAmount || 0,
      images: [],
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

  useEffect(() => {
    if (selectedPromotion) {
      form.reset({
        type: selectedPromotion.type,
        name: selectedPromotion.name,
        description: selectedPromotion.description,
        startAt: selectedPromotion?.startAt
          ? formatDateToDatetimeLocal(selectedPromotion.startAt)
          : "",
        endAt: selectedPromotion?.endAt
          ? formatDateToDatetimeLocal(selectedPromotion.endAt)
          : "",
        discountType:
          (selectedPromotion?.promotionActivities?.[0]
            ?.discountType as DiscountType) || "fixed",
        discountAmount:
          selectedPromotion?.promotionActivities?.[0]?.discountAmount || 0,
        limitQuantity:
          selectedPromotion?.promotionActivities?.[0]?.limitQuantity,
        maxQuantity:
          selectedPromotion?.promotionActivities?.[0]?.maxQuantity || 0,
        limitQuantityPerUser:
          selectedPromotion?.promotionActivities?.[0]?.limitQuantityPerUser,
        maxQuantityPerUser:
          selectedPromotion?.promotionActivities?.[0]?.maxQuantityPerUser || 0,
        minimumPurchaseQuantity:
          selectedPromotion?.promotionActivities?.[0]
            ?.minimumPurchaseQuantity || 0,
        // discountGroupAmount:selectedPromotion?.promotionActivities?.[0]?.discountGroupAmount || 0,
        images: [],
      });
      // แสดงรูปภาพที่มีอยู่จาก selectedPromotion ถ้ามี
      setImagePreviews(
        selectedPromotion.images && selectedPromotion.images.length > 0
          ? [
              process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                selectedPromotion.images[0].url,
            ]
          : []
      );
    }
    selectProductInPromotion(
      selectedPromotion?.promotionActivities?.[0].product || null
    );
  }, [selectedPromotion, form]);

  const type = useWatch({
    control: form.control,
    name: "type",
  });

  const limitQuantity = useWatch({
    control: form.control,
    name: "limitQuantity",
  });
  const limitQuantityPerUser = useWatch({
    control: form.control,
    name: "limitQuantityPerUser",
  });
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });

  async function onSubmit(data: EventFormValues) {
    const PromotionFormData = new FormData();
    if (data.images && data.images.length > 0) {
      PromotionFormData.append("image", data.images[0].file);
    }

    PromotionFormData.append("type", data.type);
    PromotionFormData.append("name", data.name);
    PromotionFormData.append("description", data.description);
    PromotionFormData.append("startAt", data.startAt);
    PromotionFormData.append("endAt", data.endAt);

    try {
      // const promotionData = {
      //   type: data.type,
      //   name: data.name,
      //   description: data.description,
      //   startAt: data.startAt,
      //   endAt: data.endAt,
      //   // images: data.images,
      // };

      const promotionActivities = {
        productId: selectedProductInPromotion?.id,
        discountType: data.discountType,
        discountAmount: data.discountAmount,
        limitQuantity: data.limitQuantity,
        maxQuantity: data.maxQuantity,
        limitQuantityPerUser: data.limitQuantityPerUser,
        maxQuantityPerUser: data.maxQuantityPerUser,
        minimumPurchaseQuantity: data.minimumPurchaseQuantity,
        // discountGroupAmount: data.discountGroupAmount,
      };

      const promotionResult = await updatePromotion(
        selectedPromotion?.id || "",
        PromotionFormData
      );

      const promotionActivityResult = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/activities/${selectedPromotion?.promotionActivities?.[0].id}`,
        promotionActivities
      );

      if (promotionResult || promotionActivityResult) {
        const newPromotions: FetchAllPromotionResponseType =
          await getAllPromotions();
        setPromotionLists(newPromotions.data);

        const updateSelectedPromotion = newPromotions.data.find(
          (item: PromotionType) => item.id === selectedPromotion?.id
        );

        if (updateSelectedPromotion) {
          selectPromotion(updateSelectedPromotion);
        }
      }
      toast.success("แก้ไขกิจกรรมแล้ว");
    } catch (error) {
      toast.error("แก้ไขกิจกรรมไม่สำเร็จ");

      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  return (
    <Dialog open={openEditForm} onOpenChange={setOpenEditForm}>
      <DialogContent className="sm:max-w-[640px] h-fit p-0">
        {/* <VisuallyHidden> */}
        <DialogTitle className="hidden">แก้ไขกิจกรรม</DialogTitle>
        {/* </VisuallyHidden> */}
        <DialogDescription className="hidden">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-10">
            <h1 className="text-xl font-bold">แก้ไขกิจกรรม</h1>
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Tabs */}
                <Tabs defaultValue="event" className="w-full">
                  <ScrollArea className="h-[calc(100vh-250px)] px-2">
                    {/* Promotion data */}
                    <TabsContent value="event" className="space-y-6 px-2">
                      {/* type */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ประเภทกิจกรรม</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="เลือกกิจกรรม" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="groupbuying">
                                  groupbuying
                                </SelectItem>
                                <SelectItem value="flashsale">
                                  flashsale
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Start At */}
                      <FormField
                        control={form.control}
                        name="startAt"
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

                      {/* End At */}
                      <FormField
                        control={form.control}
                        name="endAt"
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
                        name="name"
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
                                อัพโหลดได้เฉพาะไฟล์ .jpg, .png, and .webp
                                เท่านั้น และต้องมีขนาดไม่เกิน 5MB.
                              </span>
                            </div>
                          </div>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="eventDetail" className="space-y-6 px-2">
                      {/* product reference */}
                      <Label className="mr-4 text-lg font-bold">
                        เลือกสินค้า
                      </Label>
                      <SearchProductInEventForm
                        initialProduct={
                          selectedPromotion?.promotionActivities?.[0].product
                        }
                      />
                      {/* {selectedProductInPromotion &&
                        selectedProductInPromotion.image && (
                          <div className="relative w-20 aspect-square">
                            <Image
                              fill
                              src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProductInPromotion.image}`}
                              alt={selectedProductInPromotion.sku}
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                      {selectedProductInPromotion && (
                        <>
                          <div>{selectedProductInPromotion.sku}</div>
                          <div>{selectedProductInPromotion.name}</div>
                          <div>{selectedProductInPromotion.description}</div>
                          <div>
                            ราคาตั้งต้น{" "}
                            {formatPrice(selectedProductInPromotion.price)}
                          </div>
                        </>
                      )}
                      <Separator /> */}
                      {/* discount type */}
                      <h1 className="text-lg font-bold">ตั้งค่ากิจกรรม</h1>

                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>ประเภทส่วนลด</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="fixed" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Fixed
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="percent" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Percent
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`discountAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              จำนวนส่วนลด{`(${discountType})`}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="กรอกจำนวนส่วนลด"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* show if promotion type is groupbuying */}
                      {type === "groupbuying" && (
                        <>
                          <FormField
                            control={form.control}
                            name={`minimumPurchaseQuantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>จำนวนออเดอร์เป้าหมาย</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="กรอกจำนวนออเดอร์เป้าหมาย"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* <FormField
                            control={form.control}
                            name={`discountGroupAmount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  จำนวนส่วนลดตามเป้าหมาย
                                  {`(${discountType})`}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="กรอกจำนวนส่วนลดตามเป้าหมาย"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                        </>
                      )}

                      {/* limit amount */}
                      <FormField
                        control={form.control}
                        name="limitQuantity"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0  ">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>จำกัดจำนวนของสินค้า</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* show if limitQuantity is true */}

                      {limitQuantity && (
                        <>
                          <FormField
                            control={form.control}
                            name={`maxQuantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>จำนวนสินค้า</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
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
                            name="limitQuantityPerUser"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0  ">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>จำกัดจำนวนสั่งซื้อต่อคน</FormLabel>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* show if limitQuantityPerUser is true */}
                          {limitQuantity && limitQuantityPerUser && (
                            <FormField
                              control={form.control}
                              name={`maxQuantityPerUser`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    จำนวนสูงสุดที่สั่งซื้อได้ต่อคน
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      placeholder="กรอกจำนวนสูงสุดที่สั่งซื้อได้ต่อคน"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </>
                      )}
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
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
