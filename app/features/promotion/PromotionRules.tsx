import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  minimumPurchaseQuantity: number;
};

export default function PromotionRules({ minimumPurchaseQuantity }: Props) {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-medium">
          เงื่อนไขของกิจกรรม
        </AccordionTrigger>

        <AccordionContent>
          <ul className="flex flex-col gap-2 list-disc pl-5 text-base">
            <li>
              ท่านจะได้สินค้าตามราคาในโปรโมชั่นนี้
              เมื่อมียอดการสั่งซื้อจากทุกคนรวมกันได้{" "}
              <strong className="text-red-500 underline">
                {minimumPurchaseQuantity} ชิ้น
              </strong>{" "}
              ขึ้นไปเท่านั้น
            </li>
            <li>
              กรณีที่มียอดรวมการสั่งซื้อทั้งหมดไม่ถึง{" "}
              <strong className="text-red-500 underline">
                {minimumPurchaseQuantity} ชิ้น
              </strong>{" "}
              ท่านจะได้รับข้อความแจ้งเตือนทางไลน์ให้ดำเนินการต่อไปนี้
              <ol className="list-decimal pl-5">
                <li>
                  ท่านสามารถยืนยันที่จะสั่งซื้อต่อไป
                  โดยต้องชำระเงินเพิ่มตามจำนวนส่วนลดที่ได้รับตอนสั่งซื้อ
                </li>
                <li>
                  ท่านสามารถขอยกเลิกการสั่งซื้อ
                  และระบบจะดำเนินการคืนเงินให้ท่านตามจำนวนเงินที่ได้ชำระไว้
                </li>
              </ol>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
