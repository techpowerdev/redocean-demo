"use client";

import { useAddressStore } from "@/state-stores/addressStore";
import React, { useEffect, useState } from "react";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import {
  createOrderWithPaymentIntent,
  summaryOrderBeforeCheckout,
} from "@/services/orderServices";
import {
  CreateOrderItem,
  CreateOrderWithPaymentIntentParams,
  OrderSummary,
} from "@/types/orderTypes";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { ShippingAddress } from "@/types/addressTypes";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { formatPrice } from "@/utils/formatPrice";
import CouponSelector from "@/app/features/coupon/CouponSelector";
import { Coupon } from "@/types/baseTypes";
import { validateCoupon } from "@/services/couponServices";
import { X } from "lucide-react";
import { getCurrentUser } from "@/services/authServices";
import { GetCurrentUserResponse } from "@/types/userTypes";

type Props = {
  singleItem?: CreateOrderItem;
  cartItems?: CreateOrderItem[];
};

export default function PlaceOrder({ singleItem, cartItems }: Props) {
  // global state
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const clearCart = useCartServerStore((state) => state.clearCart);

  // local state
  const [currentUser, setCurrentUser] = useState<
    GetCurrentUserResponse["data"] | null
  >(null);

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sheet
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [counponDiscountValue, setCouponDiscountValue] = useState(0);

  // navigation
  const router = useRouter();

  const items = singleItem ? [singleItem] : cartItems || [];

  const checkAuth = () => {
    if (!currentUser) {
      router.push("/login"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }
  };
  const handleOpenPlaceOrderForm = async () => {
    try {
      checkAuth();
      const { data } = await summaryOrderBeforeCheckout({
        items: items,
      });
      if (data) {
        const { items, ...orderData } = data;

        const availableItems = items?.filter(
          (item) => item.status === "available"
        );

        const unAvailableItems = items?.filter(
          (item) => item.status === "unavailable"
        );

        const newSorted = [...unAvailableItems, ...availableItems];

        setOrderSummary({ ...orderData, items: newSorted });
      }
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }
    setCreatingOrder(true);
    setIsOpen(true);

    try {
      if (selectedAddress) {
        // กำหนดฟิลด์ที่ต้องการเก็บไว้
        const {
          recipient,
          phoneNumber,
          address,
          street,
          subDistrict,
          district,
          province,
          postalCode,
        } = selectedAddress;

        const shippingAddress: ShippingAddress = {
          recipient,
          phoneNumber,
          address,
          street,
          subDistrict,
          district,
          province,
          postalCode,
        };

        let captureLater = false;

        // กรณีของ group buy จะต้องมีการ hold ไว้ก่อน ยังไม่ตัดบัตร
        if (items.some((item) => item.promotionType === "groupbuying")) {
          captureLater = true;
        }

        // สร้างข้อมูลใหม่ที่มีเฉพาะฟิลด์ที่ต้องการ
        const createPaymentData: CreateOrderWithPaymentIntentParams = {
          items: items,
          shippingAddress: shippingAddress,
          captureLater,
          couponCode: selectedCoupon?.code,
        };
        const { data } = await createOrderWithPaymentIntent(createPaymentData);

        if ("paymentIntent" in data) {
          const clientSecret = data.paymentIntent?.client_secret;
          if (clientSecret) {
            handleNextProcess(clientSecret);
            setIsOpen(false);
          }
        } else {
          if (!data.nextProcess) {
            const { items, ...orderData } = data;

            const availableItems = items?.filter(
              (item) => item.status === "available"
            );

            const unAvailableItems = items?.filter(
              (item) => item.status === "unavailable"
            );

            const newSorted = [...unAvailableItems, ...availableItems];

            setOrderSummary({ ...orderData, items: newSorted });
          }
        }
      } else {
        toast.error("กรุณาระบุที่อยู่การจัดส่ง");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleNextProcess = (clientSecret: string) => {
    if (cartItems?.length && cartItems?.length > 0) {
      clearCart();
    }
    router.push(`/checkout/${clientSecret}`);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setCouponDiscountValue(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUser();
      setCurrentUser(data);
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (!selectedCoupon?.code) {
      return;
    }

    const applyCoupon = async (couponcode: string) => {
      if (!orderSummary || !selectedCoupon?.code) {
        return;
      }

      const itemData = orderSummary?.items?.map((item) => ({
        productItemId: item.productItemId,
        productCategoryId: item.productModelItem.productItem.categoryId,
        productName: item.productModelItem.productItem.name,
      }));

      try {
        const validateCouponData = {
          code: couponcode,
          orderValue: orderSummary?.netAmount,
          orderItems: itemData,
        };

        const coupon = await validateCoupon(validateCouponData);

        if (coupon.data.discountValue) {
          setCouponDiscountValue(coupon.data.discountValue);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("เกิดข้อผิดพลาดในการตรวจสอบคูปอง");
        }
        setSelectedCoupon(null);
      }
    };

    applyCoupon(selectedCoupon?.code);
  }, [selectedCoupon, orderSummary]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Button
          onClick={handleOpenPlaceOrderForm}
          disabled={!items.length}
          className="w-full sm:w-2/3"
        >
          สั่งซื้อสินค้า
        </Button>
        <SheetTitle />
        <SheetContent className="w-full md:w-[540px] overflow-y-auto">
          <AddressSelector />
          {orderSummary && (
            <>
              <OrderSummarySection orderData={orderSummary} />
              <div className="my-4">
                {selectedCoupon && (
                  <div className="flex justify-between text-gray-500 my-2">
                    <span className="flex items-center gap-2">
                      <button
                        onClick={handleRemoveCoupon}
                        className="ml-2 text-gray-400 hover:text-red-500"
                        aria-label="ลบคูปอง"
                      >
                        <X size={20} />
                      </button>
                      ส่วนลดคูปอง ({selectedCoupon.code})
                    </span>
                    <span>- {`${formatPrice(counponDiscountValue)}`}</span>
                  </div>
                )}
                <CouponSelector
                  selectedCoupon={selectedCoupon}
                  setSelectedCoupon={setSelectedCoupon}
                />
              </div>
              <div className="text-green-600 text-lg font-semibold text-center my-2">
                ยอดเงินที่ต้องชำระ :{" "}
                {formatPrice(orderSummary?.netAmount - counponDiscountValue)}
              </div>
            </>
          )}

          <Button
            size={"lg"}
            className="w-full text-lg my-4"
            onClick={handleCheckout}
            disabled={
              creatingOrder || !items?.length || !orderSummary?.nextProcess
            }
          >
            {creatingOrder ? "กำลังดำเนินการ..." : "ดำเนินการสั่งซื้อ"}
          </Button>
          {!orderSummary?.nextProcess && (
            <span className="text-red-500">{`ไม่สามารถสั่งซื้อได้ โปรดตรวจสอบรายการสินค้า`}</span>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

type OrderSummaryProps = {
  orderData: OrderSummary;
};

function OrderSummarySection({ orderData }: OrderSummaryProps) {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">สรุปรายการสั่งซื้อ</h1>

      <div className="flex flex-col gap-2 divide-y-[1px]  divide-red-200  p-2 border rounded-sm">
        {orderData.items.map((item) => {
          return (
            <div
              key={item.productModelItem.productItem.id}
              className="py-2 px-1"
            >
              <div className="grid grid-cols-[20%_2fr_1fr] gap-2">
                <div className="w-full h-fit">
                  {item.productModelItem.image && (
                    <ResponsiveImage
                      alt={`productImage`}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${item.productModelItem.image}`}
                    />
                  )}
                </div>
                <div>
                  <h1 className="font-semibold text-lg">
                    {item.productModelItem.productItem.name}
                  </h1>
                  <div className="text-sm text-gray-500">
                    {item.productModelItem.name}
                  </div>
                  <div className="flex flex-col items-start mt-2">
                    <span className="text-green-500">
                      {formatPrice(item.priceInfo.discountedPrice)}
                    </span>
                    {item.priceInfo.discount > 0 && (
                      <span className="text-xs text-red-500">
                        ส่วนลด {formatPrice(item.priceInfo.discount)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-end text-gray-500">
                    <span className="text-xs mx-1">x</span>
                    {item.quantity}
                  </div>

                  <div className="text-end">
                    {formatPrice(item.priceInfo.netAmount)}
                  </div>
                </div>
              </div>
              {item.warningMessage && (
                <div
                  className="text-center text-red-500 mt-4
                 text-xs font-semibold"
                >
                  ** {item.warningMessage}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="text-green-600 text-lg font-semibold text-center my-2">
        ยอดเงินที่ต้องชำระ : {formatPrice(orderData.netAmount)}
      </div> */}
    </div>
  );
}
