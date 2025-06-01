"use client";

import { useState } from "react";
import { Copy, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface VoucherCardProps {
  title: string;
  code: string;
  discount: string;
  description: string;
  expiryDate: string;
  terms: string[];
  isNew?: boolean;
}

export default function VoucherCard({
  title = "ส่วนลด 20% สำหรับการสั่งซื้อครั้งแรก",
  code = "FIRST20",
  discount = "20%",
  description = "รับส่วนลด 20% สำหรับการสั่งซื้อครั้งแรกของคุณ สูงสุด 500 บาท",
  expiryDate = "31 พฤษภาคม 2025",
  terms = [
    "ใช้ได้เฉพาะการสั่งซื้อครั้งแรกเท่านั้น",
    "ส่วนลดสูงสุด 500 บาท",
    "ไม่สามารถใช้ร่วมกับโปรโมชั่นอื่นได้",
  ],
  isNew = true,
}: VoucherCardProps) {
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "คัดลอกรหัสส่วนลดแล้ว",
      description: `รหัส ${code} ถูกคัดลอกไปยังคลิปบอร์ดแล้ว`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-2">
      {isNew && (
        <div className="bg-green-500 text-white text-xs font-medium py-1 text-center">
          โปรโมชั่นใหม่
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Badge className="bg-rose-500 hover:bg-rose-600 text-lg px-3 py-1.5 h-auto font-bold">
            {discount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            หมดอายุ: {expiryDate}
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted rounded-md mb-4">
          <div className="font-mono font-bold text-lg">{code}</div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 gap-1"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            {copied ? "คัดลอกแล้ว" : "คัดลอกรหัส"}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            เงื่อนไขการใช้งาน
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
            {terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button className="w-full">ใช้คูปองนี้</Button>
      </CardFooter>
    </Card>
  );
}
