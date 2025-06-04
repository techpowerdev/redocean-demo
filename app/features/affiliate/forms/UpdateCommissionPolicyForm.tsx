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
import { updateAffiliateCommissionPolicy } from "@/services/affiliateServices";
import { CommissionPolicy } from "@/types/baseTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CommissionPolicyFormSchema = z.object({
  orderCommissionRate: z.coerce.number({
    required_error: "กรุณาระบุค่าคอมมิชชั่นสำหรับการแนะนำสินค้า (%)",
    invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
  }),
  referralCommissionRate: z.coerce.number({
    required_error: "กรุณาระบุค่าคอมมิชชั่นสำหรับการแนะนำเพื่อน (บาท)",
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

type Props = {
  commissionPolicy: CommissionPolicy;
};

export default function UpdateCommissionPolicyForm({
  commissionPolicy,
}: Props) {
  const { toast } = useToast();

  const form = useForm<CommissionPolicyFormValues>({
    resolver: zodResolver(CommissionPolicyFormSchema),
    defaultValues: {
      orderCommissionRate: commissionPolicy.orderCommissionRate,
      referralCommissionRate: commissionPolicy.referralCommissionRate,
      minimumWithdrawAmount: commissionPolicy.minimumWithdrawAmount,
      withdrawFeeType: commissionPolicy.withdrawFeeType,
      withdrawFee: commissionPolicy.withdrawFee,
      payoutSchedule: commissionPolicy.payoutSchedule,
      isActive: commissionPolicy.isActive,
    },
  });

  async function onSubmit(data: CommissionPolicyFormValues) {
    try {
      await updateAffiliateCommissionPolicy(commissionPolicy.id, data);
      toast({ description: "อัปเดตค่าคอมมิชชั่นแล้ว" });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="orderCommissionRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ค่าคอมมิชชั่นสำหรับการแนะนำสินค้า (%)</FormLabel>
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
              <FormLabel>ค่าคอมมิชชั่นสำหรับการแนะนำเพื่อน (บาท)</FormLabel>
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
            อัปเดตค่าคอมมิชชั่น
          </Button>
        </div>
      </form>
    </Form>
  );
}
