import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";

// Form valiation lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { CircleAlert, CircleCheckBig } from "lucide-react";
import Loading from "@/components/shared/Loading";
import React from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAuthStore from "@/state-stores/useAuthStore";

// zod schema
const formSchema = z.object({
  fullName: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.trim() === "" || val.trim().length > 0,
      {
        message: "กรุณากรอกชื่อ-สกุล",
      }
    ),
  phoneNumber: z
    .string({
      required_error: "กรุณาระบุเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
    })
    .nonempty({ message: "กรุณาระบุเบอร์โทร" }) // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "รูปแบบเบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        z.string().email().safeParse(val).success,
      {
        message: "กรุณาระบุอีเมลที่ถูกต้อง",
      }
    ),
});

export type FormData = z.infer<typeof formSchema>;

export function EditProfile() {
  const router = useRouter();
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const token = useCurrentUserStore((state) => state.token);
  const isTokenValid = useAuthStore((state) => state.isTokenValid);
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: currentUser?.fullName || undefined,
      phoneNumber: currentUser?.phoneNumber || undefined,
      email: currentUser?.email || undefined,
    },
  });

  const checkToken = () => {
    if (token) {
      if (!isTokenValid(token)) {
        console.warn("Token expired or not available. Redirecting to login...");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  const onSubmit = async (data: FormData) => {
    setSuccess(false);
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/change-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token here
          },
        }
      );
      setCurrentUser(response.data.user);
      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onError = (errors: unknown) => {
    console.error("Validation errors:", errors);
    setErrorMessage("เกิดผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={checkToken}
          variant="ghost"
          className="hover:text-primary"
        >
          <SquarePen size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลส่วนตัว</DialogTitle>
          <DialogDescription className="hidden">
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fullName">ชื่อ-สกุล</Label>
              <Input {...register("fullName")} id="fullName" />
              {errors.fullName && (
                <p className="text-[12px] text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phoneNumber">เบอร์โทร</Label>
              <Input {...register("phoneNumber")} type="tel" id="phoneNumber" />
              {errors.phoneNumber && (
                <p className="text-[12px] text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">อีเมล</Label>
              <Input {...register("email")} id="email" type="email" />
              {errors.email && (
                <p className="text-[12px] text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-gray-200 relative flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
              <CircleAlert size={20} className="text-gray-400" />
              <span className="text-sm">กำลังบันทึก...</span>
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <Loading size={26} />
              </div>
            </div>
          ) : errorMessage.length > 0 ? (
            <div className="bg-red-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
              <CircleAlert size={20} className="text-red-500" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          ) : (
            success && (
              <div className="bg-green-200 flex justify-start items-center gap-2 mt-3 p-2 rounded-md">
                <CircleCheckBig size={20} className="text-green-500" />
                <span className="text-sm">บันทึกการเปลี่ยนแปลงแล้ว</span>
              </div>
            )
          )}
          <DialogFooter className="mt-6">
            <Button type="submit">บันทึกการแก้ไข</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
