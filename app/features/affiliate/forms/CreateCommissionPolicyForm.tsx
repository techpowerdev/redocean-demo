"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createAffiliateCommissionPolicy } from "@/services/affiliateServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CommissionPolicyFormSchema = z.object({
  productCommissionRate: z.coerce.number({
    required_error: "กรุณาระบุเปอร์เซ็นต์ค่าคอมมิชชั่นสำหรับสินค้า",
    invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
  }),
  referralCommissionRate: z.coerce.number({
    required_error: "กรุณาระบุเปอร์เซ็นต์ค่าคอมมิชชั่นสำหรับการแนะนำเพื่อน",
    invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
  }),
  minimumWithdrawAmount: z.coerce.number({
    required_error: "กรุณาระบุจำนวนเงินถอนขั้นต่ำ",
    invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
  }),
  withdrawFeeType: z.enum(["fixed", "percent"], {
    required_error: "กรุณาเลือกประเภทค่าธรรมเนียมการถอน",
  }),
  withdrawFee: z.coerce.number({
    required_error: "กรุณาระบุค่าธรรมเนียมการถอน",
    invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
  }),
  payoutSchedule: z
    .string()
    .trim()
    .min(1, "กรุณาระบุรอบการโอนจ่ายค่าคอมมิชชั่น"),
  isActive: z.boolean(),
});

type CommissionPolicyFormValues = z.infer<typeof CommissionPolicyFormSchema>;

export default function CreateCommissionPolicyForm() {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<CommissionPolicyFormValues>({
    resolver: zodResolver(CommissionPolicyFormSchema),
    defaultValues: {
      productCommissionRate: 1,
      referralCommissionRate: 3,
      minimumWithdrawAmount: 1000,
      withdrawFeeType: "fixed",
      withdrawFee: 20,
      payoutSchedule: "ทุกวันที่ 14 และ 28 ของเดือน",
      isActive: true,
    },
  });

  async function onSubmit(data: CommissionPolicyFormValues) {
    try {
      await createAffiliateCommissionPolicy(data);
      toast({ description: "สร้างค่าคอมมิชชั่นใหม่เรียบร้อยแล้ว" });
      form.reset(); // reset form after submit
      router.back();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "เกิดข้อผิดพลาดในการสร้างค่าคอมมิชชั่น",
      });
    }
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-medium text-gray-800 mb-6">
        สร้างนโยบายค่าคอมมิชชั่น
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productCommissionRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เปอร์เซ็นต์ค่าคอมมิชชั่นสำหรับสินค้า</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="เช่น 10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referralCommissionRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เปอร์เซ็นต์ค่าคอมมิชชั่นจากการแนะนำเพื่อน</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="เช่น 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minimumWithdrawAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ยอดขั้นต่ำในการถอน (บาท)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="เช่น 500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="withdrawFeeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ประเภทค่าธรรมเนียมการถอน</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทค่าธรรมเนียม" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percent">เปอร์เซ็นต์</SelectItem>
                  <SelectItem value="fixed">จำนวนเงินคงที่</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="withdrawFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ค่าธรรมเนียมการถอน</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="เช่น 10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payoutSchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รอบการจ่ายค่าคอมมิชชั่น</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="เช่น ทุกวันที่ 14 และ 28 ของเดือน"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between md:justify-start gap-2 space-y-0">
              <FormLabel>เปิดใช้งานค่าคอมมิชชั่นนี้</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full pt-4">
          <Button type="submit" className="w-full">
            สร้างค่าคอมมิชชั่น
          </Button>
        </div>
      </form>
    </Form>
  );
}
