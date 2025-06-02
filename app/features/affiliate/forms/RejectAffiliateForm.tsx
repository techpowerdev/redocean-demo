import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const rejectSchema = z.object({
  rejectReason: z.string().min(1, { message: "โปรดระบุเหตุผล" }),
});

type RejectFormData = z.infer<typeof rejectSchema>;

export function RejectAffiliateForm({
  onReject,
}: {
  onReject: (rejectReason: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { rejectReason: "ข้อมูลไม่ถูกต้อง" },
  });

  const onSubmit = (data: RejectFormData) => {
    onReject(data.rejectReason);
    reset(); // reset form after submit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">เหตุผลในการปฏิเสธ</h4>
        <p className="text-sm text-muted-foreground">
          ระบุเหตุผลที่คุณต้องการปฏิเสธการเป็น Affiliate เช่น
          ไม่ปฏิบัติตามเงื่อนไข หรือ ข้อมูลไม่ถูกต้อง
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          id="rejectReason"
          placeholder="ระบุเหตุผลที่คุณต้องการปฏิเสธ"
          {...register("rejectReason")}
        />
        {errors.rejectReason && (
          <p className="text-sm text-red-500">{errors.rejectReason.message}</p>
        )}
        <Button type="submit">ยืนยันการปฏิเสธ</Button>
      </div>
    </form>
  );
}
