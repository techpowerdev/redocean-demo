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
import { CircleX } from "lucide-react";
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
import { useDropzone } from "react-dropzone";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { addPromotion, getAllPromotions } from "@/services/promotionServices";
import { useRouter } from "next/navigation";
import { SearchProductInPromotionForm } from "@/app/features/promotion/SearchProductInPromotionForm";
import { Product } from "@/types/baseTypes";

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
    .nonempty("เลือกอย่างน้อย 1 รูป"),
  // .optional() // <--- ปรับให้เป็น optional
  // .nullable() // <--- ปรับให้เป็น optional
});

// Create form input type
type PromotionFormValues = z.infer<typeof PromotionFormSchema>;

export default function CreatePromotionForm() {
  // global state
  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );

  // local state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // navigation
  const router = useRouter();

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionFormSchema), // validate data with the schema
    defaultValues: {
      // promotion data
      type: "groupbuying",
      name: "",
      description: "",
      startAt: "",
      endAt: "",
      // promotion activity data
      productId: selectedProduct?.id ?? "",
      discountType: "fixed",
      discountAmount: 0,
      limitQuantity: false,
      maxQuantity: 0,
      limitQuantityPerUser: false,
      maxQuantityPerUser: 0,
      minimumPurchaseQuantity: 0,
      // discountGroupAmount: 0,
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
    const PromotionFormData = new FormData();
    if (data.images && data.images.length > 0) {
      PromotionFormData.append("image", data.images[0].file);
    }

    PromotionFormData.append("type", data.type);
    PromotionFormData.append("name", data.name);
    PromotionFormData.append("description", data.description);
    PromotionFormData.append("startAt", data.startAt);
    PromotionFormData.append("endAt", data.endAt);

    // promotion activity data
    PromotionFormData.append("productId", data.productId);
    PromotionFormData.append("discountType", data.discountType);
    PromotionFormData.append("discountAmount", data.discountAmount.toFixed(2));
    PromotionFormData.append("limitQuantity", data.limitQuantity.toString());
    PromotionFormData.append("maxQuantity", data.maxQuantity.toFixed(0));
    PromotionFormData.append(
      "limitQuantityPerUser",
      data.limitQuantityPerUser.toString()
    );
    PromotionFormData.append(
      "maxQuantityPerUser",
      data.maxQuantityPerUser.toFixed(0)
    );
    PromotionFormData.append(
      "minimumPurchaseQuantity",
      data.minimumPurchaseQuantity.toFixed(0)
    );

    try {
      const promotionResult = await addPromotion(PromotionFormData);

      if (promotionResult) {
        const newPromotions = await getAllPromotions();
        setPromotionLists(newPromotions.data);
      }
      toast.success("เพิ่มกิจกรรมแล้ว");
      router.push("/admin/promotion");
    } catch (error) {
      toast.success("เกิดข้อผิดพลาดบางอย่าง");
      console.error("Error occurred:", error);
    }
  }

  useEffect(() => {
    form.setValue("productId", selectedProduct?.id ?? "");
    form.trigger("productId"); // validate ทันทีเมื่อ value เปลี่ยน
  }, [form, selectedProduct?.id]);

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
                  {imagePreviews?.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-56 border-2 border-accent-800 rounded-md"
                    >
                      <ResponsiveImage src={preview} alt={`Preview ${index}`} />
                      <CircleX
                        onClick={(event) => {
                          event.stopPropagation();

                          const currentImages = form.getValues("images") ?? [];
                          const updatedImages = currentImages.filter(
                            (_, i) => i !== index
                          );

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
