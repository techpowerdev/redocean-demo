"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { VoucherFormSchema } from "@/zod-schemas/voucherSchema";
import { createVoucherGroupWithVouchers } from "@/services/voucherServices";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stores } from "@/app/features/voucher/stores";
import { useRouter } from "next/navigation";

export type CreateVoucher = z.infer<typeof VoucherFormSchema>;

export default function CreateVoucherForm() {
  const form = useForm<CreateVoucher>({
    resolver: zodResolver(VoucherFormSchema), // validate data with the schema
    defaultValues: {
      storeName: "",
      description: "",
      amount: 500,
      expiresAt: "",
      limitPurchasePerUser: false,
      maxPurchasePerUser: 0,
      vouchers: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "vouchers",
  });

  const [mode, setMode] = useState<"manual" | "auto">("manual");
  const [quantity, setQuantity] = useState<number>(0);
  const [prefix, setPrefix] = useState<string>("");

  const router = useRouter();

  const addVoucher = () => {
    append({ id: `${Date.now()}${Math.random()}`, code: "" });
  };

  const generateCodes = () => {
    if (quantity <= 0) return;
    const codes = Array.from({ length: quantity }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      code: `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}-${
        i + 1
      }`,
    }));
    replace(codes);
  };

  const onSubmit = async (formValues: CreateVoucher) => {
    try {
      await createVoucherGroupWithVouchers(formValues);
      toast.success("เพิ่มข้อมูลแล้ว");
      router.push("/admin/voucher");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    form.setValue("vouchers", []);
    replace([]); // ลบข้อมูลทั้งหมดเมื่อเปลี่ยนโหมด
  }, [mode, form, replace]);

  useEffect(() => {}, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อร้าน / แบรนด์</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกร้าน / แบรนด์" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stores.map((store, i) => (
                    <SelectItem
                      key={`${store.storeName + i}`}
                      value={store.storeName}
                    >
                      {store.storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Input
                  placeholder="บัตรของขวัญโลตัส มูลค่า 500 บาท"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>มูลค่าบัตร (บาท)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo แบรนด์</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>วันหมดอายุ</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LimitPurchage condition */}
        <FormField
          control={form.control}
          name="limitPurchasePerUser"
          render={({ field }) => (
            <FormItem className="flex items-center justify-start gap-2">
              <FormLabel>จำกัดจำนวนซื้อได้ต่อคนหรือไม่</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("limitPurchasePerUser") && (
          <FormField
            control={form.control}
            name="maxPurchasePerUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนสูงสุดต่อคนที่สั่งซื้อได้</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="เช่น 1, 2, 5 ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Mode Switch */}
        <FormItem>
          <FormLabel>รูปแบบการเพิ่มบัตร</FormLabel>
          <FormControl>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={mode === "manual" ? "default" : "outline"}
                onClick={() => setMode("manual")}
              >
                เพิ่มรหัสเอง
              </Button>
              <Button
                type="button"
                variant={mode === "auto" ? "default" : "outline"}
                onClick={() => setMode("auto")}
              >
                สร้างอัตโนมัติ
              </Button>
            </div>
          </FormControl>
        </FormItem>

        {/* Auto Mode Fields */}
        {mode === "auto" && (
          <div className="space-y-4">
            <FormItem>
              <FormLabel>จำนวนบัตรที่ต้องการ</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="20"
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Prefix ของรหัสบัตร</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="VC-"
                />
              </FormControl>
            </FormItem>

            <Button type="button" onClick={generateCodes}>
              สร้างรหัสบัตร
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="vouchers"
          render={() => (
            <FormItem>
              <FormLabel className="text-base">รายการรหัสบัตร</FormLabel>
              {form.formState.errors.vouchers?.message && <FormMessage />}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
          {fields.map((fieldItem, index) => (
            <div key={fieldItem.id}>
              <FormField
                control={form.control}
                name={`vouchers.${index}.code`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            placeholder={`VC-${index + 1}`}
                            className="pr-14"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            {`${field.value?.length || 0}/20`}
                          </div>
                        </div>
                      </FormControl>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        {mode === "manual" && (
          <Button type="button" onClick={addVoucher} variant="outline">
            + เพิ่ม
          </Button>
        )}

        <Button type="submit" className="w-full">
          สร้างบัตร eVoucher
        </Button>
      </form>
    </Form>
  );
}
