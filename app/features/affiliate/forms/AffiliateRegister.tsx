"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AffiliateSchema,
  Step1AffiliateSchema,
  Step2AffiliateSchema,
} from "@/zod-schemas/affiliateSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import ImageUploadForm from "@/app/features/image/ImageUploadForm";
import { createAffiliate } from "@/services/affiliateServices";
import Image from "next/image";
import { GetAllPayoutChannelsResponse } from "@/types/xenditTypes";
import { getAllPayoutChannels } from "@/services/xenditServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateAffiliate = z.infer<typeof AffiliateSchema>;

export default function AffiliateRegister() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [payoutChannels, setPayoutChannels] = useState<
    GetAllPayoutChannelsResponse["data"]
  >([]);

  const router = useRouter();

  const currentSchema =
    step === 1
      ? Step1AffiliateSchema
      : step === 2
      ? Step2AffiliateSchema
      : AffiliateSchema;

  const form = useForm<CreateAffiliate>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      idCard: "",
      idCardImage: "",
      bankName: "",
      channelCode: "",
      accountHolderName: "",
      accountNumber: "",
      bookBankImage: "",
    },
  });

  async function onSubmit(data: CreateAffiliate) {
    try {
      await createAffiliate(data);
      toast({
        title: "ลงทะเบียนสำเร็จ!",
        description:
          "ขอบคุณสำหรับการลงทะเบียน เราจะตรวจสอบข้อมูลของคุณและติดต่อกลับโดยเร็วที่สุด",
      });
      // Redirect to success page or dashboard
      router.push("/affiliate/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Unknown error:", error);
      }
    }
  }

  const handleNextStep = async () => {
    if (step < 3) {
      const isValid = await form.trigger(); // validate fields with current schema
      if (!isValid) {
        toast({
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          description: "โปรดกรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน",
          variant: "destructive",
        });
        return;
      }
      setStep(step + 1);
    } else {
      // Submit form
      const data = form.getValues();
      onSubmit(data);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    const fetchAllPayoutChannels = async () => {
      try {
        const response = await getAllPayoutChannels();
        setPayoutChannels(response?.data || []); // fallback ป้องกันกรณี undefined
      } catch (error) {
        console.error("Error fetching payout channels:", error);
      }
    };
    fetchAllPayoutChannels();
  }, []);

  const selectedBankName = form.watch("bankName");

  useEffect(() => {
    const selectedBank = payoutChannels.find(
      (b) => b.bankName === selectedBankName
    );
    if (selectedBank) {
      form.setValue("channelCode", selectedBank.channelCode);
    } else {
      form.setValue("channelCode", "");
    }
  }, [selectedBankName, form.setValue]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-start min-h-screen py-12 px-4 md:px-6">
      <Link
        href="/affiliate"
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        กลับไปหน้าหลัก
      </Link>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">สมัครเป็น Affiliate</h1>
          <p className="text-gray-500 mt-2">
            เริ่มต้นสร้างรายได้กับโปรแกรม Affiliate ของเรา
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className="text-sm mt-2">ข้อมูลส่วนตัว</span>
          </div>
          <div
            className={`h-1 flex-1 mx-4 ${
              step >= 2 ? "bg-primary" : "bg-gray-200"
            }`}
          />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className="text-sm mt-2">ข้อมูลการชำระเงิน</span>
          </div>
          <div
            className={`h-1 flex-1 mx-4 ${
              step >= 3 ? "bg-primary" : "bg-gray-200"
            }`}
          />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span className="text-sm mt-2">ยืนยันข้อมูล</span>
          </div>
        </div>
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit(onSubmit)}> */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "ข้อมูลส่วนตัว"}
                {step === 2 && "ข้อมูลการชำระเงิน"}
                {step === 3 && "ยืนยันข้อมูล"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "กรุณากรอกข้อมูลส่วนตัวของคุณ"}
                {step === 2 && "กรุณากรอกข้อมูลสำหรับการรับค่าคอมมิชชั่น"}
                {step === 3 && "ตรวจสอบข้อมูลและยืนยันการสมัคร"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ชื่อ *</FormLabel>
                            <FormControl>
                              <Input placeholder="คุ้มค่า" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>นามสกุล *</FormLabel>
                            <FormControl>
                              <Input placeholder="รวยทรัพย์" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>เบอร์โทร *</FormLabel>
                            <FormControl>
                              <Input placeholder="0856789012" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="idCard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>เลขประจำตัวประชาชน *</FormLabel>
                            <FormControl>
                              <Input placeholder="1551111118987" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>อีเมล *</FormLabel>
                          <FormControl>
                            <Input placeholder="example@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`idCardImage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รูปบัตรประจำตัวประชาชน *</FormLabel>
                          <FormControl>
                            <div className="w-full flex justify-center sm:justify-start gap-2 flex-wrap">
                              <ImageUploadForm
                                field={field}
                                aspectRatio="3/4"
                                width="64"
                                height="40"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อบัญชี *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="กรอกชื่อให้ตรงตามหน้าสมุดบัญชี"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ธนาคาร *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="เลือกธนาคาร" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {payoutChannels?.map((channel) => (
                                <SelectItem
                                  key={channel.id}
                                  value={channel.bankName}
                                >
                                  {channel.bankName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>เลขที่บัญชี *</FormLabel>
                          <FormControl>
                            <Input placeholder="8804567768" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`bookBankImage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รูปหน้าสมุดบัญชีธนาคาร *</FormLabel>
                          <FormControl>
                            <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                              <ImageUploadForm
                                field={field}
                                aspectRatio="3/4"
                                width="64"
                                height="40"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-medium mb-2">ข้อมูลส่วนตัว</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">ชื่อ-นามสกุล:</div>
                      <div>
                        {form.getValues().firstName} {form.getValues().lastName}
                      </div>
                      <div className="text-gray-500">อีเมล:</div>
                      <div>{form.getValues().email}</div>
                      <div className="text-gray-500">เบอร์โทรศัพท์:</div>
                      <div>{form.getValues().phoneNumber || "-"}</div>
                      <div className="text-gray-500">เลขประจำตัวประชาชน:</div>
                      <div>{form.getValues().idCard || "-"}</div>
                      <div className="relative w-60 h-44">
                        <Image
                          alt="idCardImage"
                          src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${
                            form.getValues().idCardImage
                          }`}
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">ข้อมูลการชำระเงิน</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">ชื่อบัญชี:</div>
                      <div>{form.getValues().accountHolderName}</div>
                      <div className="text-gray-500">ธนาคาร:</div>
                      <div>{form.getValues().bankName}</div>
                      <div className="text-gray-500">เลขที่บัญชี:</div>
                      <div>{form.getValues().accountNumber}</div>
                      <div className="text-gray-500">channel code:</div>
                      <div>{form.getValues().channelCode}</div>
                    </div>
                    <div className="relative w-60 h-44">
                      <Image
                        alt="idCardImage"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${
                          form.getValues().bookBankImage
                        }`}
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={step === 1}
              >
                ย้อนกลับ
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  ถัดไป
                </Button>
              ) : (
                <Button onClick={handleNextStep}>ยืนยันการสมัคร</Button>
              )}
            </CardFooter>
          </Card>
          {/* </form> */}
        </Form>
      </div>
    </div>
  );
}
