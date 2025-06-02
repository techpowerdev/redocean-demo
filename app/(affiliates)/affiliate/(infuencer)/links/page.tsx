"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  generateAffiliateLink,
  getAffiliateLinks,
} from "@/services/affiliateServices";
import { GetAffiliateLinksResponse } from "@/types/affiliateTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productLinkSchema = z.object({
  productLink: z
    .string()
    .url({
      message:
        "กรุณากรอกลิงก์ที่ถูกต้อง เช่น https://khumkha.com/product/cm9hhbxz3000a",
    })
    .min(1, { message: "กรุณากรอกลิงก์สินค้า" }),
});

type ProductLinkSchema = z.infer<typeof productLinkSchema>;

export default function AffiliateLinks() {
  const { toast } = useToast();
  const [affiliateLinks, setAffiliateLinks] = useState<
    GetAffiliateLinksResponse["data"] | null
  >(null);

  const form = useForm<ProductLinkSchema>({
    resolver: zodResolver(productLinkSchema),
    defaultValues: {
      productLink: "",
    },
  });

  const onSubmit = async (data: ProductLinkSchema) => {
    console.log("Product link:", data.productLink);
    const url = new URL(data.productLink);
    const pathname = url.pathname; // "/product/cm9hhbxz3000a1ffj7w1mahe3"
    const productId = pathname.split("/product/")[1]; // "cm9hhbxz3000a1ffj7w1mahe3"

    const newAffiliateLink = await generateAffiliateLink(productId);

    const affiliateLinks = await getAffiliateLinks();
    if (affiliateLinks) {
      setAffiliateLinks(affiliateLinks.data);
    }

    toast({
      title: "ลิงก์สินค้าที่ได้รับ",
      description: newAffiliateLink.data.shortCode,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "คัดลอกลิงก์แล้ว",
      description: "ลิงก์ Affiliate ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const affiliateLinks = await getAffiliateLinks();
      if (affiliateLinks) {
        setAffiliateLinks(affiliateLinks.data);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-start">
        <h1 className="text-2xl font-bold">ลิงก์ Affiliate</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full my-2"
          >
            <FormField
              control={form.control}
              name="productLink"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://khumkha.com/product/cm9hhbxz3000a"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>สร้างลิงก์ใหม่</Button>
          </form>
        </Form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ลิงก์ของฉัน</CardTitle>
          <CardDescription>
            จัดการและติดตามลิงก์ Affiliate ของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {affiliateLinks?.length ? (
              affiliateLinks?.map((affiliateLink) => (
                <div key={affiliateLink.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium">
                        {affiliateLink?.productItem?.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `${process.env.NEXT_PUBLIC_API_BASE_URL}/track/affiliate/${affiliateLink.shortCode}`
                            )
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          คัดลอก
                        </Button>
                        <Link
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/track/affiliate/${affiliateLink.shortCode}`}
                          target="_blank"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            เปิด
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Input
                      value={`${process.env.NEXT_PUBLIC_API_BASE_URL}/track/affiliate/${affiliateLink.shortCode}`}
                      readOnly
                      onClick={(e) => e.currentTarget.select()}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-primary">ยังไม่มี link</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
