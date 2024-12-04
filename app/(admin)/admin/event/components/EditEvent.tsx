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
import { useEffect } from "react";
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
import { PromotionType } from "@/types/fetchTypes";
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
  discountGroupAmount: z.coerce.number({
    required_error: "กรุณาระบุจำนวนส่วนลดสูงสุด",
    invalid_type_error: "กรุณาระบุจำนวนส่วนลดสูงสุด",
  }),
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
      discountGroupAmount:
        selectedPromotion?.promotionActivities?.[0]?.discountGroupAmount || 0,
    },
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
        discountGroupAmount:
          selectedPromotion?.promotionActivities?.[0]?.discountGroupAmount || 0,
      });
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

  function onSubmit(data: EventFormValues) {
    const updateEvent = async () => {
      try {
        const promotionData = {
          type: data.type,
          name: data.name,
          description: data.description,
          startAt: data.startAt,
          endAt: data.endAt,
        };

        const promotionActivities = {
          productId: selectedProductInPromotion?.id,
          discountType: data.discountType,
          discountAmount: data.discountAmount,
          limitQuantity: data.limitQuantity,
          maxQuantity: data.maxQuantity,
          limitQuantityPerUser: data.limitQuantityPerUser,
          maxQuantityPerUser: data.maxQuantityPerUser,
          minimumPurchaseQuantity: data.minimumPurchaseQuantity,
          discountGroupAmount: data.discountGroupAmount,
        };

        const promotionResult = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/promotions/${selectedPromotion?.id}`,
          promotionData
        );

        const promotionActivityResult = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/promotions/activities/${selectedPromotion?.promotionActivities?.[0].id}`,
          promotionActivities
        );

        if (promotionResult || promotionActivityResult) {
          const newPromotions = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/promotions/all`
          );

          const updateSelectedPromotion = newPromotions.data.find(
            (item: PromotionType) => item.id === selectedPromotion?.id
          );
          selectPromotion(updateSelectedPromotion);
          setPromotionLists(newPromotions.data);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    updateEvent();
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
                          <FormField
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
