import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatDateTH } from "@/utils/formatDate";
import { stores } from "@/app/features/voucher/stores";

interface GiftVoucherProps {
  children?: React.ReactNode[];
  storeName: string | null;
  value: number;
  serialNumber?: string;
  expiryDate: string | null;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  qrValue?: string;
}

export default function GiftVoucherCard({
  children,
  storeName,
  value,
  serialNumber,
  expiryDate,
  backgroundColor = "#DC2626",
  textColor = "#ffffff",
  borderColor = "#DC2626",
  // backgroundColor = "#e11d48",
  // textColor = "#ffffff",
  // borderColor = "#f43f5e",
  qrValue,
}: GiftVoucherProps) {
  // Generate QR code value if not provided
  // const qrCodeValue =
  //   qrValue || `VOUCHER:${storeName}:${value}:${serialNumber}`;
  const qrCodeValue = qrValue || `${serialNumber}`;

  // Match logo URL based on store name
  const storeLogoUrl = storeName
    ? stores.find((store) => store.storeName === storeName)?.logo || null
    : null;

  return (
    <div className="relative max-w-md mx-auto">
      <Card
        className="overflow-hidden border-2 flex flex-col"
        style={{ borderColor: borderColor }}
      >
        {/* Header section */}
        <div
          className="p-4 flex justify-between items-center"
          style={{ backgroundColor, color: textColor }}
        >
          {storeLogoUrl && (
            <div className="relative h-12 w-24">
              <Image
                src={storeLogoUrl}
                alt={`${storeName} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* <div className="text-left w-24">
            <p className="break-words">BigCCBigCCBigCCBigCCBigCCBigCC</p>
          </div> */}

          <div className="text-right">
            <p className="text-sm font-medium">บัตรกำนัล</p>
            <p className="text-sm font-medium">GIFT VOUCHER</p>
          </div>
        </div>

        {/* Value section */}
        <div className="bg-white p-6 flex flex-col items-center justify-center">
          <p className="text-gray-600 text-sm mb-1">มูลค่า / VALUE</p>
          <div className="flex items-center">
            <span className="text-4xl font-bold mr-1">฿</span>
            <span className="text-5xl font-bold">{value}</span>
          </div>
          <p className="text-gray-600 text-sm mt-2">บาท / BAHT</p>
        </div>

        {/* Footer section */}
        <div
          className="p-4 flex justify-between items-center"
          style={{ backgroundColor, color: textColor }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>
                หมดอายุ:{" "}
                {expiryDate ? formatDateTH(expiryDate) : "ไม่มีวันหมดอายุ"}
              </span>
            </div>
            {serialNumber && (
              <p className="text-xs mt-1">เลขที่: {serialNumber}</p>
            )}
          </div>
          {serialNumber && (
            <div className="bg-white p-1 rounded">
              <QRCodeSVG
                value={qrCodeValue}
                size={40}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                marginSize={0}
              />
            </div>
          )}
        </div>

        {/* Terms section */}
        <div className="bg-white p-3 text-xs text-gray-600 border-t">
          <p>• ใช้แทนเงินสดเพื่อซื้อสินค้าที่ร่วมรายการ</p>
          <p>• ไม่สามารถแลกเปลี่ยนหรือทอนเป็นเงินสด</p>
          <p>• กรุณาตรวจสอบเงื่อนไขเพิ่มเติมที่จุดจำหน่าย</p>
        </div>

        <div className="p-2"> {children}</div>
      </Card>
    </div>
  );
}
