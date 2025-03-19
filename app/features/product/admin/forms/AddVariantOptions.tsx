"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { CirclePlus, CircleX, ListPlus, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import {
  addProductVariant,
  getAllProducts,
  getProductById,
} from "@/services/productServices";

// Define the schema for validation using zod
const ProductVariantFormSchema = z.object({
  sku: z
    .string({ required_error: "กรุณาระบุรหัสสินค้า" })
    .trim()
    .min(1, "กรุณาระบุรหัสสินค้า"),
  options: z.array(
    z.object({
      name: z
        .string({ required_error: "กรุณาระบุประเภทตัวเลือก" })
        .trim()
        .min(1, "กรุณาระบุประเภทตัวเลือก"),
      value: z
        .string({ required_error: "กรุณาระบุตัวเลือกสินค้า" })
        .trim()
        .min(1, "กรุณาระบุตัวเลือกสินค้า"),
    })
  ),
  price: z.coerce
    .number({ required_error: "กรุณาระบุราคาสินค้า" })
    .gte(1, "กรุณาระบุราคาสินค้า"),
  stock: z.coerce
    .number({ required_error: "กรุณาระบุจำนวนสินค้า" })
    .gte(1, "กรุณาระบุจำนวนสินค้า"),
  images: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(5 * 1024 * 1024, "Max file size is 5MB"),
        type: z.enum([
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ]),
        file: z.any(),
      })
    )
    .optional()
    .nullable(),
});

// Create form input type
type ProductFormValues = z.infer<typeof ProductVariantFormSchema>;

export default function AddVariantOptions() {
  // global state
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const setProductLists = useProductStore((state) => state.setProductLists);
  const selectProduct = useProductStore((state) => state.selectProduct);

  // local state
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [savedOptionNames, setSavedOptionNames] = useState<string[]>([]);
  const [options, setOptions] = useState<
    { name: string; value: string; isNew: boolean }[]
    // >([{ name: "", value: "" }]);
  >([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductVariantFormSchema),
    defaultValues: {
      sku: "",
      options: [{ name: "", value: "" }],
      price: 0,
      stock: 0,
      images: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));

    form.setValue("images", newImages as never);
    form.trigger("images");

    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const fetchSavedOptions = async (id: string) => {
    try {
      const response = await getProductById(id);
      const variantKeys = Array.from(
        new Set(
          response.data.productVariants?.flatMap((product) =>
            Object.keys(product.variantOptions)
          )
        )
      );
      setSavedOptionNames(variantKeys);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleOptionChange = (
    index: number,
    field: "name" | "value" | "isNew",
    value: string | boolean
  ) => {
    const updatedOptions = options.map((option, i) =>
      i === index ? { ...option, [field]: value } : option
    );

    setOptions(updatedOptions);

    const checkField = field;
    const checkValue = value;

    if (checkField !== "isNew" && typeof checkValue !== "boolean") {
      form.setValue(`options.${index}.${checkField}`, checkValue);
    }
  };

  const addOption = () => {
    setOptions([...options, { name: "", value: "", isNew: false }]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    form.setValue("options", updatedOptions);
  };

  async function onSubmit(data: ProductFormValues) {
    const ProductVariantFormData = new FormData();
    const variantOptions = data.options.reduce((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {} as Record<string, string>);

    ProductVariantFormData.append("productId", selectedProduct?.id || "");
    ProductVariantFormData.append("sku", data.sku || "");
    ProductVariantFormData.append(
      "variantOptions",
      JSON.stringify(variantOptions)
    );
    ProductVariantFormData.append("price", data.price.toString());
    ProductVariantFormData.append("stock", data.stock.toString());

    if (data.images && data.images.length > 0) {
      ProductVariantFormData.append("image", data.images[0].file);
    }

    ProductVariantFormData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      setLoading(true);

      const productResult = await addProductVariant(ProductVariantFormData);

      if (productResult) {
        const updateSelectedProduct = await getProductById(
          productResult.data.productId
        );
        selectProduct(updateSelectedProduct.data);

        const newProducts = await getAllProducts();
        setProductLists(newProducts.data);
        toast.success("เพิ่มตัวเลือกสินค้าแล้ว");

        // รีเซ็ตค่าฟอร์มหลังจากบันทึกสำเร็จ
        form.reset();
        setImagePreviews([]);
        setSavedOptionNames([]);
        setOptions([]);
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSavedOptions(selectedProduct?.id || "");
  }, [selectedProduct]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary flex gap-2 items-center px-3">
          <CirclePlus />
          เพิ่มตัวเลือกสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] h-fit p-0">
        <DialogTitle className="hidden">เพิ่มตัวเลือกสินค้า</DialogTitle>
        <DialogDescription className="hidden">
          เพิ่มตัวเลือกสินค้าได้ที่นี่
        </DialogDescription>
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 px-8">
            <h1 className="text-xl font-bold">เพิ่มตัวเลือกสินค้า</h1>
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[calc(100vh-250px)] px-2">
                  <div className="space-y-6 p-2">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสสินค้า</FormLabel>
                          <FormControl>
                            <Input placeholder="กรอกรหัสของสินค้า" {...field} />
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
                        <div className="grid w-full items-center gap-1.5">
                          <FormLabel htmlFor="photo">รูปสินค้า</FormLabel>
                          <div
                            {...getRootProps()}
                            className="border-2 border-dashed border-gray-300 p-2 text-center"
                          >
                            <Input
                              {...getInputProps()}
                              id="photo"
                              type="file"
                              className=""
                            />
                            <span className="text-[14px] text-center font-semibold">
                              ลากและวางรูปภาพที่นี่, หรือคลิกเพื่อเลือก
                            </span>
                            <FormMessage />
                            <div className="flex justify-start items-center gap-x-2 gap-y-4 flex-wrap my-2">
                              {imagePreviews?.map((preview, index) => (
                                <div
                                  key={index}
                                  className="relative w-56 border-2 border-accent-800 rounded-md"
                                >
                                  <ResponsiveImage
                                    src={preview}
                                    alt={`Preview ${index}`}
                                  />
                                  <CircleX
                                    onClick={(event) => {
                                      event.stopPropagation();

                                      const currentImages =
                                        form.getValues("images") ?? [];
                                      const updatedImages =
                                        currentImages.filter(
                                          (_, i) => i !== index
                                        );

                                      form.setValue(
                                        "images",
                                        updatedImages as never
                                      );
                                      setImagePreviews((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                      form.trigger("images");
                                    }}
                                    size={20}
                                    className="text-red-400 hover:text-red-500 cursor-pointer absolute -top-3 -right-1"
                                  />
                                </div>
                              ))}
                            </div>
                            <span className="text-[12px] text-gray-400 text-center">
                              อัพโหลดได้เฉพาะไฟล์ .jpg, .png, and .webp เท่านั้น
                              และต้องมีขนาดไม่เกิน 5MB.
                            </span>
                          </div>
                        </div>
                      )}
                    />
                    {/* Options */}
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className="grid gap-1.5 grid-cols-1 sm:grid-cols-[1fr_1fr] items-start"
                      >
                        <FormField
                          control={form.control}
                          name={`options.${index}.name`}
                          render={({ field }) =>
                            option.isNew ? (
                              <FormItem className="w-full">
                                <FormLabel>ประเภทตัวเลือก</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="เช่น สี, ขนาด, รสชาติ"
                                    value={option.name}
                                    onChange={(e) =>
                                      handleOptionChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            ) : (
                              <FormItem className="w-full">
                                <FormLabel>ประเภทตัวเลือก</FormLabel>
                                <FormControl>
                                  <Select
                                    value={option.name}
                                    onValueChange={
                                      (value) =>
                                        handleOptionChange(index, "name", value) // ส่งค่า value ที่เลือกไปยัง handleOptionChange
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="เลือกประเภท" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {savedOptionNames.map((name, i) => (
                                        <SelectItem key={i} value={name}>
                                          {name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }
                        />
                        <FormField
                          control={form.control}
                          name={`options.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>ตัวเลือก</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={option.value}
                                  placeholder="เช่น แดง, 120 กรัม, เกลือ"
                                  onChange={(e) =>
                                    handleOptionChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              handleOptionChange(index, "isNew", !option.isNew)
                            }
                            className="w-full flex gap-2 items-center px-3"
                          >
                            {option.isNew ? (
                              <>
                                <ListPlus />
                                เลือกจากประเภทเดิม
                              </>
                            ) : (
                              <>
                                <CirclePlus />
                                เพิ่มประเภทใหม่
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="w-full"
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full flex gap-2 items-center px-3"
                    >
                      <CirclePlus />
                      เพิ่มประเภทตัวเลือก
                    </Button>
                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ราคา</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="กรอกราคาสินค้า"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Stock */}
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>จำนวน</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="กรอกจำนวนสต็อคสินค้า"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-6 flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" />
                            กำลังบันทึกข้อมูล
                          </>
                        ) : (
                          "บันทึกข้อมูล"
                        )}
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
