"use client";

import { useWatch, useForm } from "react-hook-form";
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
import toast from "react-hot-toast";

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
import { useRouter } from "next/navigation";
import { SearchProductInPromotionForm } from "@/app/features/promotion/SearchProductInPromotionForm";

// Define the schema for validation using zod
const PromotionFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทกิจกรรม"),
  name: z.string().min(1, "กรุณาระบุชื่อกิจกรรม"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  startAt: z.string().min(1, "กรุณาระบุวันเวลาเริ่มต้น"),
  endAt: z.string().min(1, "กรุณาระบุวันเวลาสิ้นสุด"),
  productId: z.string().min(1, "กรุณาเลือกสินค้า"),
  discountType: z.enum(["fixed", "percent"], {
    required_error: "กรุณาเลือกประเภทส่วนลด",
    invalid_type_error: "กรุณาเลือกประเภทส่วนลด",
  }),
  discountAmount: z.coerce
    .number({
      required_error: "กรุณาระบุจำนวนส่วนลด",
      invalid_type_error: "กรุณาระบุจำนวนส่วนลด",
    })
    .min(1, "จำนวนส่วนลดต้องมากกว่า 0"),
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

type PromotionFormValues = z.infer<typeof PromotionFormSchema>;

type Props = {
  promotion: PromotionType;
};

export function EditPromotionForm({ promotion }: Props) {
  // global state
  const selectPromotion = usePromotionStore((state) => state.selectPromotion);
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );

  // local state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(
    promotion?.promotionActivities?.[0].product ?? null
  );

  // navigation
  const router = useRouter();

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionFormSchema), // validate data with the schema
    defaultValues: {
      // promotion data
      type: promotion?.type || "",
      name: promotion?.name || "",
      description: promotion?.description || "",
      startAt: promotion?.startAt
        ? formatDateToDatetimeLocal(promotion.startAt)
        : "",
      endAt: promotion?.endAt ? formatDateToDatetimeLocal(promotion.endAt) : "",
      // promotion activity data
      productId: selectedProduct?.id ?? "",
      discountType:
        (promotion?.promotionActivities?.[0]?.discountType as DiscountType) ||
        "fixed",
      discountAmount: promotion?.promotionActivities?.[0]?.discountAmount || 0,
      limitQuantity: promotion?.promotionActivities?.[0]?.limitQuantity,
      maxQuantity: promotion?.promotionActivities?.[0]?.maxQuantity || 0,
      limitQuantityPerUser:
        promotion?.promotionActivities?.[0]?.limitQuantityPerUser,
      maxQuantityPerUser:
        promotion?.promotionActivities?.[0]?.maxQuantityPerUser || 0,
      minimumPurchaseQuantity:
        promotion?.promotionActivities?.[0]?.minimumPurchaseQuantity || 0,
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

  async function onSubmit(data: PromotionFormValues) {
    console.log("data===", data);
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
      const promotionActivities = {
        productId: data.productId,
        discountType: data.discountType,
        discountAmount: data.discountAmount,
        limitQuantity: data.limitQuantity,
        maxQuantity: data.maxQuantity,
        limitQuantityPerUser: data.limitQuantityPerUser,
        maxQuantityPerUser: data.maxQuantityPerUser,
        minimumPurchaseQuantity: data.minimumPurchaseQuantity,
      };

      const promotionResult = await updatePromotion(
        promotion?.id || "",
        PromotionFormData
      );

      const promotionActivityResult = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions/activities/${promotion?.promotionActivities?.[0].id}`,
        promotionActivities
      );

      if (promotionResult || promotionActivityResult) {
        const newPromotions: FetchAllPromotionResponseType =
          await getAllPromotions();
        setPromotionLists(newPromotions.data);

        const updateSelectedPromotion = newPromotions.data.find(
          (item: PromotionType) => item.id === promotion?.id
        );

        if (updateSelectedPromotion) {
          selectPromotion(updateSelectedPromotion);
        }
      }
      toast.success("แก้ไขกิจกรรมแล้ว");
      router.push("/admin/promotion");
    } catch (error) {
      toast.error("แก้ไขกิจกรรมไม่สำเร็จ");

      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    form.setValue("productId", selectedProduct?.id ?? "");
    form.trigger("productId"); // validate ทันทีเมื่อ value เปลี่ยน
  }, [form, selectedProduct?.id]);

  useEffect(() => {
    // แสดงรูปภาพที่มีอยู่จาก promotion ถ้ามี
    setImagePreviews(
      promotion.images && promotion.images.length > 0
        ? [process.env.NEXT_PUBLIC_IMAGE_HOST_URL + promotion.images[0].url]
        : []
    );
  }, [promotion]);

  useEffect(() => {
    if (Object.keys(form.formState.errors).length !== 0) {
      toast.error("กรุณาตรวจสอบข้อมูลอีกครั้ง");
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ประเภทกิจกรรม</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกกิจกรรม" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="groupbuying">groupbuying</SelectItem>
                  <SelectItem value="flashsale">flashsale</SelectItem>
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

        {/* Promotion Title */}
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

        {/* Promotion Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดกิจกรรม</FormLabel>
              <FormControl>
                <Textarea placeholder="กรอกรายละเอียดกิจกรรม" {...field} />
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
                      <ResponsiveImage src={preview} alt={`Preview ${index}`} />

                      <CircleX
                        onClick={(promotion) => {
                          promotion.stopPropagation();

                          // ตรวจสอบว่ามี images อยู่หรือไม่
                          const currentImages = form.getValues("images") ?? [];

                          // กรองข้อมูลเพื่อเอารูปภาพที่ไม่ต้องการออก
                          const updatedImages =
                            currentImages?.filter((_, i) => i !== index) ?? [];

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

        {/* product reference */}
        <Label className="mr-4 text-lg font-bold">เลือกสินค้า</Label>
        <SearchProductInPromotionForm
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        <FormField
          control={form.control}
          name={`productId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">สินค้าในกิจกรรม</FormLabel>
              <FormControl>
                <Input
                  placeholder="กรอกรหัสสินค้า"
                  {...field}
                  value={selectedProduct?.id}
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    <FormLabel className="font-normal">Fixed</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="percent" />
                    </FormControl>
                    <FormLabel className="font-normal">Percent</FormLabel>
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
              <FormLabel>จำนวนส่วนลด{`(${discountType})`}</FormLabel>
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
                    <FormLabel>จำนวนสูงสุดที่สั่งซื้อได้ต่อคน</FormLabel>
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

        <div className="w-full flex justify-end">
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}
