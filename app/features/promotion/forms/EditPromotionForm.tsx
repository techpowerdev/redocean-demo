"use client";

import { useWatch, useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPromotionById,
  getPromotions,
  updatePromotion,
} from "@/services/promotionServices";
import { useRouter } from "next/navigation";
import { SearchProductInPromotionForm } from "@/app/features/promotion/SearchProductInPromotionForm";
import { ProductItem, Promotion } from "@/types/baseTypes";
import MultipleImageUpload, {
  ImageStateType,
} from "@/app/features/image/MultipleImageUpload";
import { updatePromotionActivity } from "@/services/promotionActivityServices";
import { formatDateToDatetimeLocal } from "@/utils/formatDate";
import { DiscountType } from "@/utils/calculateDiscountedPrice";

// Define the schema for validation using zod
const PromotionFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทกิจกรรม"),
  name: z.string().min(1, "กรุณาระบุชื่อกิจกรรม"),
  description: z.string().min(1, "กรุณาระบุรายละเอียด"),
  startAt: z.string().min(1, "กรุณาระบุวันเวลาเริ่มต้น"),
  endAt: z.string().min(1, "กรุณาระบุวันเวลาสิ้นสุด"),
  productItemId: z.string().min(1, "กรุณาเลือกสินค้า"),
  discountType: z.enum(["fixed", "percent"], {
    required_error: "กรุณาเลือกประเภทส่วนลด",
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
  limitQuantity: z.boolean().default(false),
  maxQuantity: z.coerce.number({
    required_error: "กรุณาระบุจำนวนสินค้า",
    invalid_type_error: "กรุณาระบุจำนวนสินค้า",
  }),
  limitQuantityPerUser: z.boolean().default(false),
  maxQuantityPerUser: z.coerce.number({
    required_error: "กรุณาระบุสูงสุดที่สั่งซื้อได้ต่อคน",
    invalid_type_error: "กรุณาระบุสูงสุดที่สั่งซื้อได้ต่อคน",
  }),
  // images: z.array(z.string()),
  images: z.array(z.string()).min(1, "อัปโหลดอย่างน้อย 1 รูป"),
});

// Create form input type
type PromotionFormValues = z.infer<typeof PromotionFormSchema>;

type Props = {
  promotion: Promotion;
};

export function EditPromotionForm({ promotion }: Props) {
  // global state
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );

  const selectPromotion = usePromotionStore((state) => state.selectPromotion);

  // local state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    promotion?.promotionActivities?.[0]?.productItem ?? null
  );
  // const [images, setImages] = useState<ImageStateType[]>([]);
  const [images, setImages] = useState<ImageStateType[]>(
    promotion.images?.map((item) => ({ id: item.id, url: item.url })) || []
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
      images: [],
      startAt: promotion?.startAt
        ? formatDateToDatetimeLocal(promotion.startAt)
        : "",
      endAt: promotion?.endAt ? formatDateToDatetimeLocal(promotion.endAt) : "",
      // promotion activity data
      productItemId: selectedProduct?.id ?? "",
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
    },
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
    try {
      const promotionData = {
        type: data?.type,
        name: data?.name,
        description: data?.description,
        imageIds: data?.images,
        startAt: data?.startAt,
        endAt: data?.endAt,
      };

      const promotionResult = await updatePromotion(
        promotion.id,
        promotionData
      );

      console.log(promotionResult);

      if (promotionResult.data.promotionActivities) {
        const promotionActivityData = {
          promotionId: promotionResult.data.id,
          productItemId: data.productItemId,
          discountType: data.discountType,
          discountAmount: data.discountAmount,
          limitQuantity: data.limitQuantity,
          maxQuantity: data.maxQuantity,
          limitQuantityPerUser: data.limitQuantityPerUser,
          maxQuantityPerUser: data.maxQuantityPerUser,
          minimumPurchaseQuantity: data.minimumPurchaseQuantity,
        };

        await updatePromotionActivity(
          promotion?.promotionActivities?.[0]?.id || "",
          promotionActivityData
        );

        const updatedSelectPromotion = await getPromotionById(promotion.id);
        selectPromotion(updatedSelectPromotion.data);

        const updatedPromotions = await getPromotions("all");
        setPromotionLists(updatedPromotions.data);
      }
      toast.success("แก้ไขกิจกรรมแล้ว");
      router.push("/admin/promotion");
    } catch (error) {
      toast.success("เกิดข้อผิดพลาดบางอย่าง");
      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    form.setValue("productItemId", selectedProduct?.id ?? "");
    form.trigger("productItemId"); // validate ทันทีเมื่อ value เปลี่ยน
  }, [form, selectedProduct?.id]);

  useEffect(() => {
    // ใช้ filter และ map เพื่อดึงเฉพาะ id ที่ไม่เป็นค่าว่าง
    const validImageIds = images
      .filter((item) => item.id !== "")
      .map((item) => item.id);

    form.setValue("images", validImageIds);
    form.trigger("images");
  }, [form, images]);

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

        {/* Title */}
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

        {/* Description */}
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

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>รูปกิจกรรม</FormLabel>
              <FormControl>
                <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                  <MultipleImageUpload images={images} setImages={setImages} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
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
          name={`productItemId`}
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
        {/* {selectedPromotionType === "flashsale" && ( */}
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
        {/* )} */}

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
        {limitQuantityPerUser && (
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
        )}

        <div className="w-full flex justify-end">
          <Button type="submit">บันทึก</Button>
        </div>
      </form>
    </Form>
  );
}
