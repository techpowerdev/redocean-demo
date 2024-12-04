export type DiscountType = "fixed" | "percent";

export function calculateDiscountedPrice(
  originalPrice: number,
  discountValue: number,
  discountType: DiscountType
): { discountAmount: number; discountedPrice: number } {
  if (originalPrice < 0 || discountValue < 0) {
    throw new Error("Original price and discount value must be non-negative.");
  }

  let discountAmount = 0;

  if (discountType === "fixed") {
    discountAmount = Math.min(discountValue, originalPrice); // ส่วนลดสูงสุดไม่เกินราคาสินค้า
  } else if (discountType === "percent") {
    discountAmount = (originalPrice * discountValue) / 100;
  } else {
    throw new Error("Invalid discount type. Use 'fixed' or 'percent'.");
  }

  const discountedPrice = Math.max(originalPrice - discountAmount, 0); // ราคาสุดท้ายอย่างน้อยต้องเป็น 0

  return {
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
  };
}
