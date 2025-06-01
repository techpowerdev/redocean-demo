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
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  deleteVoucher,
  updateVoucherGroupWithVouchers,
} from "@/services/voucherServices";
import { VoucherGroup } from "@/types/baseTypes";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stores } from "@/app/features/voucher/stores";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export type EditVoucher = z.infer<typeof VoucherFormSchema>;

type Props = {
  voucherGroup: VoucherGroup;
};

export default function EditVoucherForm({ voucherGroup }: Props) {
  const form = useForm<EditVoucher>({
    resolver: zodResolver(VoucherFormSchema),
    defaultValues: {
      storeName: voucherGroup.storeName,
      description: voucherGroup.description,
      amount: voucherGroup.amount,
      expiresAt: voucherGroup.expiresAt || "",
      limitPurchasePerUser: voucherGroup.limitPurchasePerUser || false,
      maxPurchasePerUser: voucherGroup.maxPurchasePerUser || 0,
      vouchers:
        voucherGroup.vouchers?.map((voucher) => ({
          id: voucher.id,
          code: voucher.code,
        })) || [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "vouchers",
  });

  const [mode, setMode] = useState<"manual" | "auto">(
    voucherGroup.vouchers?.length ? "manual" : "auto"
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [prefix, setPrefix] = useState<string>("");

  const router = useRouter();

  const addVoucher = () => {
    append({ id: "", code: "" });
  };

  const generateCodes = () => {
    if (quantity <= 0) return;
    const codes = Array.from({ length: quantity }, (_, i) => ({
      id: "",
      code: `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}-${
        i + 1
      }`,
    }));
    replace(codes);
  };

  const handleDeleteVoucher = async (id: string, index: number) => {
    try {
      await deleteVoucher(id);
      remove(index);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        console.error(errorMessage);
        toast.error("ไม่สามารถลบรหัสนี้ได้");
      }
    }
  };

  const onSubmit = async (formValues: EditVoucher) => {
    try {
      await updateVoucherGroupWithVouchers(voucherGroup.id, formValues);
      toast.success("แก้ไขข้อมูลแล้ว");
      router.push("/admin/voucher");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (mode === "manual") return;
    replace([]); // reset เมื่อเปลี่ยนโหมด
  }, [mode, replace]);

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
                <Input placeholder="รายละเอียดบัตร" {...field} />
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
                <Input type="number" {...field} />
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
              <FormLabel>URL โลโก้แบรนด์</FormLabel>
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
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value
                      ? format(new Date(field.value), "yyyy-MM-dd")
                      : ""
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="limitPurchasePerUser"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>จำกัดจำนวนซื้อได้ต่อคน</FormLabel>
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
                <FormLabel>จำนวนสูงสุดที่ซื้อได้ต่อคน</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Mode Switch */}
        {/* hidden */}
        <FormItem className="hidden">
          <FormLabel>รูปแบบการเพิ่มรหัส</FormLabel>
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
                สร้างรหัสอัตโนมัติ
              </Button>
            </div>
          </FormControl>
        </FormItem>

        {mode === "auto" && (
          <div className="space-y-4">
            <FormItem>
              <FormLabel>จำนวนรหัส</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Prefix ของรหัส</FormLabel>
              <FormControl>
                <Input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </FormControl>
            </FormItem>

            <Button type="button" onClick={generateCodes}>
              สร้างรหัสใหม่
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name="vouchers"
          render={() => (
            <FormItem>
              <FormLabel>รายการรหัส</FormLabel>
              {form.formState.errors.vouchers?.message && <FormMessage />}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                        onClick={() =>
                          handleDeleteVoucher(
                            form.getValues(`vouchers.${index}.id`),
                            index
                          )
                        }
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
            + เพิ่มรหัส
          </Button>
        )}

        <Button type="submit" className="w-full">
          บันทึกการแก้ไข
        </Button>
      </form>
    </Form>
  );
}
