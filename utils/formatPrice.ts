export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("th", {
    style: "currency",
    currency: "THB",
  }).format(amount);
};
