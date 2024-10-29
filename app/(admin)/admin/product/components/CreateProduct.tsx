"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

// Zod schema
const formSchema = z.object({
  name: z
    .string({ required_error: "กรุณากรอกชื่อสินค้า" })
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า"),
  price: z
    .string({ required_error: "กรุณาระบุราคา" })
    .regex(
      /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
      "กรุณาระบุราคาในรูปแบบที่ถูกต้อง เช่น 100,000.00"
    ),
  promotionPrice: z
    .string()
    .regex(
      /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
      "กรุณาระบุราคาโปรโมชั่นในรูปแบบที่ถูกต้อง เช่น 100,000.00"
    )
    .optional(),
  // other fields
});

type FormType = z.infer<typeof formSchema>;

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, ""); // ลบ comma ออก
    const formattedValue = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue("price", formattedValue); // อัพเดตเป็นรูปแบบมี comma
  };

  const handlePromotionPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/,/g, ""); // ลบ comma ออก
    const formattedValue = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue("promotionPrice", formattedValue);
  };

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const priceAsNumber = parseFloat(data.price.replace(/,/g, ""));
    const promotionPriceAsNumber = data.promotionPrice
      ? parseFloat(data.promotionPrice.replace(/,/g, ""))
      : undefined;

    const formData = {
      ...data,
      price: priceAsNumber,
      promotionPrice: promotionPriceAsNumber,
    };

    await axios.post("/api/products", formData);
  };

  return (
    <Card>
      <CardHeader>เพิ่มสินค้า</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">ชื่อสินค้า</Label>
            <Input {...register("name")} id="name" />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="price">ราคา</Label>
            <Input
              {...register("price")}
              id="price"
              placeholder="100,000.00"
              // onChange={handlePriceChange}
            />
            {errors.price && <p>{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="promotionPrice">ราคาโปรโมชั่น</Label>
            <Input
              {...register("promotionPrice")}
              id="promotionPrice"
              placeholder="100,000.00"
              onChange={handlePromotionPriceChange}
            />
            {errors.promotionPrice && <p>{errors.promotionPrice.message}</p>}
          </div>
          <Button type="submit">บันทึก</Button>
        </form>
      </CardContent>
    </Card>
  );
}
