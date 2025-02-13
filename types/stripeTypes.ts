type PaymentStateType = "initial_payment" | "additional_payment"; //  การจ่ายเงินครั้งแรก ,การจ่ายเงินเพิ่มเติม
export interface CreatePaymentIntentParam {
  orderId: string;
  amount: number;
  currency?: string; // default: "thb"
  captureLater?: boolean; // default: false
  paymentState?: PaymentStateType; // default: "initial_payment"
}
export interface CreatePaymentIntentResponse {
  clientSecret: string;
}
