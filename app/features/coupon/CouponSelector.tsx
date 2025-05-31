"use client";

import { useEffect, useState } from "react";
import { Search, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coupon } from "@/types/baseTypes";
import { getAllCoupons } from "@/services/couponServices";
import { formatPrice } from "@/utils/formatPrice";

type Props = {
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
};
export default function CouponSelector({
  selectedCoupon,
  setSelectedCoupon,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Filter coupons based on search term
  const filteredCoupons = coupons?.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyCoupon = (coupon: (typeof coupons)[0]) => {
    setSelectedCoupon(coupon);
    setIsOpen(false);
  };

  // const handleRemoveCoupon = () => {
  //   setSelectedCoupon(null);
  // };

  useEffect(() => {
    const fetchCoupon = async () => {
      const coupons = await getAllCoupons();
      if (coupons.data.length) {
        setCoupons(coupons.data);
      }
    };
    fetchCoupon();
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant={selectedCoupon ? "outline" : "default"}
          className="w-full flex items-center justify-center gap-2"
        >
          <Tag size={16} />
          {selectedCoupon
            ? `คูปองที่ใช้: ${selectedCoupon.code}`
            : "ใช้คูปองส่วนลด"}
        </Button>
      </SheetTrigger>
      <SheetContent
        // side="bottom"
        // className="h-[80vh] sm:h-[70vh] overflow-y-auto"
        side="right"
        className="w-full md:w-[540px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">เลือกคูปองส่วนลด</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="ค้นหาคูปอง หรือใส่รหัสคูปอง"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredCoupons.length > 0 ? (
            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <Card
                  key={coupon.id}
                  className={`border ${
                    selectedCoupon?.id === coupon.id ? "border-primary" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {coupon.code}
                          {selectedCoupon?.id === coupon.id && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-primary text-primary-foreground"
                            >
                              กำลังใช้งาน
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">
                          {coupon.description}
                        </CardDescription>
                      </div>
                      <Badge className="text-lg font-bold">
                        - {coupon.discountValue}
                        {coupon.discountType === "fixed" ? "฿" : "%"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1">
                      {coupon.minOrderValue && coupon.minOrderValue > 0 ? (
                        <div className="flex items-start text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          <span>ยอดสั่งซื้อขั้นต่ำ{coupon.minOrderValue}</span>
                        </div>
                      ) : null}
                      {coupon.maxDiscount && coupon.maxDiscount > 0 ? (
                        <div className="flex items-start text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          <span>
                            ลดสูงสุดไม่เกิน {formatPrice(coupon.maxDiscount)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleApplyCoupon(coupon)}
                      className="w-full"
                      variant={
                        selectedCoupon?.id === coupon.id ? "outline" : "default"
                      }
                    >
                      {selectedCoupon?.id === coupon.id ? (
                        <span className="flex items-center">
                          <Check size={16} className="mr-2" />
                          กำลังใช้งาน
                        </span>
                      ) : (
                        "ใช้คูปองนี้"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">ไม่พบคูปองที่ตรงกับการค้นหา</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
