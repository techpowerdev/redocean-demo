"use client";

import { useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { createProductWithVariants } from "@/services/productServices";
import { useRouter } from "next/navigation";
import ImagesUploadForm from "@/app/features/image/ImagesUploadForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductWithVariantionSchema } from "@/zod-schemas/productSchema";
import NestedCreateProductVariantField from "@/app/features/product/admin/forms/NestedCreateProductVariantField";
import { getAllCategories } from "@/services/categoryServices";
import { ProductCategory } from "@/types/baseTypes";

export type CreateProductWithVariants = z.infer<
  typeof ProductWithVariantionSchema
>;

export default function CreateProductWithVariantsForm() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const router = useRouter();

  const form = useForm<CreateProductWithVariants>({
    resolver: zodResolver(ProductWithVariantionSchema), // validate data with the schema
    defaultValues: {
      sku: "",
      name: "",
      images: [],
      categoryId: "",
      description: "",
      originalPrice: 0,
      stock: 0,
      hasVariants: false,
      options: [],
      variations: [],
    },
  });

  const hasVariants = form.watch("hasVariants");

  async function onSubmit(data: CreateProductWithVariants) {
    try {
      const { images, options, variations, ...productInfo } = data;

      // ฝั่ง api ไม่ต้องการ id
      const validVariations = variations.map((variation) => {
        // ไม่เอา id ตอน create
        const { name, originalPrice, stock, tierIndex, sku, image, key } =
          variation;

        return { name, originalPrice, stock, tierIndex, sku, image, key };
      });

      // remove empty image
      const validImages = images.filter((item) => item !== "");

      await createProductWithVariants({
        ...productInfo,
        images: validImages,
        tierVariations: options,
        models:
          validVariations?.length > 0
            ? validVariations
            : [
                {
                  name: productInfo.name,
                  tierIndex: [0],
                  originalPrice: productInfo.originalPrice || 0,
                  stock: productInfo.stock || 0,
                  image: validImages?.[0],
                },
              ],
      });
      toast.success("เพิ่มสินค้าแล้ว");
      router.push("/admin/product");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  }

  useEffect(() => {
    if (hasVariants) {
      form.setValue("originalPrice", 0);
      form.setValue("stock", 0);
    }
  }, [hasVariants, form]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response?.data || []); // fallback ป้องกันกรณี undefined
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchAllCategories();
  }, []);

  return (
    <Form {...form}>
      <h1 className="text-xl font-medium text-gray-800 mb-6">ข้อมูลสินค้า</h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสสินค้า</FormLabel>
                <FormControl>
                  <Input placeholder="กรอกรหัสสินค้า" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อสินค้า</FormLabel>
                <FormControl>
                  <Input placeholder="กรอกชื่อสินค้า" {...field} />
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
              <FormItem>
                <FormLabel>รูปสินค้า</FormLabel>
                {form.formState.errors.images?.message && <FormMessage />}
              </FormItem>
            )}
          />
          <ImagesUploadForm control={form.control} />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมวดหมู่</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
                <FormLabel>รายละเอียดของสินค้า</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="กรอกรายละเอียดสินค้า"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!hasVariants && (
            <>
              <FormField
                control={form.control}
                name={`originalPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคา</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="กรอกราคาสินค้า"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนสต็อค</FormLabel>
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
            </>
          )}
          <NestedCreateProductVariantField form={form} />
          <div className="flex justify-end">
            <Button type="submit" className="w-fit">
              บันทึก
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
